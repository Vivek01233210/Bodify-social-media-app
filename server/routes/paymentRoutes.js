import express from 'express';

import { protect } from '../middlewares/protect.js';
import { free, payment, verifyPayment } from '../controllers/stripePaymentController.js';

const router = express.Router();

// create payment
router.post("/checkout",protect, payment);

// verify payment
router.get("/verify/:paymentId",protect, verifyPayment);

// free plan
router.get("/free-plan", protect, free);

export default router;