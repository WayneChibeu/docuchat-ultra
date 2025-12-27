import { NextRequest, NextResponse } from "next/server";
import { getEmbedding, getPineconeIndex } from "@/lib/ai";
import { chunkText, generateChunkId } from "@/lib/document";

export const maxDuration = 60; // Allow longer processing time

export async function POST(request: NextRequest) {
    console.log("Upload API called");
    try {
        const body = await request.json();
        console.log("Request body received, fileName:", body.fileName);
        const { text, fileName } = body;

        if (!text || typeof text !== "string") {
            return NextResponse.json(
                { error: "No text content provided" },
                { status: 400 }
            );
        }

        if (!fileName) {
            return NextResponse.json(
                { error: "No file name provided" },
                { status: 400 }
            );
        }

        if (text.trim().length === 0) {
            return NextResponse.json(
                { error: "Empty document content" },
                { status: 400 }
            );
        }

        // Chunk the text
        const chunks = chunkText(text, 500, 100);

        // Get Pinecone index
        const index = getPineconeIndex();

        // ⚠️ CLEAR EXISTING VECTORS:
        // Delete all vectors in the namespace to ensure we only chat with the new document.
        try {
            await index.deleteAll();
            console.log("Cleared previous vectors from Pinecone");
        } catch (e) {
            console.warn("Could not clear index (might be empty):", e);
        }

        // Process each chunk and upload to Pinecone
        const records = await Promise.all(
            chunks.map(async (chunk, i) => {
                const embedding = await getEmbedding(chunk);
                return {
                    id: generateChunkId(fileName, i),
                    values: embedding,
                    metadata: {
                        text: chunk,
                        documentName: fileName,
                        chunkIndex: i,
                    },
                };
            })
        );

        // Upsert to Pinecone in batches
        const batchSize = 100;
        for (let i = 0; i < records.length; i += batchSize) {
            const batch = records.slice(i, i + batchSize);
            await index.upsert(batch);
        }

        return NextResponse.json({
            success: true,
            message: `Successfully processed "${fileName}"`,
            chunks: chunks.length,
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: "Failed to process document" },
            { status: 500 }
        );
    }
}
