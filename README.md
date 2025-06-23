🧠 WebMind — Your Personal AI Memory Assistant
WebMind is a full-stack AI memory system that helps you remember, manage, and retrieve knowledge from your documents, notes, tweets, and websites.
Powered by OpenAI/Gemini and Pinecone, WebMind transforms your saved content into searchable memory — just ask questions and get smart, context-aware answers.

✨ Features
🔐 JWT Authentication – Secure sign-up and login system

📝 Notes – Save personal thoughts, ideas, and to-do lists

🐦 Tweet Saver – Extract tweet content via URL

📄 PDF Upload – Upload and extract text from documents

🌐 Website Capture – Save and summarize web content

💬 AI Chat – Ask questions based on your saved content

🔎 Semantic Search – Powered by Pinecone vector DB

🧾 User Dashboard – Manage and retrieve saved knowledge

☁️ MongoDB Storage – Robust database via Mongoose

🧱 Tech Stack
Backend:

Node.js

Express.js

Multer (for file uploads)

JWT (JSON Web Tokens for authentication)

Database:

MongoDB Atlas

Mongoose (ODM)

Vector DB:

Pinecone

AI Engine:

OpenAI

Gemini (Google)

PDF Parsing:

pdf-parse

🚀 Getting Started
✅ Prerequisites
Node.js v18 or higher

MongoDB Atlas account

Pinecone account

OpenAI or Gemini API Key

📦 Installation
1. Clone the repository:
bash
Copy
Edit
git clone https://github.com/saeedsaiyed01/WebMind.git
cd WebMind
2. Create a .env file in the root directory:
ini
Copy
Edit
MONGODB_URI=your_mongo_connection_string  
OPENAI_API_KEY=your_openai_api_key  
PINECONE_API_KEY=your_pinecone_api_key  
PINECONE_ENVIRONMENT=your_pinecone_environment  
PINECONE_INDEX_NAME=your_pinecone_index  
JWT_PASSWORD=your_jwt_secret  
3. Install dependencies:
bash
Copy
Edit
npm install
# or
yarn install
# or
pnpm install
4. Run the development server:
bash
Copy
Edit
npm run dev
# or
yarn dev
# or
pnpm dev
🔗 Twitter
Follow updates: @Saeedtwt

🧠 Stay smart. Stay organized.
