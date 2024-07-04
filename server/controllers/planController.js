import asyncHandler from 'express-async-handler';
import Plan from '../models/plan.js';

//@desc     Create a plan
//@route    POST  /plan/create
//@access   Public
export const createPlan = asyncHandler(async (req, res) => {
    const { planName, features, price } = req.body;

    const planFound = await Plan.findOne({ planName });
    if (planFound) {
        throw new Error("Plan already exists");
    }

    // check the total number of plans
    const planCount = await Plan.countDocuments();
    if (planCount >= 2) {
        throw new Error("You can only have 2 plans");
    }

    const planCreated = await Plan.create({
        planName,
        features,
        price,
        user: req.user 
    });

    res.status(201).json({
        status: "success",
        message: "Plan created successfully",
        plan: planCreated,
    });
});

//@desc     get all plans
//@route    GET  /plan
//@access   Public
export const getAllPlans = asyncHandler(async (req, res) => {
    const plans = await Plan.find();

    res.status(201).json({
        status: "success",
        message: "Plans fetched successfully",
        plans,
    });
});

//@desc     get a plan
//@route    GET  /posts/:postId
//@access   Public
export const getPlan = asyncHandler(async (req, res) => {
    const planId = req.params.planId;

    const planFound = await Plan.findById(planId);
    if (!planFound) {
        throw new Error("Plan not found");
    }
    res.status(201).json({
        status: "success",
        message: "Plan fetched successfully",
        planFound,
    });
});

//@desc     update plan
//@route    PUT  /plan/:planId
//@access   Private
export const updatePlan = asyncHandler(async (req, res) => {
    const planId = req.params.planId;

    const planFound = await Plan.findById(categoryId);
    if (!planFound) {
        throw new Error("Plan not found");
    }

    const planUpdated = await Plan.findByIdAndUpdate(
        planId,{
            planName: req.body.planName,
            features: req.body.features,
            price: req.body.price
        },
        {
            new: true,
        }
    );

    res.status(201).json({
        status: "Plan updated successfully",
        plan: planUpdated,
    });
});

//@desc     delete plan
//@route    DELETE  /plan/:planId
//@access   Private
export const deletePlan = asyncHandler(async (req, res) => {
    const planId = req.params.planId;

    const planFound = await Plan.findByIdAndDelete(planId);
    if (!planFound) {
        throw new Error("Plan not found");
    }

    res.status(201).json({
        status: "Plan deleted successfully",
    });
});