import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
    {
        planName: {
            type: String,
            required: true
        },
        features: [String],
        limitations: [String],
        price: {
            type: Number,
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true,
    }
);

const Plan = mongoose.model("Plan", planSchema);

export default Plan;