import asyncHandler from 'express-async-handler'
import User from '../models/user.js'

// To check if EMAIL is verified
export const isAccountVerified = asyncHandler(async (req, res, next) => {
    // get the login user
    const user = await User.findById(req.user);
    if(!user){
        return res.status(401).json({message: 'User not found.'});
    }

    // check user plan
    if(!user.isEmailVerified){
        return res.status(401).json({message: 'Please verify your email to continue.'});
    }
    next();
});