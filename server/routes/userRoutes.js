import express from 'express';
import multer from 'multer';

import { register, login, googleAuth, googleAuthCallback, checkAuthenticated, logout, profile, followUser, unfollowUser, verifyEmailAccount, accountVerification, forgotPassword, resetPassword, updateEmail, updateProfilePicture, blockUser, unblockUser, listUsers } from '../controllers/userController.js';
import { protect } from '../middlewares/protect.js';

import {userStorage} from '../utils/fileUpload.js';
import { isAdmin } from '../middlewares/isAdmin.js';
// create a multer instance and set the destination folder
const upload = multer({ storage: userStorage });

const router = express.Router();


router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/auth/google", googleAuth);
router.get("/auth/google/callback", googleAuthCallback);
router.get("/checkAuthenticated", checkAuthenticated);
router.get("/profile", protect, profile);

router.put("/follow/:followId", protect, followUser);
router.put("/unfollow/:unfollowId", protect, unfollowUser);

// email verification routes
router.put("/account-verification-email", protect, verifyEmailAccount);
router.put("/verify-account/:verifyToken", protect, accountVerification);
router.put("/update-email", protect, updateEmail);

// password reset routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:resetToken", resetPassword);

router.put("/upload-profile-picture", protect, upload.single("image"), updateProfilePicture);

router.put("/block-user", protect, blockUser);
router.put("/unblock-user", protect, unblockUser);

router.get("/list-all-users", protect, isAdmin, listUsers);


export default router;