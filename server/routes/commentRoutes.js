import express from 'express';

import { protect } from '../middlewares/protect.js';
import { createComment } from '../controllers/commentController.js';

const router = express.Router();


router.post("/create", protect, createComment);

export default router;