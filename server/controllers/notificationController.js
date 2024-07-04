import asyncHandler from 'express-async-handler';
import Notification from '../models/notification.js';
import mongoose from 'mongoose';

//@desc     get all notifications
//@route    GET  /notifications
//@access   Private
export const getAllNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ });
    
    res.status(200).json({
        status: "success",
        result: notifications.length,
        notifications,
    });
});

//@desc     read notification by user
//@route    PUT  /notifications/:notificationId
//@access   Private
export const readNotification = asyncHandler(async (req, res) => {
    // get the notification id from params
    const notificationId = req.params.notificationId;

    // check is the notification id is valid
    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
        throw new Error('Invalid notification id');
    }

    // update the notification to read
    const notification = await Notification.findById(notificationId);
    if (!notification) {
        throw new Error('Notification not found');
    }
    notification.isRead = true;
    notification.save();

    res.status(200).json({
        status: "success",
        message: "Notification has been read successfully",
        notification,
    });
});