import express from "express";
import { User } from "../models/User.js";
import { Topic } from "../models/Topic.js";
import { Vocabulary } from "../models/Vocabulary.js";
import { Quiz } from "../models/Quiz.js";
import { Progress } from "../models/Progress.js";
import { protect, requireAdmin } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const adminRouter = express.Router();

adminRouter.use(protect, requireAdmin);

adminRouter.get(
  "/stats",
  asyncHandler(async (_req, res) => {
    const [users, topics, vocabularies, quizzes, learned] = await Promise.all([
      User.countDocuments(),
      Topic.countDocuments(),
      Vocabulary.countDocuments(),
      Quiz.countDocuments(),
      Progress.countDocuments({ learned: true })
    ]);

    res.json({ users, topics, vocabularies, quizzes, learned });
  })
);

adminRouter.get(
  "/users",
  asyncHandler(async (_req, res) => {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ users: users.map((user) => user.toSafeJSON()) });
  })
);

adminRouter.patch(
  "/users/:id/lock",
  asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, { isLocked: true }, { new: true });
    if (!user) return res.status(404).json({ message: "Không tìm thấy user." });
    res.json({ user: user.toSafeJSON() });
  })
);

adminRouter.patch(
  "/users/:id/unlock",
  asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, { isLocked: false }, { new: true });
    if (!user) return res.status(404).json({ message: "Không tìm thấy user." });
    res.json({ user: user.toSafeJSON() });
  })
);

adminRouter.patch(
  "/users/:id/reset-password",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("+password");
    if (!user) return res.status(404).json({ message: "Không tìm thấy user." });

    user.password = req.body.password || "User123!";
    await user.save();

    res.json({ message: "Đã reset mật khẩu." });
  })
);

