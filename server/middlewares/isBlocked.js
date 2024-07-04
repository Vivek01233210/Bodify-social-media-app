import User from '../models/user.js';
import asyncHandler from 'express-async-handler';

export const isBlocked = asyncHandler(async (req, res, next) => {
    // get the login user
    const user = await User.findById(req.user);
    // check user isBlocked status
    if(user?.isBlocked) {
        return res.status(403).json({message: 'Your account is blocked, please contact support'});
    }
    next();
});