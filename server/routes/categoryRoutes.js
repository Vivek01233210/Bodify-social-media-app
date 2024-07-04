import express from 'express';

import { getCategory, getAllCategories, createCategory, deleteCategory, updateCategory } from '../controllers/categoryController.js';
import { protect } from '../middlewares/protect.js';

const router = express.Router();


router.get("/", getAllCategories);

router.post("/create", protect, createCategory);

router.get("/:categoryId", getCategory);

router.put("/:categoryId", protect, updateCategory);

router.delete("/:categoryId", protect, deleteCategory);

export default router;