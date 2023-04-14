import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
// GET /api/users
export async function fetchAllUsers(req, res) {
  try {
    const users = await User.find();
    if (!users) return res.status(404).json({ message: "No users found" });
    res.status(201).json({ status: "success", users });
  } catch (err) {
    console.log(err.message);
  }
}

export async function checkAuth(req, res) {
  if (!req.user) return res.status(400).json({ message: "No user found" });

  try {
    const user = await User.findById(req?.user?.id).select(
      "-hash -createdAt -_id -__v"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(201).json({ status: "success", user });
  } catch (err) {
    console.log(err.message);
  }
}

export async function signup(req, res) {
  console.log("signup called");
  if (!req.body) return res.status(400).json({ message: "No data provided" });
  const { fname, lname, email, password } = req?.body;

  if (!fname || !lname || !email || !password)
    return res.status(400).json({ message: "Missing required fields" });

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(200).json({
      status: "user exist",
      message: "User already exists, try loggin in",
    });
  }

  const hash = await bcrypt.hash(password, 10);
  const userData = { fname, lname, email, hash };

  try {
    const newUser = await User.create(userData);
    const user = await User.findById(newUser._id).select(
      "-hash -createdAt -_id -__v"
    );
    console.log({ user });
    res.status(201).json({ status: "success", user });
  } catch (err) {
    console.log(err.message);
  }
}

export async function signin(req, res) {
  console.log("signin called");
  if (!req?.body) return res.status(400).json({ message: "No data provided" });
  const body = req?.body;
  if (!body?.email || !body?.password)
    return res.status(400).json({ message: "Missing required fields" });
  console.log({ body });
  try {
    const user = await User.findOne({ email: body.email });
    console.log({ user });
    if (!user) return res.status(404).json({ message: "User not found" });
    const isMatch = await bcrypt.compare(body.password, user.hash);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const authToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1y",
    });

    res.status(200).json({
      status: "success",
      authToken,
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
    const user = await User.findById(req?.user?.id).select(
      "-hash -createdAt -_id -__v"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(201).json({ status: "success", user });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
