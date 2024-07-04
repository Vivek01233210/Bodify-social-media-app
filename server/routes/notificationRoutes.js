import express from 'express';

import { getAllNotifications, readNotification } from '../controllers/notificationController.js';
// import { protect } from '../middlewares/protect.js';

const router = express.Router();


router.get("/", getAllNotifications);

router.put("/:notificationId", readNotification);

export default router;