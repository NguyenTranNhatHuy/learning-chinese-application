import express from "express";
import { Vocabulary } from "../models/Vocabulary.js";
import { Favorite } from "../models/Favorite.js";
import { Progress } from "../models/Progress.js";
import { protect, requireAdmin } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const vocabularyRouter = express.Router();

vocabularyRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const { search, hsk, topic, limit = 100 } = req.query;
    const filter = {};

    if (search) filter.$text = { $search: search };
    if (hsk) filter.hskLevel = Number(hsk);
    if (topic) filter.topicId = topic;

    const vocabularies = await Vocabulary.find(filter)
      .populate("topicId", "title accent")
      .sort({ hskLevel: 1, chinese: 1 })
      .limit(Number(limit));

    res.json({ vocabularies });
  })
);

vocabularyRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const vocabulary = await Vocabulary.findById(req.params.id).populate("topicId", "title accent");
    if (!vocabulary) return res.status(404).json({ message: "Không tìm thấy từ vựng." });
    res.json({ vocabulary });
  })
);

vocabularyRouter.post(
  "/",
  protect,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const vocabulary = await Vocabulary.create(req.body);
    res.status(201).json({ vocabulary });
  })
);

vocabularyRouter.put(
  "/:id",
  protect,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const vocabulary = await Vocabulary.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!vocabulary) return res.status(404).json({ message: "Không tìm thấy từ vựng." });
    res.json({ vocabulary });
  })
);

vocabularyRouter.delete(
  "/:id",
  protect,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const vocabulary = await Vocabulary.findByIdAndDelete(req.params.id);
    if (!vocabulary) return res.status(404).json({ message: "Không tìm thấy từ vựng." });

    await Promise.all([
      Favorite.deleteMany({ vocabularyId: vocabulary._id }),
      Progress.deleteMany({ vocabularyId: vocabulary._id })
    ]);

    res.json({ message: "Đã xóa từ vựng." });
  })
);

