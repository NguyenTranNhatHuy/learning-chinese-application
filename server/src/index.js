import "dotenv/config";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import { adminRouter } from "./routes/admin.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { favoriteRouter } from "./routes/favorite.routes.js";
import { progressRouter } from "./routes/progress.routes.js";
import { quizRouter } from "./routes/quiz.routes.js";
import { topicRouter } from "./routes/topic.routes.js";
import { uploadRouter } from "./routes/upload.routes.js";
import { vocabularyRouter } from "./routes/vocabulary.routes.js";
import { aiRouter } from "./routes/ai.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => {
  res.json({
    message: "Learning Chinese API",
    health: "/api/health",
  });
});
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "learning-chinese" });
});

app.use("/api/auth", authRouter);
// app.use("/auth", authRouter);
app.use("/api/topics", topicRouter);
// app.use("/topics", topicRouter);
app.use("/api/vocabularies", vocabularyRouter);
// app.use("/vocabularies", vocabularyRouter);
app.use("/api/quiz", quizRouter);
// app.use("/quiz", quizRouter);
app.use("/api/favorites", favoriteRouter);
// app.use("/favorites", favoriteRouter);
app.use("/api/progress", progressRouter);
// app.use("/progress", progressRouter);
app.use("/api/admin", adminRouter);
// app.use("/admin", adminRouter);
app.use("/api/uploads", uploadRouter);
// app.use("/uploads", uploadRouter);
app.use("/api/ai", aiRouter);
// app.use("/ai", aiRouter);

app.use((req, res) => {
  res.status(404).json({ message: `Không tìm thấy route ${req.originalUrl}` });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.name === "ValidationError" ? 400 : 500;
  res.status(status).json({ message: err.message || "Server error" });
});

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`API server listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Cannot start server:", error.message);
    process.exit(1);
  });
