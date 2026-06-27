import mongoose from "mongoose";

const studyHistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },
    vocabularyId: { type: mongoose.Schema.Types.ObjectId, ref: "Vocabulary" },
    date: { type: Date, default: Date.now },
    duration: { type: Number, default: 0 },
    quizScore: { type: Number, default: null }
  },
  { timestamps: true }
);

export const StudyHistory = mongoose.model("StudyHistory", studyHistorySchema);

