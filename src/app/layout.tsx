import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://docuchat-ultra.vercel.app"),
  title: "DocuChat AI | Chat with your PDFs",
  description: "Upload PDFs and chat with them using AI. Powered by Google Gemini and semantic search.",
  keywords: ["AI", "PDF", "RAG", "Gemini", "Chat", "Documents"],
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "DocuChat AI | Chat with your PDFs",
    description: "Upload PDFs and chat with them using AI. Powered by Google Gemini and semantic search.",
    type: "website",
    images: ["/icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
