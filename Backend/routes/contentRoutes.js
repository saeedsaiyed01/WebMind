import express from "express";
import { deleteContent, listContent, searchContent, updateContent } from "../controllers/contentController.js";
import { userMiddleware } from "../middlewares/authMiddleware.js";
const router = express.Router();

// router.post("/upload", upload.single("pdf"), handlePdfUpload);
// GET  /api/v1/content
router.get("/content", userMiddleware, listContent);

// GET /api/v1/content/search?q=<query> - Search for @ mention autocomplete
router.get("/content/search", userMiddleware, searchContent);

// PUT  /api/v1/content
router.put("/:contentId", userMiddleware, updateContent);

// DELETE /api/v1/content
router.delete("/:contentId", userMiddleware, deleteContent);
export default router;

