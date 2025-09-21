# Assistive AAC Web App

A modern, AI-powered Augmentative and Alternative Communication (AAC) web application for patients with speech or communication difficulties. Built with Next.js, React, and advanced AI features for enhanced accessibility and patient care.

## Features

- **Customizable Communication Board:**
  - Tap tiles to speak common words, phrases, or actions using text-to-speech.
  - Tiles are sorted adaptively by usage frequency and recency.
  - Contextual tile suggestions based on the last selected tile.

- **AI Chatbot Assistant:**
  - Integrated chatbot for natural language conversation.
  - Powered by Gemini or OpenAI, with Retrieval-Augmented Generation (RAG) support.
  - Upload a patient history PDF and chat with the AI, which references the uploaded document for context-aware responses.

- **PDF Upload & RAG:**
  - Upload patient history PDFs.
  - Extracts and indexes content for AI-powered, context-aware chat.

- **User Profiles:**
  - Multiple user profiles with personalized boards and usage statistics.

- **Modern UI:**
  - Responsive, accessible, and visually appealing design with glassmorphism effects.

## Getting Started

### Prerequisites
- Node.js (18+ recommended)
- npm or pnpm

### Installation
```bash
# Clone the repository
https://github.com/aditya6114/Assistive_AAC.git
cd Assistive_AAC

# Install dependencies
npm install
# or
pnpm install
```

### Environment Variables
Create a `.env` file in the root directory and add the following:
```
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=lang
COHERE_API_KEY=your_cohere_api_key
GOOGLE_API_KEY=your_google_genai_api_key
```

### Running the App
```bash
npm run dev
# or
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure
```
app/           # Next.js app directory (pages, API routes, etc.)
components/    # React UI components (ChatBot, UI, etc.)
contexts/      # React context for AAC state
hooks/         # Custom React hooks
lib/           # Utility libraries (speech, etc.)
pages/         # (If using legacy API routes)
public/        # Static assets
styles/        # Global and component styles
uploads/       # Uploaded PDF files (gitignored)
```

## Tech Stack
- Next.js, React, TypeScript
- Tailwind CSS (with custom glassmorphism)
- Pinecone, Cohere, Google Gemini (LangChain)
- Multer (for PDF upload)

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE)

---
**Maintainer:** [aditya6114](https://github.com/aditya6114)
