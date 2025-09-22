import mongoose from "mongoose";
import { Server, Socket } from "socket.io";

export function initSocket(io: Server, db: mongoose.Connection) {
  // Handle client connections
  io.on("connection", (socket: Socket) => {
    console.log("✅ Client connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });

  // Setup MongoDB Change Stream for `appointments`
  const appointmentsCollection = db.collection("appointments");
  appointmentsCollection.watch([], { fullDocument: "updateLookup" }).on("change", (change) => {
    console.log("📢 Appointment change received:", change);
    io.emit("appointmentUpdated", change);
  });

  // Watch announcements collection and broadcast changes
  try {
    const announcementsCollection = db.collection("announcements");
    announcementsCollection.watch([], { fullDocument: "updateLookup" }).on("change", (change) => {
      console.log("📢 Announcement change received:", change);
      // Map a smaller payload so clients can refresh or apply the change
      io.emit("announcementsUpdated", change);
    });
  } catch (err) {
    console.warn("⚠️ Unable to watch announcements collection for changes:", err);
  }

  // Watch promos collection and broadcast changes
  try {
    const promosCollection = db.collection("promos");
    promosCollection.watch([], { fullDocument: "updateLookup" }).on("change", (change) => {
      console.log("📢 Promo change received:", change);
      io.emit("promosUpdated", change);
    });
  } catch (err) {
    console.warn("⚠️ Unable to watch promos collection for changes:", err);
  }
}
