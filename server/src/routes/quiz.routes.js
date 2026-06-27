import express from "express";
import { Quiz } from "../models/Quiz.js";
import { Progress } from "../models/Progress.js";
import { StudyHistory } from "../models/StudyHistory.js";
import { protect, requireAdmin } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const quizRouter = express.Router();

quizRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const { type, limit = 10 } = req.query;
    const filter = type ? { type } : {};

    const quizzes = await Quiz.find(filter)
      .populate({
        path: "vocabularyId",
        select: "chinese pinyin meaning audio topicId hskLevel",
        populate: { path: "topicId", select: "title" }
      })
      .limit(Number(limit));

    res.json({ quizzes });
  })
);

quizRouter.post(
  "/",
  protect,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const quiz = await Quiz.create(req.body);
    res.status(201).json({ quiz });
  })
);

quizRouter.put(
  "/:id",
  protect,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!quiz) return res.status(404).json({ message: "Không tìm thấy quiz." });
    res.json({ quiz });
  })
);

quizRouter.delete(
  "/:id",
  protect,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Không tìm thấy quiz." });
    res.json({ message: "Đã xóa quiz." });
  })
);

quizRouter.post(
  "/submit",
  protect,
  asyncHandler(async (req, res) => {
    const { answers = [], duration = 0 } = req.body;
    const quizIds = answers.map((item) => item.quizId);
    const quizzes = await Quiz.find({ _id: { $in: quizIds } }).populate("vocabularyId");
    const quizMap = new Map(quizzes.map((quiz) => [String(quiz._id), quiz]));

    let correct = 0;
    const results = [];

    for (const item of answers) {
      const quiz = quizMap.get(String(item.quizId));
      if (!quiz) continue;

      const isCorrect = String(item.answer).trim() === String(quiz.answer).trim();
      if (isCorrect) correct += 1;

      const reviewDate = new Date();
      reviewDate.setDate(reviewDate.getDate() + (isCorrect ? 3 : 1));

      await Progress.findOneAndUpdate(
        { userId: req.user._id, vocabularyId: quiz.vocabularyId._id },
        {
          learned: true,
          lastStudiedAt: new Date(),
          reviewDate,
          $inc: {
            correctCount: isCorrect ? 1 : 0,
            wrongCount: isCorrect ? 0 : 1,
            reviewLevel: isCorrect ? 1 : 0
          }
        },
        { upsert: true, new: true }
      );

      await StudyHistory.create({
        userId: req.user._id,
        topicId: quiz.vocabularyId.topicId,
        vocabularyId: quiz.vocabularyId._id,
        duration,
        quizScore: isCorrect ? 1 : 0
      });

      results.push({
        quizId: quiz._id,
        isCorrect,
        answer: quiz.answer,
        explanation: quiz.explanation
      });
    }

    res.json({
      score: answers.length ? Math.round((correct / answers.length) * 100) : 0,
      correct,
      total: answers.length,
      results
    });
  })
);

