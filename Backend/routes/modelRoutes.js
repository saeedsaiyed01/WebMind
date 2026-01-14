import express from "express";
import { SUPPORTED_MODELS } from "../config/models.js";

const router = express.Router();

// GET /api/v1/models
router.get("/models", (req, res) => {
    res.json({ models: SUPPORTED_MODELS });
});

export default router;
