import asyncHandler from "express-async-handler";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import passport from "passport";

import User from '../models/user.js';
import { sendAccountVerificationEmail } from "../utils/sendAccountVerificationEmail.js";
import { sendPasswordResetEmail } from "../utils/sendPasswordResetEmail.js";


export const register = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  // if username OR email matches
  const userFound = await User.findOne({ username, email });
  if (userFound) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userRegistered = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    status: "success",
    message: "User registered successfully",
    user: userRegistered,
  });
});

export const login = asyncHandler(async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {

    if (err) return next(err);

    //check if user not found
    if (!user) {
      return res.status(401).json({ message: info.message });
    }

    //generate token
    const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET);

    //set the token into cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, //1 day
    });

    //send the response
    res.json({
      status: "success",
      message: "Login Success",
      username: user?.username,
      email: user?.email,
      _id: user?._id,
    });
  })(req, res, next);  // IIFE
});

//  googleAuth route
export const googleAuth = passport.authenticate("google", { scope: ["profile"] });

// google auth callback
export const googleAuthCallback = asyncHandler(async (req, res, next) => {
  passport.authenticate(
    "google",
    {
      failureRedirect: "/login",
      session: false,
    },
    (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.redirect("http://localhost:5173/google-login-error");
      }

      //generate the token
      const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET, {
        expiresIn: "3d",
      });

      //set the token into the cooke
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, //1 day:
      });

      //redirect the user dashboard
      res.redirect("http://localhost:5173/dashboard");
    }
  )(req, res, next);  // IIFE
});

// protect middleware
export const checkAuthenticated = asyncHandler(async (req, res) => {
  const token = req.cookies["token"];
  if (!token) {
    return res.status(401).json({ isAuthenticated: false });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //find the user
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ isAuthenticated: false });
    } else {
      return res.status(200).json({
        isAuthenticated: true,
        _id: user?._id,
        username: user?.username,
        isAdmin: user?.isAdmin,
        profilePicture: user?.profilePicture,
        hasSelectedPlan: user?.hasSelectedPlan,
        authMethod: user?.authMethod,
      });
    }
  } catch (error) { }
  return res.status(401).json({ isAuthenticated: false, error });
});

// logout controller
export const logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', '', { maxAge: 1 });
  res.status(200).json({ message: "logout sucess" })
});

// Profile
export const profile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user)
    .populate('followers')
    .populate('following')
    .populate('posts')
    .select('-password -passwordResetToken -accountVerificationToken -accountVerificationExpires -passwordResetExpires');

  res.status(201).json({ user })
});

// follow a user by another user 
export const followUser = asyncHandler(async (req, res, next) => {
  // find the user who wants to follow
  const userId = req.user;

  // get the userId of the user to be followed
  const followId = req.params.followId;

  // update the user's following arrays
  await User.findByIdAndUpdate(
    userId,
    {
      $addToSet: { following: followId }
    },
    { new: true }
  );

  // update the user to be followed follower's arrays
  await User.findByIdAndUpdate(
    followId,
    {
      $addToSet: { followers: userId }
    },
    { new: true }
  );

  res.status(200).json({ message: 'User followed successfully' });
});

// unfollow a user by another user
export const unfollowUser = asyncHandler(async (req, res, next) => {
  // find the user who wants to unfollow
  const userId = req.user;

  // get the userId of the user to be unfollowed
  const unfollowId = req.params.unfollowId;

  // get both users from db
  const user = await User.findById(userId);
  const unfollowUser = await User.findById(unfollowId);

  if (!user || !unfollowUser) {
    throw new Error('User not found');
  }

  // update the user's following arrays
  user.following.pull(unfollowId);

  // update the user to be unfollowed follower's arrays
  unfollowUser.followers.pull(userId);

  // save the both users
  await user.save();
  await unfollowUser.save();

  res.status(200).json({ message: 'User unfollowed successfully' });
});

