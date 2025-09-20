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
}
