import asyncHandler from 'express-async-handler';
import Earning from '../models/earning.js';

// @desc    get all earnings
// @route   GET /api/earnings
// @access  Private
export const getAllEarnings = asyncHandler(async (req, res) => {
    let earnings = await Earning.aggregate([
        {
            $group: {
                _id: "$user",
                totalAmount: { $sum: "$amount" },

            }
        },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "user",
            }
        },
        {
            $unwind: "$user"
        },
        {
            $sort: { totalAmount: -1 }
        }
    ]);

    // Add a rank field to each document
    earnings = earnings.map((earning, index) => {
        return {
            ...earning,
            rank: index + 1
        }
    });

    res.status(201).json({
        results: earnings.length,
        message: "Earnings fetched successfully",
        earnings
    });
});

// @desc    get user earnings
// @route   GET /api/earnings/my-earnings
// @access  Private
export const getUserEarnings = asyncHandler(async (req, res) => {
    const earnings = await Earning.find({ user: req.user }).populate({
        path: 'post',
        select: 'author',
        populate: {
            path: 'author',
        }
    });

    res.status(201).json({
        results: earnings.length,
        message: "Earnings fetched successfully",
        earnings
    });
});