"use client";

import { useState, useRef, useEffect } from "react";

import ReactMarkdown from "react-markdown";

interface Message {
    role: "user" | "assistant";
    content: string;
    sources?: string[];
}

function Typewriter({ text, onComplete }: { text: string; onComplete?: () => void }) {
    const [displayedText, setDisplayedText] = useState("");
    const indexRef = useRef(0);

    useEffect(() => {
        // Reset if text changes significantly (new message)
        if (!text.startsWith(displayedText) && displayedText !== "") {
            setDisplayedText("");
            indexRef.current = 0;
        }
    }, [text]);

    useEffect(() => {
        if (indexRef.current < text.length) {
            const timeoutId = setTimeout(() => {
                setDisplayedText((prev) => prev + text.charAt(indexRef.current));
                indexRef.current += 1;
            }, 10); // adjustment speed (lower = faster)
            return () => clearTimeout(timeoutId);
        } else {
            onComplete?.();
        }
    }, [displayedText, text, onComplete]);

    return <ReactMarkdown>{displayedText}</ReactMarkdown>;
}

export default function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]); // Scrolls whenever messages or typewriter updates

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage }),
            });

            const data = await response.json();

            if (data.error) {
                setMessages((prev) => [
                    ...prev,
                    { role: "assistant", content: `Error: ${data.error}` },
                ]);
            } else {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        content: data.response,
                        sources: data.sources,
                    },
                ]);
            }
        } catch {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Sorry, something went wrong." },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-transparent overflow-hidden relative">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth pr-2">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400/50">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative p-6 bg-black/40 rounded-full backdrop-blur-sm ring-1 ring-white/10">
                                <svg className="w-12 h-12 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="mt-6 text-lg font-medium text-slate-200">Ready to examine your docs</h3>
                        <p className="text-sm text-slate-500 mt-2 max-w-xs text-center border-t border-white/5 pt-4">Build the retrieval pipeline by uploading a PDF first.</p>
                    </div>
                ) : (
                    messages.map((message, index) => {
                        const isLastMessage = index === messages.length - 1;
                        const isAssistant = message.role === "assistant";

                        return (
                            <div
                                key={index}
                                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-[slideIn_0.3s_ease-out]`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-2xl px-6 py-4 shadow-lg backdrop-blur-md ${message.role === "user"
                                        ? "bg-violet-600/20 border border-violet-500/30 text-white rounded-tr-none"
                                        : "bg-white/5 border border-white/10 text-slate-200 rounded-tl-none"
                                        }`}
                                >
                                    <div className="leading-relaxed prose prose-invert max-w-none prose-p:my-0 prose-ul:my-2 prose-li:my-0 text-sm md:text-base">
                                        {/* Only use Typewriter for the very last message if it's from assistant and not loading */}
                                        {isAssistant && isLastMessage && !isLoading ? (
                                            <Typewriter text={message.content} onComplete={scrollToBottom} />
                                        ) : (
                                            <ReactMarkdown>{message.content}</ReactMarkdown>
                                        )}
                                    </div>

                                    {message.sources && message.sources.length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-white/5 flex flex-col gap-1">
                                            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Sources detected</span>
                                            <p className="text-xs text-violet-300/80 font-mono bg-black/20 p-2 rounded-lg truncate">
                                                {message.sources.join(", ")}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })
                )}
                {isLoading && (
                    <div className="flex justify-start animate-pulse">
                        <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 rounded-tl-none">
                            <div className="flex space-x-2 items-center">
                                <div className="text-xs text-slate-400 mr-2 uppercase tracking-widest font-bold">Thinking</div>
                                <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" />
                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-3 md:p-6 border-t border-white/5 bg-black/20 backdrop-blur-md">
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl blur opacity-20 group-hover:opacity-50 transition duration-500"></div>
                    <div className="relative flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a specific question..."
                            className="flex-1 bg-slate-900/90 text-white rounded-xl px-4 md:px-5 py-3 md:py-4 outline-none placeholder-slate-500 shadow-inner ring-1 ring-white/10 focus:ring-violet-500/50 transition-all text-sm md:text-base"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="shrink-0 bg-gradient-to-br from-violet-600 to-indigo-700 text-white px-4 md:px-6 py-2 rounded-xl font-medium shadow-lg hover:shadow-violet-500/25 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
