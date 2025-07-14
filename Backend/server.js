// server.js
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/db.js";
import { generalLimiter } from "./middlewares/rateLimiter.js";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";



dotenv.config();
const app = express();

// If behind a proxy/load balancer (e.g., Vercel), so req.ip is correct:
// app.set("trust proxy", true);
app.use(express.json());
// CORS setup
const allowedOrigins = [
  'http://localhost:5173',
  'https://web-mind.vercel.app',
  'https://www.webmind.buzz',
  'http://localhost:8000'
];
app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (e.g., mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));


async function bootstrap() {
  // 1️⃣ Connect to Mongo
  await connectDB();
app.use(generalLimiter);
// Parse JSON bodies
app.use(bodyParser.json());

// Mount routers under /api/v1
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/", contentRoutes);
app.use("/api/v1", uploadRoutes);
app.use("/api/v1", searchRoutes);
app.use("/api/v1", chatRoutes);

// // --------- Multer Configuration (file uploads) ---------
// // Directory for uploads: /tmp/uploads in production, or ./uploads in dev
// const uploadDir = process.env.NODE_ENV === "production"
//   ? path.join("/tmp", "uploads")
//   : path.join(process.cwd(), "uploads");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Limits: max file size (e.g., 20 MB; adjust via env if desired)
// const MAX_FILE_SIZE = parseInt(process.env.MAX_UPLOAD_SIZE_BYTES) || 20 * 1024 * 1024;

// // Only allow PDFs (adjust as needed)
// function fileFilter(req, file, cb) {
//   if (file.mimetype !== "application/pdf") {
//     return cb(new Error("Only PDF files are allowed"), false);
//   }
//   cb(null, true);
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadDir),
//   filename: (req, file, cb) => {
//     const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
//     cb(null, `doc-${uniqueSuffix}${path.extname(file.originalname)}`);
//   }
// });
// const upload = multer({
//   storage,
//   limits: { fileSize: MAX_FILE_SIZE },
//   fileFilter,
// });

// // --------- PDF Text Extraction Helper ---------
// async function extractPdfTextWithPdf2json(filePath) {
//   return new Promise((resolve, reject) => {
//     const pdfParser = new PdfParser();
//     pdfParser.on("pdfParser_dataError", errData => {
//       console.error("pdf2json error:", errData.parserError);
//       reject(new Error(errData.parserError));
//     });
//     pdfParser.on("pdfParser_dataReady", pdfData => {
//       let pages = [];
//       if (pdfData.formImage && pdfData.formImage.Pages) {
//         pages = pdfData.formImage.Pages;
//       } else if (pdfData.Pages) {
//         pages = pdfData.Pages;
//       } else {
//         const errorMsg = "Parsed PDF data missing expected 'Pages' structure.";
//         console.error(errorMsg, pdfData);
//         return reject(new Error(errorMsg));
//       }

//       let fullText = "";
//       for (const page of pages) {
//         if (page.Texts && Array.isArray(page.Texts)) {
//           for (const text of page.Texts) {
//             const txt = text.R.map(r => decodeURIComponent(r.T)).join(" ");
//             fullText += txt + " ";
//           }
//           fullText += "\n";
//         }
//       }
//       resolve(fullText);
//     });
//     pdfParser.loadPDF(filePath);
//   });
// }


// --------- Validation Schemas ---------
// const signupSchema = z.object({
//   username: z.string().email({ message: "Username must be a valid email" }),
//   password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
// });
// const signinSchema = z.object({
//   username: z.string().email({ message: "Username must be a valid email" }),
//   password: z.string().min(1, { message: "Password is required" }),
// });

// --------- Routes ---------

// Root
app.get("/", (req, res) => {
  res.send("Backend is working!");
});

// // Signup
// app.post("/api/v1/signup", async (req, res) => {
//   try {
//     const parseResult = signupSchema.safeParse(req.body);
//     if (!parseResult.success) {
//       return res.status(400).json({ message: "Validation error", errors: parseResult.error.flatten() });
//     }
//     const { username, password } = parseResult.data;
//     // Check if existing user
//     const exists = await UserModel.findOne({ username });
//     if (exists) {
//       return res.status(409).json({ message: "User already exists" });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = await UserModel.create({ username, password: hashedPassword });
//     const token = jwt.sign({ id: newUser._id }, JWT_PASSWORD);
//     res.json({ message: "User signed up", token });
//   } catch (error) {
//     console.error("Sign up error:", error);
//     res.status(500).json({ message: "Failed to sign up", error: error.message });
//   }
// });

