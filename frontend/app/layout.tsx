import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KidneyAI — Intelligent Medical Assistant",
  description:
    "AI-powered kidney CT scan classifier and medical chatbot by Bilal Madni. Detects cysts, stones, tumors, and normal kidney conditions.",
  keywords: ["kidney", "AI", "CT scan", "medical", "diagnosis", "chatbot"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-dark text-slate-100 antialiased">{children}</body>
    </html>
  );
}
