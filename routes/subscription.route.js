import express from "express";

import {
  fetchUserMiddleware,
  isAdminMiddleware,
} from "../middlewares/auth.middleware.js";

import {
  fetchAllSubscriptions,
  fetchSubscription,
  createSubscription,
  updateSubscription,
  deleteSubscription,
} from "../controllers/subscription.controller.js";

const router = express.Router();

router.get("/", fetchAllSubscriptions);
router.get("/:id", fetchSubscription);
router.delete(
  "/:id",
  fetchUserMiddleware,
  isAdminMiddleware,
  deleteSubscription
);
router.post("/:id", fetchUserMiddleware, isAdminMiddleware, updateSubscription);
router.post("/", fetchUserMiddleware, isAdminMiddleware, createSubscription);

export default router;
