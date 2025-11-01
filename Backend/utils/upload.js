// middlewares/upload.js
import fs from "fs";
import multer from "multer";
import path from "path";

// Upload directory based on environment
const uploadDir = process.env.NODE_ENV === "production"
  ? path.join("/tmp", "uploads")
  : path.join(process.cwd(), "uploads");
  
// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Limit file size (default: 20MB)
const MAX_FILE_SIZE = parseInt(process.env.MAX_UPLOAD_SIZE_BYTES) || 20 * 1024 * 1024;

// File filter to allow only PDFs
function fileFilter(req, file, cb) {
  if (file.mimetype !== "application/pdf") {
    return cb(new Error("Only PDF files are allowed"), false);
  }
  cb(null, true);
}

// Multer disk storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `doc-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Multer instance
// export default upload = multer({
//   storage,
//   limits: { fileSize: MAX_FILE_SIZE },
//   fileFilter
// });

const upload = multer({ storage, limits: { fileSize: MAX_FILE_SIZE }, fileFilter });

export default upload;