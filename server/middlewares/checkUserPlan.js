import asyncHandler from "express-async-handler";
import User from "../models/user.js";

export const checkUserPlan = asyncHandler(async (req, res, next) => {
    try {
        // get the login user
        const user = await User.findById(req.user);
        if (!user) {
            return res.status(401).json({ message: 'User not found.' });
        }

        // check user plan
        if (!user?.hasSelectedPlan) {
            return res.status(400).json({ message: 'You must select a plan before creating a post' });
        }
        next();
    } catch (error) {
        return res.status(400).json({ error });
    }
})