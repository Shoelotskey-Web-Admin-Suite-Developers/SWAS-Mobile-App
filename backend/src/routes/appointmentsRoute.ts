// src/routes/appointmentsRoute.ts
import express from "express";
import {
  addAppointment,
  deletePendingByCustomer,
  getLatestAppointmentByCustomer,
} from "../controllers/appointmentsController";

const router = express.Router();

// ✅ Add a new appointment
router.post("/", addAppointment);

// ✅ Get all appointments for a specific customer
router.get("/customer/:cust_id", getLatestAppointmentByCustomer);

// ✅ Delete pending appointments for a specific customer
router.delete("/customer/:cust_id/pending", deletePendingByCustomer);

export default router;
