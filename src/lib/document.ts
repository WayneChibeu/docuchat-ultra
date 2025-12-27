export interface DocumentChunk {
    id: string;
    text: string;
    metadata: {
        documentName: string;
        pageNumber?: number;
        chunkIndex: number;
    };
}

// Chunk text into smaller pieces for embedding
export function chunkText(text: string, chunkSize: number = 500, overlap: number = 100): string[] {
    const chunks: string[] = [];
    let start = 0;

    while (start < text.length) {
        const end = Math.min(start + chunkSize, text.length);
        chunks.push(text.slice(start, end));

        // If we processed the last chunk, stop
        if (end >= text.length) break;

        start = end - overlap;
    }

    return chunks.filter(chunk => chunk.trim().length > 0);
}

// Generate unique chunk ID
export function generateChunkId(documentName: string, index: number): string {
    return `${documentName.replace(/[^a-zA-Z0-9]/g, "_")}_chunk_${index}`;
}
