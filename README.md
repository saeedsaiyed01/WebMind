# 🧠 "WebMind" Your Personal AI Memory Assistant

WebMind is a full-stack AI memory system that helps you remember, manage, and retrieve knowledge from your documents, notes, tweets, and websites. Powered by OpenAI/Gemini and Pinecone, WebMind turns your saved content into searchable memory — ask questions and get smart answers.

## ✨ Features
-🔐 JWT Auth – Secure sign up and login system
-📝 Notes – Save personal thoughts, ideas, and lists
-🐦 Tweets – Extract tweet content via URL
-📄 PDF Upload – Upload and extract text from documents
-🌐 Website Saving – Save and process web content
-💬 AI Chat – Ask questions based on saved memories
-🔎 Pinecone Search – Semantic vector-based search
-🧾 User Dashboard – Retrieve and manage your content
-☁️ MongoDB Storage – Robust backend with Mongoose


## 🧱 Tech Stack
-Backend: Node.js, Express.js, JWT, Multer
-Database: MongoDB Atlas + Mongoose
-Vector DB: Pinecone
-AI Engine: OpenAI/Gemini
-PDF Parsing: pdf-parse
-Auth: JSON Web Tokens (JWT)

## 🚀 Getting Started

## ✅ Prerequisites
-Node.js v18+
-MongoDB Atlas account
-Pinecone account
-OpenAI/Gemini API Key

## 📦 Installation

Clone the repository:
```
bash
git clone https://github.com/saeedsaiyed01/WebMind.git
cd WebMind
```
2. Create a .env file in the root directory:
```
MONGODB_URI=your_mongo_connection_string
OPENAI_API_KEY=your_openai_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_environment
PINECONE_INDEX_NAME=your_pinecone_index
JWT_PASSWORD=your_jwt_secret
```
Install dependencies:
```
bash
npm install
# or
yarn install
# or
pnpm install
```
Run the development server:
```
bash
npm run dev
# or
yarn dev
# or
pnpm dev
```
## Twitter: @Saeedtwt
## 🧠 Stay smart. Stay organized.
