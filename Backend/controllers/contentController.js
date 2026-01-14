// contentController.js

import fs from "fs";
import multer from "multer";
import streamifier from "streamifier";
import { v4 as uuidv4 } from "uuid";
import { ContentModel } from "../models/content.model.js";
import { deleteDocumentFromPinecone } from "../services/deleteFromPinecone.js";
import { fetchTweetTextWithRetry } from "../services/fetchTweet.js";
import { storeDocument } from "../services/storeInPinecone.js";
import { cloudinary } from "../utils/cloudinary.js";
import extractPdfTextWithPdf2json from "../utils/pdfHelper.js";
// Get all content
export async function listContent(req, res) {
    try {
        const userId = req.userId;
        const content = await ContentModel.find({ userId }).populate("userId", "username");
        res.json({ content });
    } catch (error) {
        console.error("Get content error:", error);
        res.status(500).json({ message: "Failed to fetch content", error: error.message });
    }
};


// Update content (e.g., title)
// Update content (title, link, content)
export async function updateContent(req, res) {
    const { contentId, newTitle, link, content } = req.body;
    const userId = req.userId;
    if (!contentId) {
        return res.status(400).json({ message: "contentId is required" });
    }
    try {
        const updateFields = {};
        if (newTitle) updateFields.title = newTitle;
        if (link) updateFields.link = link;
        if (content) updateFields.link = content; // Mapped to 'link' as per schema usage

        const updated = await ContentModel.findOneAndUpdate(
            { _id: contentId, userId },
            updateFields,
            { new: true }
        );
        if (!updated) {
            return res.status(404).json({ message: "Content not found or unauthorized" });
        }
        res.json({ message: "Updated successfully", updated });
    } catch (error) {
        console.error("Update content error:", error);
        res.status(500).json({ message: "Failed to update content", error: error.message });
    }
};

// Delete content
export async function deleteContent(req, res) {
    const { contentId } = req.body;
    const userId = req.userId;
    if (!contentId) {
        return res.status(400).json({ message: "contentId is required" });
    }
    try {
        const contentDoc = await ContentModel.findOne({ _id: contentId, userId });
        if (!contentDoc) {
            return res.status(404).json({ message: "Content not found or already deleted" });

        }
        // Delete from Pinecone
        await deleteDocumentFromPinecone(contentDoc.pineconeId);
        const publicId = contentDoc.fileMetadata?.cloudinaryPublicId;
        if (publicId) {
            await cloudinary.uploader.destroy(publicId, {
                resource_type: "raw"
            });
        }
        // Delete from MongoDB
        await ContentModel.findOneAndDelete({ _id: contentId, userId });
        res.json({ message: "Deleted successfully" });
    } catch (error) {
        console.error("Delete content error:", error);
        res.status(500).json({ message: "Failed to delete content", error: error.message });
    }
};



// Memory route (notes, tweets, websites)
export async function handleaddMemory(req, res) {
    try {
        const { content, type, url, title } = req.body;
        const userId = req.userId;
        if (!type || !["note", "tweet", "document", "website"].includes(type)) {
            return res.status(400).json({ error: "Invalid type" });
        }
        let finalContent = content || "";

        if (type === "tweet" && url) {
            const existingMemory = await ContentModel.findOne({ type: "tweet", originalLink: url, userId });
            if (existingMemory) {
                finalContent = existingMemory.link;
            } else {
                const tweetText = await fetchTweetTextWithRetry(url, 3, 2000);
                if (!tweetText) {
                    return res.status(400).json({ error: "Could not fetch tweet text" });
                }
                finalContent = tweetText;
            }
        }
        if (type === "website" && !finalContent.trim() && url) {
            finalContent = url;
        }
        if (!finalContent.trim()) {
            return res.status(400).json({ error: "Missing content" });
        }

        const pineconeId = `${type}-${uuidv4()}`;
        const extraMetadata = { timestamp: new Date().toISOString(), type, ...(url ? { url } : {}) };

        await storeDocument(pineconeId, finalContent, type, extraMetadata, userId);

        const memoryRecord = await ContentModel.create({
            title: title || "",
            link: finalContent,
            originalLink: type === "tweet" ? url : "",
            type,
            userId,
            pineconeId,
            timestamp: extraMetadata.timestamp,

        });

        res.status(201).json({ message: "Memory stored successfully", memory: memoryRecord });
    } catch (error) {
        console.error("Memory route error:", error);
        res.status(500).json({ error: error.message });
    }
};
// Cloudinary uploader helper
function uploadToCloudinary(fileBuffer, fileName) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                resource_type: "raw",
                folder: "webmind_docs",
                public_id: fileName.replace(/\.[^/.]+$/, ""), // remove extension
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url); // Get Cloudinary URL
            }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
    });
}


// // Upload-document route with rate limiter, CAPTCHA check, file limits
// export async function handlePdfUpload(req, res) {
//     try {
//         const { title } = req.body;

//         if (!req.file) {
//             return res.status(400).json({ error: "No file provided" });
//         }

//         const userId = req.userId;
//         const filePath = req.file.path;
//         const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

