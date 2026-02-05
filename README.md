# WebMind 🧠

WebMind is a powerful AI-driven application designed to facilitate intelligent conversations, content creation, and document analysis. It allows users to interact with multiple advanced LLMs (Large Language Models) through a sleek, modern interface.

## 🚀 Features

*   **Multi-Model Chat**: Interact with various AI models (Gemini, OpenAI, etc.) via a unified interface.
*   **Modern UI/UX**: A revamped "Black & White" aesthetic featuring glassmorphism, spotlight effects, and smooth Framer Motion animations.
*   **Authentication**: Secure user login and signup with Email/Password and Google OAuth.
*   **Dashboard**: Centralized hub for managing chats and generated content.
*   **Document Analysis**: Capabilities to parse and analyze PDF documents using vector search (Pinecone).
*   **Subscription System**: Integrated pricing and payment flows.

## 🛠 Tech Stack

### Frontend
*   **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
*   **Language**: TypeScript
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Components**: [ShadCN UI](https://ui.shadcn.com/), Radix UI
*   **State Management**: [Zustand](https://github.com/pmndrs/zustand)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)

### Backend
*   **Runtime**: Node.js + Express.js
*   **Database**: MongoDB (Mongoose)
*   **Vector DB**: Pinecone (for RAG/embeddings)
*   **AI Integration**: LangChain, Google Generative AI SDK, OpenAI SDK
*   **Authentication**: Passport.js, JWT, Bcrypt
*   **File Handling**: Multer (Uploads), Cloudinary (Storage)

## 📂 Project Structure

```
WebMind-BE/
├── Backend/            # Express.js Server & API
│   ├── controllers/    # Request handlers
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API endpoints
│   └── server.js       # Entry point
│
├── Frontend/           # React Client Application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Application views
│   │   └── store/      # Zustand state stores
│   └── vite.config.ts
└── README.md           # Project Documentation
```

## 🏁 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
*   Node.js (v18 or higher recommended)
*   MongoDB (Local or Atlas connection)
*   Git

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/saeedsaiyed01/WebMind.git
    cd WebMind-BE
    ```

2.  **Setup Backend**
    ```bash
    cd Backend
    npm install
    ```
    Create a `.env` file in the `Backend` directory with necessary keys:
    ```env
    PORT=8000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    OPENAI_API_KEY=your_key
    GOOGLE_API_KEY=your_key
    PINECONE_API_KEY=your_key
    CLOUDINARY_URL=your_url
    # Add other provider keys as needed
    ```

3.  **Setup Frontend**
    ```bash
    cd ../Frontend
    npm install
    ```

### Running the Application

**1. Start the Backend Server**
```bash
cd Backend
npm run dev
# Server runs on http://localhost:8000
```

**2. Start the Frontend Development Server**
```bash
cd Frontend
npm run dev
# App runs on http://localhost:5173
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.
