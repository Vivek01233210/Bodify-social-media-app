import User from '../models/user.js';
import asyncHandler from 'express-async-handler';

export const isAdmin = asyncHandler(async (req, res, next) => {
    // get the login user
    const user = await User.findById(req.user);

    // check user isAdmin status
    if(!user?.isAdmin) {
        return res.status(403).json({message: 'You are not an Admin'});
    }

    next();
});