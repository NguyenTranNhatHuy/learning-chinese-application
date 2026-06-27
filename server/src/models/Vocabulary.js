import mongoose from "mongoose";

const vocabularySchema = new mongoose.Schema(
  {
    chinese: { type: String, required: true, trim: true },
    pinyin: { type: String, required: true, trim: true },
    meaning: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["Danh từ", "Động từ", "Tính từ", "Phó từ", "Cụm từ", "Khác"],
      default: "Khác"
    },
    example: { type: String, default: "" },
    examplePinyin: { type: String, default: "" },
    exampleMeaning: { type: String, default: "" },
    image: { type: String, default: "" },
    audio: { type: String, default: "" },
    radical: { type: String, default: "" },
    strokes: { type: Number, default: 0 },
    hskLevel: { type: Number, min: 1, max: 6, required: true },
    synonyms: [{ type: String }],
    antonyms: [{ type: String }],
    relatedWords: [{ type: String }],
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true }
  },
  { timestamps: true }
);

vocabularySchema.index({
  chinese: "text",
  pinyin: "text",
  meaning: "text",
  example: "text"
});

export const Vocabulary = mongoose.model("Vocabulary", vocabularySchema);

