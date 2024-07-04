import express from 'express';
import multer from 'multer';
import { postStorage } from '../utils/fileUpload.js';

import { createPost, getAllPost, getPost, updatePost, deletePost, likePost, dislikePost } from '../controllers/postController.js';
import { protect } from '../middlewares/protect.js';
import { checkUserPlan } from '../middlewares/checkUserPlan.js';
import { optionalAuth } from '../middlewares/optionalAuth.js';
import { isAccountVerified } from '../middlewares/isAccountVerified.js';
import { isBlocked } from '../middlewares/isBlocked.js';

const router = express.Router();

// create multer instance
const upload = multer({ storage: postStorage});

router.get("/", getAllPost);

router.post("/create", protect, isBlocked, checkUserPlan, isAccountVerified, upload.single("image"), createPost);

router.get("/:postId", optionalAuth, getPost);

router.put("/:postId", protect, isBlocked, upload.single("image"), updatePost);

router.delete("/:postId", protect, isBlocked, deletePost);

router.put("/likes/:postId", protect, isBlocked, likePost);

router.put("/dislikes/:postId", protect, isBlocked, dislikePost);

export default router;