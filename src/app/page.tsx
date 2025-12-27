"use client";

import { useState } from "react";
import ChatInterface from "@/components/ChatInterface";
import FileUpload from "@/components/FileUpload";


export default function Home() {
  const [chatKey, setChatKey] = useState(0);

  const handleUploadComplete = () => {
    // Increment key to re-mount ChatInterface, effectively clearing its state
    setChatKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4">

      {/* Aurora Background */}
      <div className="fixed inset-0 w-full h-full">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#030014] to-[#030014] z-0" />
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-16 pt-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 hover:bg-white/10 transition-colors cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-[0.75]"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            <span className="text-xs font-medium text-violet-200 tracking-wider">POWERED BY GEMINI 2.0</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-200 to-indigo-200 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
              DocuChat AI
            </span>
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            Experience the future of document analysis. Upload your PDFs and engage with <span className="text-violet-300">context-aware AI</span> in real-time.
          </p>
        </header>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-[400px_1fr] gap-8 items-start">

          {/* Left Panel */}
          <div className="space-y-6">
            <div className="glass-panel rounded-3xl p-8 hover:border-violet-500/30 transition-colors duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-violet-500/10 text-violet-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Upload Document</h3>
                  <p className="text-xs text-slate-400">PDF files up to 10MB</p>
                </div>
              </div>
              <FileUpload onUploadComplete={handleUploadComplete} />
            </div>

            {/* Stats / Info */}
            <div className="glass-panel rounded-3xl p-8">
              <h3 className="text-sm font-medium text-slate-300 mb-6 uppercase tracking-wider">System Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Model</span>
                  <span className="text-violet-300 font-mono">Gemini Flash</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Vector DB</span>
                  <span className="text-indigo-300 font-mono">Pinecone</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Status</span>
                  <span className="flex items-center gap-2 text-emerald-400 font-mono">
                    <span className="block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Operational
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel (Chat) */}
          <div className="glass-panel rounded-3xl p-1 h-[700px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/5 via-transparent to-indigo-500/5 group-hover:opacity-100 transition-opacity duration-500" />
            <ChatInterface key={chatKey} />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 text-center pb-8 border-t border-white/5 pt-8">
          <p className="text-slate-500 text-sm font-mono">
            ENGINEERED BY <span className="text-violet-400">WAYNE CHIBEU</span> WITH NEXT.JS
          </p>
        </footer>
      </div>
    </div>
  );
}
