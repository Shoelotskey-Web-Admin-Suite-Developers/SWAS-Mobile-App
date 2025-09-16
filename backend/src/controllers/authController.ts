import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Customer } from "../models/Customer";

interface AuthRequest extends Request {
  user?: any;
}

// Create Customer (unchanged)
export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { cust_name, cust_bdate, cust_address, cust_contact, cust_email } = req.body;

    if (cust_email) {
      const existingEmail = await Customer.findOne({ cust_email });
      if (existingEmail) {
        return res.status(409).json({ error: "The email provided is already used by another customer." });
      }
    }

    const prefix = "CUST-00-";
    const lastCustomer = await Customer.findOne({ cust_id: { $regex: `^${prefix}` } }).sort({ cust_id: -1 });
    let nextNumber = "0001";
    if (lastCustomer) {
      const lastNum = parseInt(lastCustomer.cust_id.split("-")[2]);
      nextNumber = String(lastNum + 1).padStart(4, "0");
    }

    const customer = new Customer({
      cust_id: prefix + nextNumber,
      cust_name,
      cust_bdate: cust_bdate || null,
      cust_address: cust_address || null,
      cust_contact: cust_contact || null,
      cust_email: cust_email || null,
      total_services: 0,
      total_expenditure: 0,
    });

    await customer.save();
    return res.status(201).json({ message: "Customer created successfully", customer });
  } catch (err: any) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(409).json({ error: `Duplicate value found for '${field}': ${err.keyValue[field]}` });
    }
    return res.status(400).json({ error: err.message });
  }
};

// Login Customer → returns JWT
export const loginCustomer = async (req: Request, res: Response) => {
  const { firstName, lastName, cust_bdate } = req.body;

  if (!firstName || !lastName || !cust_bdate) {
    return res.status(400).json({ error: "Missing first name, last name, or birthdate" });
  }

  try {
    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const date = new Date(cust_bdate);

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const customer = await Customer.findOne({
      cust_name: fullName,
      cust_bdate: { $gte: startOfDay, $lte: endOfDay },
    });

    if (!customer) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
  { cust_id: customer.cust_id, cust_name: customer.cust_name },
  process.env.JWT_SECRET!,
  { expiresIn: "2h" }
);

  // 👇 return both token and cust_id
  return res.json({ 
    message: "Login successful", 
    token,
    userId: customer.cust_id   // <-- add this
  });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

// Get all customers → admin-only (optional)
export const getCustomers = async (req: AuthRequest, res: Response) => {
  // Example: you can enforce admin role if needed
  // if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });

  try {
    const customers = await Customer.find();
    return res.json({ customers });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

// Get a single customer → user can only access their own data
export const getCustomerById = async (req: AuthRequest, res: Response) => {
  try {
    const customer = await Customer.findOne({ cust_id: req.params.id });
    if (!customer) return res.status(404).json({ error: "Customer not found" });

    // Only allow access if cust_id matches the token
    if (req.user?.cust_id !== customer.cust_id) {
      return res.status(403).json({ error: "Forbidden: Access denied" });
    }

    return res.json({ customer });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
