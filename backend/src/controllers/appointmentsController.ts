// src/controllers/appointmentController.ts
import { Request, Response } from "express";
import { Appointment } from "../models/Appointments";

export const addAppointment = async (req: Request, res: Response) => {
  try {
    const { cust_id, branch_id, date_for_inquiry, time_start, time_end, status } = req.body;

    if (!cust_id || !branch_id || !date_for_inquiry || !time_start || !time_end) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check for existing pending appointments (any date)
    const hasPending = await Appointment.findOne({ cust_id, status: "Pending" });
    if (hasPending) {
      return res.status(400).json({ error: "Customer already has a pending appointment" });
    }

    // Check for existing approved appointments from today onwards
    const hasApprovedFuture = await Appointment.findOne({
      cust_id,
      status: "Approved",
      date_for_inquiry: { $gte: today },
    });
    if (hasApprovedFuture) {
      return res.status(400).json({ error: "Customer already has an approved appointment today or in the future" });
    }

    // Auto-generate appointment_id
    const lastAppointment = await Appointment.findOne({}).sort({ _id: -1 }); // get last inserted
    const nextId = lastAppointment ? Number(lastAppointment.appointment_id.split("-")[1]) + 1 : 1;
    const appointment_id = `APPT-${nextId}`;

    const newAppointment = new Appointment({
      appointment_id,
      cust_id,
      branch_id,
      date_for_inquiry,
      time_start,
      time_end,
      status: status || "Pending",
    });

    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (error) {
    console.error("Error adding appointment:", error);
    res.status(500).json({ error: "Failed to add appointment" });
  }
};

export const getLatestAppointmentByCustomer = async (req: Request, res: Response) => {
  try {
    const { cust_id } = req.params;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // only consider today or future

    // Find the latest appointment from today onwards
    const latestAppointment = await Appointment.findOne({
      cust_id,
      date_for_inquiry: { $gte: today },
    }).sort({ date_for_inquiry: 1 }); // earliest upcoming appointment

    if (!latestAppointment) {
      return res.status(404).json({ error: "No upcoming appointments found" });
    }

    res.status(200).json(latestAppointment);
  } catch (error) {
    console.error("Error fetching latest appointment:", error);
    res.status(500).json({ error: "Failed to fetch appointment" });
  }
};


export const deletePendingByCustomer = async (req: Request, res: Response) => {
  try {
    const { cust_id } = req.params;

    // Only delete Pending appointments
    const deleted = await Appointment.deleteMany({ cust_id, status: "Pending" });

    if (deleted.deletedCount === 0) {
      return res.status(404).json({ error: "No pending appointment found to delete" });
    }

    res.status(200).json({ message: "Pending appointment(s) deleted successfully" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ error: "Failed to delete appointment" });
  }
};
