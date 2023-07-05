import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import EmailVerification from "../models/email-verification.model.js";
import sendEmail from "../utils/emailer.js";

// GET /api/users
export async function fetchAllUsers(req, res) {
  const { limit, skip } = req?.query;
  try {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate("currentSubscriptionPlan", "name");

    const usersCount = await User.countDocuments();
    if (!users) return res.status(404).json({ message: "No users found" });
    res.status(201).json({ status: "success", users, usersCount });
  } catch (err) {
    console.log(err.message);
  }
}

export async function fetchAllAdmins(req, res) {
  console.log("fetching all admins");
  const { skip, limit } = req?.query;
  try {
    const admins = await User.find({ usertype: "ADMIN" })
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));
    const adminsCount = await User.countDocuments({ usertype: "ADMIN" });

    // console.log({ users });
    if (!admins) return res.status(404).json({ message: "No users found" });
    res.status(201).json({ status: "success", admins, adminsCount });
  } catch (err) {
    console.log(err.message);
  }
}

export async function checkAuth(req, res) {
  if (!req.user) return res.status(400).json({ message: "No user found" });

  try {
    const user = await User.findById(req?.user?.id);
    // .select(
    //   "-hash -createdAt -_id -__v"
    // );
    console.log({ user });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(201).json({ status: "success", user });
  } catch (err) {
    console.log(err.message);
  }
}

export async function createUser(req, res) {
  if (
    !(req?.params?.usertype === "admin") &&
    !(req?.params?.usertype === "user")
  )
    return res
      .status(200)
      .json({ status: "error", message: "No user type found" });
  const { usertype } = req?.params;

  if (
    !req?.body?.email ||
    !req?.body?.password ||
    !req?.body?.fname ||
    !req?.body?.lname
  ) {
    return res
      .status(200)
      .json({ status: "error", message: "Missing required fields" });
  }
  const user = await User.findOne({ email: req?.body?.email });
  if (user) {
    console.log("user already exists");
    return res.status(200).json({
      status: "error",
      message: "User already exists with that email address",
    });
  }
  try {
    const { email, password, fname, lname } = req?.body;
    const hash = await bcrypt.hash(password, 10);
    const admin = await User.create({
      fname,
      lname,
      email,
      hash,
      usertype: usertype.toUpperCase(),
      createdBy: req?.user?.id,
    });
    if (!admin)
      return res.status(500).json({ message: "Internal server error" });
    res.status(200).json({ status: "success" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function signup(req, res) {
  if (!req.body) return res.status(400).json({ message: "No data provided" });
  const { fname, lname, email, password } = req?.body;

  if (!fname || !lname || !email || !password)
    return res.status(400).json({ message: "Missing required fields" });

  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    return res.status(200).json({
      status: "user exist",
      message: "User already exists, try loggin in",
    });
  }

  const hash = await bcrypt.hash(password, 10);
  const userData = { fname, lname, email: email.toLowerCase(), hash };

  try {
    const newUser = await User.create(userData);
    // const user = await User.findById(newUser._id).select(
    //   "-hash -createdAt -_id -__v"
    // );
    const newEmailVerification = await EmailVerification.create({
      user: newUser?._id,
    });
    const verificationLink = `${process.env.API_URL}/api/users/${newEmailVerification._id}`;
    const mail = await sendEmail({
      to: newUser?.email,
      verificationLink,
    });
    console.log({ mail });
    if (mail.error)
      return res.status(500).json({ message: "Internal server error" });
    return res.status(200).json({
      status: "success",
    });
  } catch (err) {
    console.log(err.message);
  }
}

export async function signin(req, res) {
  console.log("signin called");
  if (!req?.body)
    return res
      .status(400)
      .json({ status: "error", message: "No data provided" });

  const body = req?.body;
  if (!body?.email || !body?.password)
    return res
      .status(404)
      .json({ status: "error", message: "Missing required fields" });

  try {
    const user = await User.findOne({ email: body.email.toLowerCase() });
    console.log({ user });
    if (!user)
      return res.status(200).json({
        status: "warning",
        message:
          "You are not registered with that email address, try signing up",
      });

    const isMatch = await bcrypt.compare(body.password, user.hash);
    console.log({ isMatch });
    if (!isMatch)
      return res
        .status(200)
        .json({ status: "error", message: "Invalid credentials" });

    // await EmailVerification.deleteMany({ user: user._id });

    if (!user?.isVerified) {
      const newEmailVerification = await EmailVerification.create({
        user: user?._id,
      });
      const verificationLink = `${process.env.API_URL}/api/users/${newEmailVerification._id}`;
      const mailInfo = await sendEmail({
        to: user?.email,
        verificationLink,
      });
      console.log({ mailInfo });
      return res.status(200).json({
        status: "not verified",
      });
    }

    const authToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "60s",
    });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      status: "success",
      authToken,
      refreshToken,
      user: {
        fname: user?.fname,
        lname: user?.lname,
        email: user?.email,
        usertype: user?.usertype,
        profilePic: user?.profilePic,
        isVerified: user?.isVerified,
      },
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateUserDetails(req, res) {
  console.log("update user details called");
  if (!req.user) return res.status(400).json({ message: "No user found" });
  console.log("body", req?.body);

  if (
    req?.body?.password &&
    req?.body?.password === req?.body?.confirmPassword
  ) {
    const hash = await bcrypt.hash(req.body.password, 10);
    req.body = { hash };
  }
  try {
    await User.findByIdAndUpdate(req?.user?.id, req?.body);
    const user = await User.findById(req?.user?.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(201).json({ status: "success", user });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function updateAdminDetails(req, res) {
  console.log("update admin details called");
  console.log("body", req?.body);
  const userId = req?.params?.id;
  if (
    req?.body?.password &&
    req?.body?.password === req?.body?.confirmPassword
  ) {
    console.log("changing password to ", req?.body?.password);
    const hash = await bcrypt.hash(req.body.password, 10);
    req.body.hash = hash;
    delete req.body.password;
    delete req.body.confirmPassword;
  }
  console.log("body after hash", req?.body);
  try {
    await User.findByIdAndUpdate(userId, req?.body);
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(201).json({ status: "success", user });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function verifyEmail(req, res) {
  const { token } = req?.params;
  console.log({ token });
  try {
    const verification = await EmailVerification.findById(token);
    if (!verification)
      return res.status(404).json({
        message: "Token Expired! please click on resend verification link",
      });
    const user = await User.findById(verification.user);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.isVerified = true;
    await user.save();
    // await EmailVerification.findByIdAndDelete(verification._id);
    res.redirect(`${process.env.APP_URL}/verified`);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function resendVerificationEmail(req, res) {
  console.log("resend verification email called");
  // console.log(req?.params?.email);
  try {
    const user = await User.findOne({
      email: req?.params?.email.toLowerCase(),
    });
    console.log({ user });
    if (!user)
      return res
        .status(400)
        .json({ status: "error", message: "Invalid credentials!" });
    await EmailVerification.deleteMany({ user: user._id });
    const newEmailVerification = await EmailVerification.create({
      user,
    });
    const verificationLink = `${process.env.APP_URL}/api/users/${newEmailVerification._id}`;
    const mail = await sendEmail({
      to: user?.email,
      verificationLink,
    });
    if (mail.error)
      return res.status(500).json({ message: "Internal server error" });
    res
      .status(200)
      .json({ status: "success", message: "Verification email sent" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteAdmin(req, res) {
  const { id } = req?.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ status: "success", message: "User deleted" });
  } catch (err) {
    console.log(err.message);
  }
}
