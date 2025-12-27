import { GoogleGenerativeAI } from "@google/generative-ai";
import { Pinecone } from "@pinecone-database/pinecone";

// Initialize Gemini
const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
if (!apiKey) console.error("❌ GOOGLE_GEMINI_API_KEY is missing!");
else console.log("✅ GOOGLE_GEMINI_API_KEY found");

export const genAI = new GoogleGenerativeAI(apiKey || "");

// Initialize Pinecone
const pineconeApiKey = process.env.PINECONE_API_KEY;
if (!pineconeApiKey) console.error("❌ PINECONE_API_KEY is missing!");
else console.log("✅ PINECONE_API_KEY found");

export const pinecone = new Pinecone({
  apiKey: pineconeApiKey || "",
});

// Get embedding model
export const embeddingModel = genAI.getGenerativeModel({
  model: "text-embedding-004",
});

// Get chat model
export const chatModel = genAI.getGenerativeModel({
  model: "gemini-flash-latest",
});

// Helper to get embeddings
export async function getEmbedding(text: string): Promise<number[]> {
  const result = await embeddingModel.embedContent(text);
  return result.embedding.values;
}

// Get Pinecone index
export function getPineconeIndex() {
  return pinecone.index(process.env.PINECONE_INDEX || "docuchat");
}
