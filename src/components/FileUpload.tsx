"use client";

import { useState, useCallback, useEffect } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";

interface FileUploadProps {
    onUploadComplete?: () => void;
}

export default function FileUpload({ onUploadComplete }: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [pdfjs, setPdfjs] = useState<{
        getDocument: (params: { data: ArrayBuffer }) => { promise: Promise<PDFDocumentProxy> };
    } | null>(null);
    const [uploadStatus, setUploadStatus] = useState<{
        type: "success" | "error" | null;
        message: string;
    }>({ type: null, message: "" });

    // Load pdfjs-dist only on client side
    useEffect(() => {
        const loadPdfjs = async () => {
            const pdfjsLib = await import("pdfjs-dist");
            // Use local worker file
            pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.js";
            setPdfjs(pdfjsLib);
        };
        loadPdfjs().catch(console.error);
    }, []);

    // Extract text from PDF
    const extractTextFromPDF = async (file: File): Promise<string> => {
        if (!pdfjs) throw new Error("PDF library not loaded");

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

        let fullText = "";
        const maxPages = Math.min(pdf.numPages, 50); // Limit to 50 pages to prevent crashes

        for (let i = 1; i <= maxPages; i++) {
            // Update status (optional, but good for UX)
            setUploadStatus({
                type: null,
                message: `Extracting text: Page ${i} of ${maxPages}...`
            });

            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map((item) => (item as { str: string }).str)
                .join(" ");
            fullText += pageText + "\n\n";

            // Yield to main thread to prevent freezing
            await new Promise(resolve => setTimeout(resolve, 10));
        }

        if (pdf.numPages > maxPages) {
            console.warn(`Document truncated: Parsed ${maxPages} of ${pdf.numPages} pages.`);
        }

        return fullText.trim();
    };

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDragIn = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragOut = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleUpload(files[0]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pdfjs]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleUpload(files[0]);
        }
    };

    const handleUpload = async (file: File) => {
        if (!file.name.endsWith(".pdf")) {
            setUploadStatus({
                type: "error",
                message: "Only PDF files are supported",
            });
            return;
        }

        if (!pdfjs) {
            setUploadStatus({
                type: "error",
                message: "PDF library still loading, please try again",
            });
            return;
        }

        setIsUploading(true);
        setUploadStatus({ type: null, message: "" });

        try {
            // Extract text from PDF on client side
            setUploadStatus({ type: null, message: "Extracting text from PDF..." });
            const text = await extractTextFromPDF(file);

            if (!text || text.length < 10) {
                setUploadStatus({
                    type: "error",
                    message: "Could not extract text from this PDF. It may be image-based or protected.",
                });
                setIsUploading(false);
                return;
            }

            // Send text to server
            setUploadStatus({ type: null, message: "Processing with AI..." });
            // Send text to server
            setUploadStatus({ type: null, message: "Processing with AI..." });
            const response = await fetch("/api/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, fileName: file.name }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("API Error Response:", errorText);
                throw new Error(`Server returned ${response.status}: ${errorText.substring(0, 50)}...`);
            }

            const data = await response.json();

            if (data.error) {
                setUploadStatus({ type: "error", message: data.error });
            } else {
                setUploadStatus({
                    type: "success",
                    message: `✅ ${data.message} (${data.chunks} chunks created)`,
                });
                onUploadComplete?.();
            }
        } catch (error: any) {
            console.error("Upload error:", error);
            setUploadStatus({
                type: "error",
                message: error.message || "Failed to process document",
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="w-full">
            <div
                onDragEnter={handleDragIn}
                onDragLeave={handleDragOut}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${isDragging
                    ? "border-violet-500 bg-violet-500/10"
                    : "border-slate-600 hover:border-violet-500/50"
                    } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
            >
                <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isUploading}
                />

                <div className="flex flex-col items-center">
                    {isUploading ? (
                        <>
                            <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mb-4" />
                            <p className="text-slate-300">Processing document...</p>
                        </>
                    ) : (
                        <>
                            <svg
                                className={`w-12 h-12 mb-4 transition-colors ${isDragging ? "text-violet-500" : "text-slate-400"
                                    }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            <p className="text-slate-300 mb-1">
                                <span className="text-violet-400 font-medium">
                                    Click to upload
                                </span>{" "}
                                or drag and drop
                            </p>
                            <p className="text-sm text-slate-500">PDF files only</p>
                        </>
                    )}
                </div>
            </div>

            {/* Status message */}
            {uploadStatus.message && (
                <div
                    className={`mt-4 p-3 rounded-xl text-sm ${uploadStatus.type === "success"
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : uploadStatus.type === "error"
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : "bg-slate-700/50 text-slate-300 border border-slate-600/50"
                        }`}
                >
                    {uploadStatus.message}
                </div>
            )}
        </div>
    );
}
