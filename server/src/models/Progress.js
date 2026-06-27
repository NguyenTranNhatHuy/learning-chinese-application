import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vocabularyId: { type: mongoose.Schema.Types.ObjectId, ref: "Vocabulary", required: true },
    learned: { type: Boolean, default: false },
    reviewDate: { type: Date, default: Date.now },
    reviewLevel: { type: Number, default: 0 },
    correctCount: { type: Number, default: 0 },
    wrongCount: { type: Number, default: 0 },
    lastStudiedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

progressSchema.index({ userId: 1, vocabularyId: 1 }, { unique: true });

export const Progress = mongoose.model("Progress", progressSchema);

