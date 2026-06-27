import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vocabularyId: { type: mongoose.Schema.Types.ObjectId, ref: "Vocabulary", required: true }
  },
  { timestamps: true }
);

favoriteSchema.index({ userId: 1, vocabularyId: 1 }, { unique: true });

export const Favorite = mongoose.model("Favorite", favoriteSchema);

