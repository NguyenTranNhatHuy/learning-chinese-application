import mongoose from "mongoose";

const topicSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    accent: { type: String, default: "#E53935" },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Topic = mongoose.model("Topic", topicSchema);

