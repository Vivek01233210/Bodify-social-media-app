import mongoose from "mongoose";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: false, // Set to false if email is not mandatory
        },
        password: {
            type: String,
            required: false, // Set to false if password is not mandatory
        },
        profilePicture: {
            type: Object,
            default: null,
        },
        googleId: {
            type: String,
            required: false, // Required only for users logging in with Google
        },
        authMethod: {
            type: String,
            enum: ["google", "local", "facebook", "github"],
            required: true,
            default: "local",
        },
        accountVerificationToken: {
            type: String,
            default: null,
        },
        accountVerificationExpires: {
            type: Date,
            default: null,
        },
        passwordResetToken: {
            type: String,
            default: null,
        },
        passwordResetExpires: {
            type: Date,
            default: null,
        },
        posts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post"
            }
        ],
        totalEarnings: {
            type: Number,
            default: 0
        },
        nextEarningDate: {
            type: Date,
            default: () =>
                new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1), // Sets to the first day of the next month
        },
        plan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Plan",
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        payments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Payment"
            }
        ],
        hasSelectedPlan: {
            type: Boolean,
            default: false
        },
        accountType: {
            type: String,
            enum: ["Basic", "Standard", "Premium"],
            default: "Basic"
        },
        lastLogin: {
            type: Date,
            default: Date.now
        },

        // User relationships
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ], // Link to other users
        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
    },
    { timestamps: true }
);

// method to generate token for account verification
userSchema.methods.generateAccountVerificationToken = function () {
    const emailToken = crypto.randomBytes(20).toString("hex");

    // hash and save the generated token in the user document
    this.accountVerificationToken = crypto
        .createHash("sha256")
        .update(emailToken)
        .digest("hex");

    // set the token to expire in 10 mins
    this.accountVerificationExpires = Date.now() + 10 * 60 * 1000; // 10 mins

    return emailToken;
};

// method to generate token for password reset
userSchema.methods.generatePasswordResetToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    // hash and save the generated token in the user document
    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    // set the token to expire in 10 mins
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 mins

    return resetToken;
};

// method to update users account type
userSchema.methods.updateAccountType = function () {
    // get total posts
    const postCount = this.posts.length;

    if (postCount >= 10 && postCount < 30) {
        this.accountType = "Standard";
    } else if (postCount >= 30) {
        this.accountType = "Premium";
    }
};

const User = mongoose.model("User", userSchema);

export default User;