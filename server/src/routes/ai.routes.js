import express from "express";
import { grammar } from "../controllers/ai.controller.js";

export const aiRouter = express.Router();

// Only grammar endpoint remains (STT removed)
aiRouter.post("/grammar", grammar);
