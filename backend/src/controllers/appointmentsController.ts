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

    // Check for existing pending appointments from today onwards (not past appointments)
    const hasPendingFuture = await Appointment.findOne({ 
      cust_id, 
      status: "Pending",
      date_for_inquiry: { $gte: today }
    });
    if (hasPendingFuture) {
      return res.status(400).json({ error: "Customer already has a pending appointment today or in the future" });
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

    // Check if timeslot is already full (max 3 appointments per branch/day/timeslot)
    // Normalize the date to ensure consistent comparison (start of day)
    const targetDate = new Date(date_for_inquiry);
    targetDate.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    const existingAppointments = await Appointment.countDocuments({
      branch_id,
      date_for_inquiry: { 
        $gte: targetDate, 
        $lt: nextDay 
      },
      time_start,
      status: { $in: ["Pending", "Approved"] } // Count both pending and approved
    });

    console.log(`🔍 Timeslot check: branch=${branch_id}, date=${targetDate.toISOString().split('T')[0]}, time=${time_start}, existing=${existingAppointments}/3`);

    if (existingAppointments >= 3) {
      console.log(`❌ TIMESLOT FULL: Rejecting appointment for ${branch_id} on ${targetDate.toISOString().split('T')[0]} at ${time_start}`);
      return res.status(400).json({ 
        error: "This timeslot is already full. Please choose a different time or date." 
      });
    }

    console.log(`✅ TIMESLOT AVAILABLE: Proceeding with appointment creation`);
    

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

    // Allow cancellation of both Pending and Approved appointments
    const deleted = await Appointment.deleteMany({ 
      cust_id, 
      status: { $in: ["Pending", "Approved"] } 
    });

    if (deleted.deletedCount === 0) {
      return res.status(404).json({ error: "No appointment found to cancel" });
    }

    res.status(200).json({ message: "Appointment(s) cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).json({ error: "Failed to cancel appointment" });
  }
};
