// server.js
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import googleAuth from "./config/googleAuth.js";
import { passport } from "./config/passport.js";
import connectDB from "./db/db.js";
import { generalLimiter } from "./middlewares/rateLimiter.js";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import paymentRoutes from "./routes/payment.js";
import pricingRoutes from "./routes/pricingRoute.js";
import searchRoutes from "./routes/searchRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import webhookRoutes from "./routes/webhook.js";

dotenv.config();
const app = express();
app.use(express.json());

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174', // Frontend is running on port 5174
  'https://web-mind.vercel.app',
  'https://webmind.buzz', // your custom domain
  'https://www.webmind.buzz',
  'http://webmind.buzz',
  'http://www.webmind.buzz',
  'https://web-mind-be.vercel.app',
  'http://localhost:8000',
  null // Allow requests with no origin (like Postman)
];

app.use(cors({
  origin: (origin, callback) => {
    console.log('CORS check for origin:', origin);
    // Allow requests with no origin (like Postman, curl, etc.)
    if (!origin) {
      return callback(null, true);
    }

    // Allow specific origins
    if (
      allowedOrigins.includes(origin) ||
      /^https?:\/\/.*vercel\.app$/.test(origin)
    ) {
      callback(null, true);
    } else {
      console.log('Rejected origin:', origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));


async function bootstrap() {
  await connectDB();


  
  app.set("trust proxy", 1);
  app.use(generalLimiter);
  app.use(bodyParser.json());

  // Initialize Passport
  app.use(passport.initialize());
  app.use("/api/v1", pricingRoutes);
  app.use("/api/v1/auth", googleAuth);
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/", contentRoutes);
  app.use("/api/v1", uploadRoutes);
  app.use("/api/v1", searchRoutes);
  app.use("/api/v1", chatRoutes);
  app.use("/api/v1", webhookRoutes);
  app.use("/api/v1", paymentRoutes);

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


  //Star server
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
} bootstrap();
