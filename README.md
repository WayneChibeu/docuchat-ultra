# DocuChat Ultra 🧠✨

> **Experience the future of document interaction.** 
> DocuChat Ultra is a premium, AI-powered document assistant featuring a "Premium Glass" aesthetic, real-time streaming responses, and intelligent single-document context.

![DocuChat Ultra](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2QzM2QzM2QzM2QzM2QzM2QzM2QzM2QzM2QzM2QzM3/xT9IgzoKnwFNmISR8I/giphy.gif)

*(Replace above link with actual demo screenshot if available)*

## 🚀 Features

### **Ultra Mode UI**
- **Premium Glass Aesthetic**: Frosted glass panels (glassmorphism), deep aurora gradients, and 1px borders for a modern, high-end look.
- **Typewriter Effect**: AI responses stream character-by-character for a "live" conversation feel.
- **Markdown Intelligence**: Full support for bold, italics, code blocks, and structured lists in AI replies.

### **Core Intelligence**
- **RAG Architecture**: Uses Retrieval-Augmented Generation to chat *with* your specific documents, not just general knowledge.
- **Single-Document Focus**: Automatically clears context when a new file is uploaded, preventing hallucinated crossovers between documents.
- **High-Performance Vector DB**: Powered by **Pinecone** for instant, semantic search.
- **Google Gemini Pro**: The brain behind the operation, providing nuanced and accurate answers.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + `@tailwindcss/typography`
- **AI Model**: Google Gemini Pro (`@google/generative-ai`)
- **Vector DB**: Pinecone
- **Handling**: `pdfjs-dist` for client-side parsing

## 📦 local Setup

1.  **Clone the repo:**
    ```bash
    git clone https://github.com/WayneChibeu/docuchat-ultra.git
    cd docuchat-ultra
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    # or npm install
    ```

3.  **Configure Environment:**
    Create a `.env` file in the root:
    ```env
    GOOGLE_GEMINI_API_KEY=your_key_here
    PINECONE_API_KEY=your_key_here
    PINECONE_INDEX=docuchat
    ```

4.  **Run Development Server:**
    ```bash
    pnpm dev
    ```

Open [http://localhost:3000](http://localhost:3000) to see it in action.

## 🚢 Deployment

Deployed via **Vercel**. 
Live URL: [docuchat-ultra.vercel.app](https://docuchat-ultra.vercel.app)

---

*Built with ❤️ by Wayne*
