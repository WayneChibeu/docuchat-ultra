import { NextRequest, NextResponse } from "next/server";
import { getEmbedding, getPineconeIndex, chatModel } from "@/lib/ai";

export async function POST(request: NextRequest) {
    try {
        const { message } = await request.json();

        if (!message || typeof message !== "string") {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        // Get embedding for the query
        const queryEmbedding = await getEmbedding(message);

        // Search Pinecone for relevant chunks
        const index = getPineconeIndex();
        const searchResults = await index.query({
            vector: queryEmbedding,
            topK: 5,
            includeMetadata: true,
        });

        // Extract context from search results
        const context = searchResults.matches
            ?.map((match) => match.metadata?.text as string)
            .filter(Boolean)
            .join("\n\n---\n\n");

        if (!context || context.length === 0) {
            return NextResponse.json({
                response: "I don't have any documents to reference yet. Please upload a PDF first!",
                sources: [],
            });
        }

        // Get unique document names for citations
        const sources = [
            ...new Set(
                searchResults.matches?.map((m) => m.metadata?.documentName as string)
            ),
        ].filter(Boolean);

        // Create prompt with context
        const prompt = `You are DocuChat AI, a helpful assistant that answers questions based on uploaded documents.

Use the following context from the user's documents to answer their question. If the answer is not in the context, say "I couldn't find information about that in your documents."

Be concise but thorough. Cite specific information from the documents when relevant.

CONTEXT FROM DOCUMENTS:
${context}

USER QUESTION: ${message}

ANSWER:`;

        // Generate response with Gemini
        const result = await chatModel.generateContent(prompt);
        const response = result.response.text();

        return NextResponse.json({
            response,
            sources,
        });
    } catch (error) {
        console.error("Chat error:", error);
        return NextResponse.json(
            { error: "Failed to generate response" },
            { status: 500 }
        );
    }
}
