import express from "express";
import { Favorite } from "../models/Favorite.js";
import { protect } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const favoriteRouter = express.Router();

favoriteRouter.use(protect);

favoriteRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const favorites = await Favorite.find({ userId: req.user._id }).populate({
      path: "vocabularyId",
      populate: { path: "topicId", select: "title accent" }
    });

    res.json({ favorites });
  })
);

favoriteRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const { vocabularyId } = req.body;
    const favorite = await Favorite.findOneAndUpdate(
      { userId: req.user._id, vocabularyId },
      { userId: req.user._id, vocabularyId },
      { new: true, upsert: true }
    );

    res.status(201).json({ favorite });
  })
);

favoriteRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await Favorite.findOneAndDelete({
      userId: req.user._id,
      $or: [{ _id: req.params.id }, { vocabularyId: req.params.id }]
    });

    res.json({ message: "Đã bỏ yêu thích." });
  })
);

