import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
import asyncHandler from 'express-async-handler';
import Plan from '../models/plan.js'
import User from '../models/user.js'
import Payment from '../models/payment.js'
import mongoose from 'mongoose';

//stripe make-payment controller
export const payment = asyncHandler(async (req, res) => {
    // get the plan id
    const { subscriptionPlanId } = req.body;

    // check for valid id of the plan
    if (!mongoose.isValidObjectId(subscriptionPlanId)) {
        return res.status(400).json({ message: 'Invalid plan' });
    }

    // Find the plan
    const plan = await Plan.findById(subscriptionPlanId);
    if (!plan) {
        return res.status(400).json({ message: 'Plan not found' });
    }

    // get the user id stored in the req object
    const user = req.user;

    // CREATE PAYMENT INTENT
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: plan.price * 100,
            currency: 'inr',
            automatic_payment_methods: {
                enabled: true
            },
            metadata: {
                userId: user?.toString(),
                subscriptionPlanId
            }
        });
        // send the response
        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            subscriptionPlanId,
            paymentIntent
        });
    } catch (error) {
        res.status(400).json({ error })
    }
});

// stripe verify-payment controller
export const verifyPayment = asyncHandler(async (req, res) => {
    // get the payment id
    const { paymentId } = req.params;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
    // console.log(paymentIntent);

    // confirm the payment status
    if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({ message: 'Payment verification failed!' });
    }

    // get data from the metadata
    const { userId, subscriptionPlanId } = paymentIntent?.metadata;

    // check for valid user id and plan id
    if (!userId || !subscriptionPlanId) {
        return res.status(400).json({ message: 'Payment verification failed!' });
    }

    // find the user in the database
    const userFound = await User.findById(userId);
    if (!userFound) {
        return res.status(400).json({ message: 'User not found' });
    }

    // get the payment details
    const amount = paymentIntent?.amount / 100;
    const currency = paymentIntent?.currency;

    // create payment history doc in the Payment db
    const newPayment = await Payment.create({
        user: userId,
        subscriptionPlan: subscriptionPlanId,
        status: "success",
        amount,
        currency,
        reference: paymentId,
    });

    // update the user profile
    if (newPayment) {
        userFound.hasSelectedPlan = true;
        userFound.plan = subscriptionPlanId;
        await userFound.save();
    }

    // send the response
    res.status(201).json({
        status: true,
        message: "Payment verified, user updated",
        userFound,
    });
});


// free plan
export const free = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user);
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    // update the user profile
    user.hasSelectedPlan = true;
    await user.save();

    res.status(200).json({ message: 'Free plan activated' });
});