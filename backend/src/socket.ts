import { ChangeStreamDocument } from "mongodb";
import mongoose from "mongoose";
import { Server, Socket } from "socket.io";

export function initSocket(io: Server, db: mongoose.Connection) {
  // Handle client connections
  io.on("connection", (socket: Socket) => {
    console.log("✅ Client connected:", socket.id);

    // Allow clients to join specific line item rooms for targeted updates
    socket.on("joinLineItem", (lineItemId: string) => {
      socket.join(`lineItem:${lineItemId}`);
      console.log(`🔗 Client ${socket.id} joined room for line item: ${lineItemId}`);
    });

    socket.on("leaveLineItem", (lineItemId: string) => {
      socket.leave(`lineItem:${lineItemId}`);
      console.log(`🔓 Client ${socket.id} left room for line item: ${lineItemId}`);
    });

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });

  // Helper: watch a collection and restart on error/close with exponential backoff
  const watchCollectionWithRestart = (collectionName: string, onChange: (change: any) => void) => {
    let closed = false;
    let watchHandle: any = null;
    let attempt = 0;

    const start = () => {
      if (closed) return;
      try {
        const coll = db.collection(collectionName);
        watchHandle = coll.watch([], { fullDocument: 'updateLookup' });
        console.log(`🔍 Watching collection ${collectionName}`);

        watchHandle.on('change', (change: any) => {
          attempt = 0;
          try { onChange(change); } catch (e) { console.error('watch onChange handler failed', e); }
        });

        watchHandle.on('error', (err: any) => {
          console.warn(`⚠️ Change stream error on ${collectionName}:`, err);
          try { watchHandle.close(); } catch (e) {}
          watchHandle = null;
          scheduleRestart();
        });

        watchHandle.on('close', () => {
          console.warn(`⚠️ Change stream closed for ${collectionName}`);
          watchHandle = null;
          scheduleRestart();
        });
      } catch (err) {
        console.warn(`⚠️ Unable to start watcher for ${collectionName}:`, err);
        scheduleRestart();
      }
    };

    const scheduleRestart = () => {
      if (closed) return;
      attempt = Math.min(10, attempt + 1);
      const delay = Math.min(30_000, 500 * Math.pow(2, attempt));
      console.log(`⏳ Scheduling restart of ${collectionName} watcher in ${delay}ms (attempt ${attempt})`);
      setTimeout(() => start(), delay);
    };

    start();

    return {
      close: () => {
        closed = true;
        try { watchHandle?.close(); } catch (e) {}
      }
    };
  };

  // Setup MongoDB Change Stream for `appointments`
  watchCollectionWithRestart('appointments', (change) => {
    console.log('📢 Appointment change received:', change);
    io.emit('appointmentUpdated', change);
  });

  // Watch announcements collection and broadcast changes (resilient)
  watchCollectionWithRestart('announcements', (change) => {
    console.log('📢 Announcement change received:', change);
    io.emit('announcementsUpdated', change);
  });

  // Watch promos collection and broadcast changes (resilient)
  watchCollectionWithRestart('promos', (change) => {
    console.log('📢 Promo change received:', change);
    io.emit('promosUpdated', change);
  });

  // Watch dates collection for real-time updates
  try {
    const datesCollection = db.collection("dates");
    datesCollection.watch([], { fullDocument: "updateLookup" }).on("change", (change: ChangeStreamDocument) => {
      console.log("📢 Dates change received:", change);
      
      // Extract line_item_id from different sources depending on operation type
      let lineItemId = null;
      let fullDocument = null;
      
      if (change.operationType === 'insert' || change.operationType === 'update' || change.operationType === 'replace') {
        const changeWithDoc = change as any; // Type assertion for operations that have fullDocument
        if (changeWithDoc.fullDocument?.line_item_id) {
          lineItemId = changeWithDoc.fullDocument.line_item_id;
          fullDocument = changeWithDoc.fullDocument;
        }
      } else if (change.operationType === 'delete' && change.documentKey?._id) {
        // For delete operations, we might need to handle differently
        lineItemId = change.documentKey._id;
        fullDocument = null;
      }
      
      if (lineItemId) {
        const updateData = {
          lineItemId,
          operationType: change.operationType,
          change,
          fullDocument: fullDocument
        };

        // Emit to specific line item room for targeted updates
        io.to(`lineItem:${lineItemId}`).emit("datesUpdated", updateData);
        
        // Also emit globally for any general listeners
        io.emit("datesUpdated", updateData);
        
        console.log(`📤 Emitted dates update for line item: ${lineItemId}`);
      } else {
        console.warn("⚠️ Could not extract line_item_id from dates change:", change);
      }
    });
  } catch (err) {
    console.warn("⚠️ Unable to watch dates collection for changes:", err);
  }

  // Watch line_items collection for location and status changes
  try {
    const lineItemsCollection = db.collection("line_items");
    lineItemsCollection.watch([], { fullDocument: "updateLookup" }).on("change", (change: ChangeStreamDocument) => {
      console.log("📢 LineItem change received:", change);
      
      // Extract line_item_id from different sources
      let lineItemId = null;
      let fullDocument = null;
      
      if (change.operationType === 'insert' || change.operationType === 'update' || change.operationType === 'replace') {
        const changeWithDoc = change as any; // Type assertion for operations that have fullDocument
        if (changeWithDoc.fullDocument?.line_item_id) {
          lineItemId = changeWithDoc.fullDocument.line_item_id;
          fullDocument = changeWithDoc.fullDocument;
        }
      } else if (change.operationType === 'delete' && change.documentKey?._id) {
        // For delete operations, the document is no longer available
        console.log("Delete operation detected, skipping line item update");
        return;
      }
      
      if (lineItemId) {
        const updateData = {
          lineItemId,
          operationType: change.operationType,
          change,
          fullDocument: fullDocument
        };

        // Emit to specific line item room
        io.to(`lineItem:${lineItemId}`).emit("lineItemUpdated", updateData);
        
        // Also emit globally
        io.emit("lineItemUpdated", updateData);
        
        console.log(`📤 Emitted line item update for: ${lineItemId}`);
      } else {
        console.warn("⚠️ Could not extract line_item_id from line item change:", change);
      }
    });
  } catch (err) {
    console.warn("⚠️ Unable to watch line_items collection for changes:", err);
  }
}