//         console.log(`Extracting text from ${filePath}...`);
//         let extractedText = "";
//         try {
//             extractedText = await extractPdfTextWithPdf2json(filePath);
//             console.log(`Extraction complete. Text length: ${extractedText.length} characters`);
//         } catch (err) {
//             console.warn("PDF extraction failed, will store URL only:", err);
//         }

//         const type = "document";
//         const pineconeId = `${type}-${uuidv4()}`;
//         const extraMetadata = {
//             timestamp: new Date().toISOString(),
//             type,
//             fileName: req.file.originalname,
//             fileSize: req.file.size,
//             mimeType: req.file.mimetype,
//         };

//         // Store document with extracted text (or fallback to fileUrl)
//         await storeDocument(pineconeId, extractedText || fileUrl, type, extraMetadata, userId);

//         // Save record in DB
//         const memoryRecord = await ContentModel.create({
//             title: title || req.file.originalname || "Document",
//             link: fileUrl,
//             extractedText: extractedText || "",
//             type,
//             userId,
//             pineconeId,
//             timestamp: extraMetadata.timestamp,
//             fileMetadata: {
//                 originalName: req.file.originalname,
//                 size: req.file.size,
//                 mimeType: req.file.mimetype,
//             }
//         });

//         res.status(201).json({
//             message: "Document stored successfully",
//             memory: memoryRecord
//         });
//     } catch (error) {
//         console.error("Upload-document error:", error);
//         // If multer fileFilter error:
//         if (error instanceof multer.MulterError || error.message.includes("Only PDF")) {
//             return res.status(400).json({ error: error.message });
//         }
//         res.status(500).json({ error: "Failed to store document", details: error.message });
//     }
// }


// Main Upload Controller
export async function handlePdfUpload(req, res) {
    try {
        const { title } = req.body;
        const userId = req.userId;

        if (!req.file) {
            return res.status(400).json({ error: "No file provided" });
        }

        const filePath = req.file.path;
        const fileBuffer = fs.readFileSync(filePath); // Read file from disk

        // 🔁 Upload to Cloudinary using stream
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "raw",
                    folder: "webmind/uploads",
                    public_id: `doc-${uuidv4()}`
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            stream.end(fileBuffer);
        });

        const cloudinaryUrl = result.secure_url;
        const publicId = result.public_id;

        // 🖼️ Generate preview image from first page
        const previewUrl = cloudinary.url(publicId + ".jpg", {
            width: 600,
            quality: "auto",
            format: "jpg",
            page: 1,
            crop: "scale"
        });

        // 📄 Extract text
        let extractedText = "";
        try {
            extractedText = await extractPdfTextWithPdf2json(filePath);
            console.log(`PDF text extracted (${extractedText.length} characters)`);
        } catch (err) {
            console.warn("PDF extraction failed. Saving URL only:", err.message);
        }

        const type = "document";
        const pineconeId = `${type}-${uuidv4()}`;
        const extraMetadata = {
            timestamp: new Date().toISOString(),
            type,
            fileName: req.file.originalname,
            fileSize: req.file.size,
            mimeType: req.file.mimetype,
        };

        // 🧠 Store in Pinecone
        await storeDocument(
            pineconeId,
            extractedText || cloudinaryUrl,
            type,
            extraMetadata,
            userId
        );

        // 🗃️ Save to MongoDB
        const memoryRecord = await ContentModel.create({
            title: title || req.file.originalname || "Untitled PDF",
            link: cloudinaryUrl,
            preview: previewUrl,
            extractedText: extractedText || "",
            type,
            userId,
            pineconeId,
            timestamp: extraMetadata.timestamp,
            fileMetadata: {
                originalName: req.file.originalname,
                size: req.file.size,
                mimeType: req.file.mimetype,
                cloudinaryPublicId: publicId,
            },
        });

        // 🧹 Clean temp file
        fs.unlink(filePath, (err) => {
            if (err) console.warn("Failed to delete temp file:", filePath);
        });

        // ✅ Final response
        res.status(201).json({
            message: "Document uploaded successfully",
            memory: memoryRecord,
        });
    } catch (error) {
        console.error("Upload-document error:", error);
        if (error instanceof multer.MulterError || error.message.includes("Only PDF")) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: "Failed to store document", details: error.message });
    }
}







// Search documents
export async function searchDocuments(req, res) {
    try {
        const { title } = req.query;
        const userId = req.userId;
        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }
        const results = await ContentModel.find({ userId, title: { $regex: title, $options: "i" } })
            .sort({ timestamp: -1 });
        res.status(200).json({ results });
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ message: "Search failed", error: error.message });
    }
};

// Search content for @ mention autocomplete
export async function searchContent(req, res) {
    try {
        const { q } = req.query;
        const userId = req.userId;

        // Build query - if q is provided, search by title or type
        const query = { userId };
        if (q && q.trim()) {
            query.$or = [
                { title: { $regex: q, $options: "i" } },
                { type: { $regex: q, $options: "i" } }
            ];
        }

        const results = await ContentModel.find(query)
            .select("_id title type timestamp link pineconeId")
            .limit(10)
            .sort({ timestamp: -1 });

        res.json({ results });
    } catch (error) {
        console.error("Search content error:", error);
        res.status(500).json({ message: "Search failed", error: error.message });
    }
};