// src/routes/branchRoutes.ts
import express from "express";
import { getBranchesOfTypeB } from "../controllers/branchController";

const router = express.Router();

// GET all branches of type B
router.get("/b", getBranchesOfTypeB);

export default router;