// // // Signin
// // app.post("/api/v1/signin", async (req, res) => {
// //   try {
// //     const parseResult = signinSchema.safeParse(req.body);
// //     if (!parseResult.success) {
// //       return res.status(400).json({ message: "Validation error", errors: parseResult.error.flatten() });
// //     }
// //     const { username, password } = parseResult.data;
// //     const existingUser = await UserModel.findOne({ username });
// //     if (!existingUser) {
// //       return res.status(403).json({ message: "Incorrect credentials" });
// //     }
// //     const passwordMatch = await bcrypt.compare(password, existingUser.password);
// //     if (!passwordMatch) {
// //       return res.status(403).json({ message: "Incorrect credentials" });
// //     }
// //     const token = jwt.sign({ id: existingUser._id }, JWT_PASSWORD);
// //     res.json({ token });
// //   } catch (error) {
// //     console.error("Sign in error:", error);
// //     res.status(500).json({ message: "Sign in failed", error: error.message });
// //   }
// // });
// // ✅ Signin route
// app.post("/api/v1/signin", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     if (!username || !password) return res.status(400).json({ message: "Missing credentials" });

//     const existingUser = await UserModel.findOne({ username });
//     if (!existingUser) return res.status(403).json({ message: "Incorrect credentials" });

//     const passwordMatch = await bcrypt.compare(password, existingUser.password);
//     if (!passwordMatch) return res.status(403).json({ message: "Incorrect credentials" });

//     const token = jwt.sign({ id: existingUser._id }, JWT_PASSWORD);
//     res.json({ token });
//   } catch (error) {
//     console.error("Sign in error:", error);
//     res.status(500).json({ message: "Sign in failed", error: error.message });
//   }
// });
// // Get current user info
// app.get("/me", userMiddleware, async (req, res) => {
//   try {
//     const user = await UserModel.findById(req.userId).select("_id username");
//     if (!user) return res.status(404).json({ error: "User not found" });
//     res.json(user);
//   } catch (error) {
//     console.error("Get /me error:", error);
//     res.status(500).json({ error: "Failed to get user info" });
//   }
// });

// // Get all content
// app.get("/api/v1/content", userMiddleware, async (req, res) => {
//   try {
//     const userId = req.userId;
//     const content = await ContentModel.find({ userId }).populate("userId", "username");
//     res.json({ content });
//   } catch (error) {
//     console.error("Get content error:", error);
//     res.status(500).json({ message: "Failed to fetch content", error: error.message });
//   }
// });

// // Update content (e.g., title)
// app.put("/api/v1/content", userMiddleware, async (req, res) => {
//   const { contentId, newTitle } = req.body;
//   const userId = req.userId;
//   if (!contentId || typeof newTitle !== "string") {
//     return res.status(400).json({ message: "contentId and newTitle are required" });
//   }
//   try {
//     const updated = await ContentModel.findOneAndUpdate(
//       { _id: contentId, userId },
//       { title: newTitle },
//       { new: true }
//     );
//     if (!updated) {
//       return res.status(404).json({ message: "Content not found or unauthorized" });
//     }
//     res.json({ message: "Updated successfully", updated });
//   } catch (error) {
//     console.error("Update content error:", error);
//     res.status(500).json({ message: "Failed to update content", error: error.message });
//   }
// });

// // Delete content
// app.delete("/api/v1/content", userMiddleware, async (req, res) => {
//   const { contentId } = req.body;
//   const userId = req.userId;
//   if (!contentId) {
//     return res.status(400).json({ message: "contentId is required" });
//   }
//   try {
//     const contentDoc = await ContentModel.findOne({ _id: contentId, userId });
//     if (!contentDoc) {
//       return res.status(404).json({ message: "Content not found or already deleted" });
//     }
//     // Delete from Pinecone
//     await deleteDocumentFromPinecone(contentDoc.pineconeId);
//     // Delete from MongoDB
//     await ContentModel.findOneAndDelete({ _id: contentId, userId });
//     res.json({ message: "Deleted successfully" });
//   } catch (error) {
//     console.error("Delete content error:", error);
//     res.status(500).json({ message: "Failed to delete content", error: error.message });
//   }
// });

