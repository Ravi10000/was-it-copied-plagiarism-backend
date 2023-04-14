import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/user.route.js";
import subscriptionRoutes from "./routes/subscription.route.js";
import transactionRoutes from "./routes/transaction.route.js";

const app = express(); // Create express app

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/plagiarism-checker");
mongoose.connection.on("error", (err) => {
  console.log(err.message);
});
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

// parse application/x-www-form-urlencoded and application/json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/transactions", transactionRoutes);

// home route
app.get("/", (req, res) => {
  res.send("Welcome to Plagiarism Checker API");
});

app.listen(4000, () => {
  console.log("Plagiarism API on port 4000");
});
