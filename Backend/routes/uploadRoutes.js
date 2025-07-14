// routes/uploadRoutes.js
import express from "express";
import { handleaddMemory, handlePdfUpload } from "../controllers/contentController.js";
import { userMiddleware } from "../middlewares/authMiddleware.js";
import { uploadLimiter } from "../middlewares/rateLimiter.js";
import upload from "../utils/upload.js";
const router = express.Router();

router.post("/memory", userMiddleware, handleaddMemory);
// POST /api/v1/upload-document
router.post(
  "/upload-document",
  userMiddleware,uploadLimiter,
  upload.single("file"),
  handlePdfUpload
);

export default router;
