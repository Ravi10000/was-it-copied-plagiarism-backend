import express from "express";

import {
  createTransaction,
  fetchAllTransactions,
  fetchTransaction,
  updateTransaction,
} from "../controllers/transaction.controller.js";

import {
  fetchUserMiddleware,
  isAdminMiddleware,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/:id", fetchUserMiddleware, isAdminMiddleware, fetchTransaction);
router.get("/", fetchUserMiddleware, isAdminMiddleware, fetchAllTransactions);
router.put("/", fetchUserMiddleware, isAdminMiddleware, updateTransaction);
router.post("/", fetchUserMiddleware, isAdminMiddleware, createTransaction);

export default router;
