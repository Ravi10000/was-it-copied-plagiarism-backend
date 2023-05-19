import dotEnv from "dotenv";
dotEnv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/user.route.js";
import subscriptionRoutes from "./routes/subscription.route.js";
import transactionRoutes from "./routes/transaction.route.js";
import howItWorksRoutes from "./routes/how-it-works.route.js";
import plagiarismItemRoutes from "./routes/plagiarism-item.route.js";
import faqRoutes from "./routes/faq.route.js";
import benefitRoutes from "./routes/benefit.route.js";
import scanRoutes from "./routes/scan.route.js";
import webhookRoues from "./routes/webhook.route.js";

// import path from "path";

import { engine } from "express-handlebars";
// import * as url from "url";
// const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const app = express(); // Create express app

// Connect to MongoDB
mongoose.connect(process.env.DB_URL);
mongoose.connection.on("error", (err) => {
  console.log(err.message);
});
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

// app.engine(
//   ".hbs",
//   engine({
//     extname: ".hbs",
//     defaultLayout: false,
//     layoutsDir: "views",
//   })
// );
// app.set("view engine", "hbs");
app.use(express.static("uploads"));
app.set("views", "views");

// parse application/x-www-form-urlencoded and application/json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/how-it-works", howItWorksRoutes);
app.use("/api/plagiarism-item", plagiarismItemRoutes);
app.use("/api/faq", faqRoutes);
app.use("/api/benefit", benefitRoutes);
app.use("/api/scan", scanRoutes);
app.use("/api/webhooks", webhookRoues);

// home route
app.get("/", (req, res) => {
  // res.send("API Hosted On " + process.env.API_URL);
  res.send("plagiarism checker api");
});

app.listen(4000, () => {
  console.log("API URL: http://localhost:4000/api");
});
