import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    vocabularyId: { type: mongoose.Schema.Types.ObjectId, ref: "Vocabulary", required: true },
    type: {
      type: String,
      enum: ["meaning", "pinyin", "audio", "hanzi", "fill", "sentence"],
      required: true
    },
    question: { type: String, required: true },
    options: [{ type: String }],
    answer: { type: String, required: true },
    explanation: { type: String, default: "" }
  },
  { timestamps: true }
);

export const Quiz = mongoose.model("Quiz", quizSchema);

