import express from 'express';


import { protect } from '../middlewares/protect.js';
import { createPlan, getAllPlans, getPlan, updatePlan, deletePlan } from '../controllers/planController.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();

router.post("/create", protect, isAdmin, createPlan);

router.get("/", getAllPlans);

router.get("/:planId", getPlan);

router.put("/:planId", protect, isAdmin, updatePlan);

router.delete("/:planId", protect, isAdmin, deletePlan);

export default router;