// // Memory route (notes, tweets, websites)
// app.post("/api/v1/memory", userMiddleware, async (req, res) => {
//   try {
//     const { content, type, url, title } = req.body;
//     const userId = req.userId;
//     if (!type || !["note", "tweet", "document", "website"].includes(type)) {
//       return res.status(400).json({ error: "Invalid type" });
//     }
//     let finalContent = content || "";

//     if (type === "tweet" && url) {
//       const existingMemory = await ContentModel.findOne({ type: "tweet", originalLink: url, userId });
//       if (existingMemory) {
//         finalContent = existingMemory.link;
//       } else {
//         const tweetText = await fetchTweetTextWithRetry(url, 3, 2000);
//         if (!tweetText) {
//           return res.status(400).json({ error: "Could not fetch tweet text" });
//         }
//         finalContent = tweetText;
//       }
//     }
//     if (type === "website" && !finalContent.trim() && url) {
//       finalContent = url;
//     }
//     if (!finalContent.trim()) {
//       return res.status(400).json({ error: "Missing content" });
//     }

//     const pineconeId = `${type}-${uuidv4()}`;
//     const extraMetadata = { timestamp: new Date().toISOString(), type, ...(url ? { url } : {}) };

//     await storeDocument(pineconeId, finalContent, type, extraMetadata, userId);

//     const memoryRecord = await ContentModel.create({
//       title: title || "",
//       link: finalContent,
//       originalLink: type === "tweet" ? url : "",
//       type,
//       userId,
//       pineconeId,
//       timestamp: extraMetadata.timestamp,
//     });

//     res.status(201).json({ message: "Memory stored successfully", memory: memoryRecord });
//   } catch (error) {
//     console.error("Memory route error:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // Upload-document route with rate limiter, CAPTCHA check, file limits
// app.post(
//   "/api/v1/upload-document",
//   userMiddleware,
//   upload.single("file"),
//   async (req, res) => {
//     try {
//       const { title } = req.body;
//       if (!req.file) {
//         return res.status(400).json({ error: "No file provided" });
//       }

//       const userId = req.userId;
//       const filePath = req.file.path;
//       const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

//       console.log(`Extracting text from ${filePath}...`);
//       let extractedText = "";
//       try {
//         extractedText = await extractPdfTextWithPdf2json(filePath);
//         console.log(`Extraction complete. Text length: ${extractedText.length} characters`);
//       } catch (err) {
//         console.warn("PDF extraction failed, will store URL only:", err);
//       }

//       const type = "document";
//       const pineconeId = `${type}-${uuidv4()}`;
//       const extraMetadata = {
//         timestamp: new Date().toISOString(),
//         type,
//         fileName: req.file.originalname,
//         fileSize: req.file.size,
//         mimeType: req.file.mimetype,
//       };

//       // Store document with extracted text (or fallback to fileUrl)
//       await storeDocument(pineconeId, extractedText || fileUrl, type, extraMetadata, userId);

//       // Save record in DB
//       const memoryRecord = await ContentModel.create({
//         title: title || req.file.originalname || "Document",
//         link: fileUrl,
//         extractedText: extractedText || "",
//         type,
//         userId,
//         pineconeId,
//         timestamp: extraMetadata.timestamp,
//         fileMetadata: {
//           originalName: req.file.originalname,
//           size: req.file.size,
//           mimeType: req.file.mimetype,
//         }
//       });

//       res.status(201).json({
//         message: "Document stored successfully",
//         memory: memoryRecord
//       });
//     } catch (error) {
//       console.error("Upload-document error:", error);
//       // If multer fileFilter error:
//       if (error instanceof multer.MulterError || error.message.includes("Only PDF")) {
//         return res.status(400).json({ error: error.message });
//       }
//       res.status(500).json({ error: "Failed to store document", details: error.message });
//     }
//   }
// );



// // Chat endpoint
// app.post("/api/v1/chat", userMiddleware, async (req, res) => {
//   try {
//     const { message } = req.body;
//     const userId = req.userId;
//     if (!message) {
//       return res.status(400).json({ error: "Missing message" });
//     }
//     const userMemories = await searchDocuments(message, userId, 5);
//     const answer = await generateAnswer(message, userMemories);
//     res.json({ answer, timestamp: new Date().toISOString() });
//   } catch (error) {
//     console.error("Chat error:", error);
//     res.status(500).json({ error: "Failed to generate answer" });
//   }
// });

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
}bootstrap();