// Verify email account (sending the verification email with token)
export const verifyEmailAccount = asyncHandler(async (req, res, next) => {
  // get the login user
  const user = await User.findById(req.user);
  if (!user) {
    return res.status(401).json({ message: 'User not found.' });
  }

  // check if user's email exists
  if (!user?.email) {
    return res.status(401).json({ message: 'User email not found.' });
  }

  // use the method from the user model to generate token
  const token = await user.generateAccountVerificationToken();

  // resave the user
  await user.save();

  // send the email
  await sendAccountVerificationEmail(user.email, token);

  res.status(200).json({ message: 'Email sent successfully' });

});

// Account verification (by checking the received token) 
export const accountVerification = asyncHandler(async (req, res, next) => {
  // get the token from the url
  const { verifyToken } = req.params;

  // hash the token
  const hashedToken = crypto.createHash('sha256').update(verifyToken).digest('hex');

  // find the user by the token via comparing hashes
  const user = await User.findOne({
    accountVerificationToken: hashedToken,
    accountVerificationExpires: { $gt: Date.now() }
  });

  // check if user exists
  if (!user) {
    return res.status(400).json({ message: 'Token is invalid or has expired' });
  }

  // update the user
  user.isEmailVerified = true;
  user.accountVerificationToken = null;
  user.accountVerificationExpires = null;

  // save the user
  await user.save();

  res.status(200).json({ message: 'Account verified successfully' });
});

// forgot password (sending the reset token on email)
export const forgotPassword = asyncHandler(async (req, res, next) => {
  // get the email from the request
  const { email } = req.body;

  // find the user by email
  const user = await User.findOne({ email });

  // check if user exists
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // check if the user is registered with google account
  if (user.authMethod !== 'local') {
    return res.status(400).json({ message: 'Please login with your social account' });
  }

  // generate the reset token by using the method from the user model
  const resetToken = await user.generatePasswordResetToken();

  // save the user
  await user.save();

  // send the email
  await sendPasswordResetEmail(user.email, resetToken);

  res.status(200).json({ message: 'Password reset token sent to email successfully' });
});

// reset password (by checking the received token)
export const resetPassword = asyncHandler(async (req, res) => {
  // get the token from the url
  const { resetToken } = req.params;
  const { password } = req.body;

  // hash the token
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // find the user by the token via comparing hashes
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // check if user exists
  if (!user) {
    return res.status(400).json({ message: 'Token is invalid or has expired' });
  }

  // update the user password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  // reset the token and expiry
  user.passwordResetToken = null;
  user.passwordResetExpires = null;

  // resave the user
  await user.save();

  res.status(200).json({ message: 'Password reset successfully' });
});

// update email
export const updateEmail = asyncHandler(async (req, res, next) => {
  // get the email from the request
  const { email } = req.body;

  // find the user by id
  const user = await User.findById(req.user);

  // update user email
  user.email = email;
  user.isEmailVerified = false;

  //save the user
  await user.save();

  // generate the token
  const token = await user.generateAccountVerificationToken();

  // send the verification email
  sendAccountVerificationEmail(user?.email, token);

  // send the response
  res.status(200).json({ message: 'Account verification email has been sent successfully!' });
});

// Update profile picture
export const updateProfilePicture = asyncHandler(async (req, res) => {
  // get the user and update
  const updatedUser = await User.findByIdAndUpdate(req.user, {
    $set: { profilePicture: req.file }
  }, {
    new: true
  });

  res.status(200).json({ message: 'Profile picture updated successfully', profilePicture: updatedUser.profilePicture });
});

// Block user
export const blockUser = asyncHandler(async (req, res) => {
  // get the user by id
  const { userId } = req.body;

  const user = await User.findByIdAndUpdate(userId, {
    $set: { isBlocked: true }
  }, {
    new: true
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json({ message: 'User blocked successfully', user: user.username });
});

// Unblock user
export const unblockUser = asyncHandler(async (req, res) => {
  // get the user by id
  const { userId } = req.body;

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: { isBlocked: false }
    },
    {
      new: true
    }
  );

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json({ message: 'User unblocked successfully', user: user.username });
});

// list all users
export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});

  res.status(200).json({ 
    results: users.length,
    users
   });
});