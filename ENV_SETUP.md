# DocuChat AI - Environment Variables Setup

## Required API Keys

### 1. Google Gemini API Key
Get yours free at: https://aistudio.google.com

### 2. Pinecone API Key  
Get yours free at: https://app.pinecone.io

## Setup Instructions

1. **Create a file called `.env.local`** in the root of this project

2. **Add these variables:**

```
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_INDEX=docuchat
```

3. **Create a Pinecone Index:**
   - Go to Pinecone dashboard
   - Create new index named `docuchat`
   - Dimensions: `768` (for Gemini embeddings)
   - Metric: `cosine`

4. **Restart the dev server** after adding keys
