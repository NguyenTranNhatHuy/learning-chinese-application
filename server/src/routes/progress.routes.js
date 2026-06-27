import express from "express";
import { Progress } from "../models/Progress.js";
import { StudyHistory } from "../models/StudyHistory.js";
import { Vocabulary } from "../models/Vocabulary.js";
import { protect } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const progressRouter = express.Router();

progressRouter.use(protect);

progressRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const progress = await Progress.find({ userId: req.user._id }).populate({
      path: "vocabularyId",
      populate: { path: "topicId", select: "title accent" }
    });

    res.json({ progress });
  })
);

progressRouter.get(
  "/dashboard",
  asyncHandler(async (req, res) => {
    const [progress, totalWords, history] = await Promise.all([
      Progress.find({ userId: req.user._id }),
      Vocabulary.countDocuments(),
      StudyHistory.find({ userId: req.user._id }).sort({ date: -1 }).limit(30).populate("topicId", "title")
    ]);

    const learned = progress.filter((item) => item.learned).length;
    const wrong = progress.reduce((sum, item) => sum + item.wrongCount, 0);
    const correct = progress.reduce((sum, item) => sum + item.correctCount, 0);

    res.json({
      totalWords,
      learned,
      reviewDue: progress.filter((item) => item.reviewDate <= new Date()).length,
      averageScore: correct + wrong ? Math.round((correct / (correct + wrong)) * 100) : 0,
      streak: req.user.streak,
      history
    });
  })
);

progressRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const { vocabularyId, learned = true, correct = null, duration = 0 } = req.body;
    const reviewDate = new Date();

    if (correct === false) reviewDate.setDate(reviewDate.getDate() + 1);
    else reviewDate.setDate(reviewDate.getDate() + 3);

    const progress = await Progress.findOneAndUpdate(
      { userId: req.user._id, vocabularyId },
      {
        learned,
        reviewDate,
        lastStudiedAt: new Date(),
        $inc: {
          correctCount: correct === true ? 1 : 0,
          wrongCount: correct === false ? 1 : 0,
          reviewLevel: correct === true ? 1 : 0
        }
      },
      { new: true, upsert: true }
    ).populate("vocabularyId");

    if (progress.vocabularyId?.topicId) {
      await StudyHistory.create({
        userId: req.user._id,
        topicId: progress.vocabularyId.topicId,
        vocabularyId,
        duration
      });
    }

    res.status(201).json({ progress });
  })
);

progressRouter.put(
  "/",
  asyncHandler(async (req, res) => {
    const { vocabularyId, learned, reviewDate, reviewLevel } = req.body;
    const progress = await Progress.findOneAndUpdate(
      { userId: req.user._id, vocabularyId },
      { learned, reviewDate, reviewLevel, lastStudiedAt: new Date() },
      { new: true, upsert: true }
    );

    res.json({ progress });
  })
);

