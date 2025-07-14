// routes/searchRoutes.js
import express from "express";
import { searchDocuments } from "../controllers/contentController.js";
import { userMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET /api/v1/search
router.get("/search", userMiddleware, searchDocuments);

export default router;
