import express from "express";
import { Topic } from "../models/Topic.js";
import { Vocabulary } from "../models/Vocabulary.js";
import { protect, requireAdmin } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const topicRouter = express.Router();

topicRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const topics = await Topic.aggregate([
      { $sort: { order: 1, title: 1 } },
      {
        $lookup: {
          from: "vocabularies",
          localField: "_id",
          foreignField: "topicId",
          as: "words"
        }
      },
      {
        $addFields: {
          vocabularyCount: { $size: "$words" }
        }
      },
      { $project: { words: 0 } }
    ]);

    res.json({ topics });
  })
);

topicRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const topic = await Topic.findById(req.params.id);
    if (!topic) return res.status(404).json({ message: "Không tìm thấy chủ đề." });

    const vocabularies = await Vocabulary.find({ topicId: topic._id }).sort({ hskLevel: 1, chinese: 1 });
    res.json({ topic, vocabularies });
  })
);

topicRouter.post(
  "/",
  protect,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const topic = await Topic.create(req.body);
    res.status(201).json({ topic });
  })
);

topicRouter.put(
  "/:id",
  protect,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const topic = await Topic.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!topic) return res.status(404).json({ message: "Không tìm thấy chủ đề." });
    res.json({ topic });
  })
);

topicRouter.delete(
  "/:id",
  protect,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const topic = await Topic.findByIdAndDelete(req.params.id);
    if (!topic) return res.status(404).json({ message: "Không tìm thấy chủ đề." });
    await Vocabulary.deleteMany({ topicId: topic._id });
    res.json({ message: "Đã xóa chủ đề và từ vựng liên quan." });
  })
);

