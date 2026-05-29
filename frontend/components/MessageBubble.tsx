"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Activity, User } from "lucide-react";
import { t, type LanguageCode } from "@/lib/translations";
import PredictionCard from "./PredictionCard";
import type { PredictResponse } from "@/lib/api";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  prediction?: PredictResponse;
  imageUrl?: string;
  timestamp: Date;
};

interface MessageBubbleProps {
  message: Message;
  language: LanguageCode;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

export default function MessageBubble({ message, language }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      className={`flex items-end gap-3 px-4 py-1 ${isUser ? "flex-row-reverse" : "flex-row"}`}
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
    >
      {/* Avatar */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
          isUser
            ? "bg-gradient-to-br from-cyan-500 to-teal-500 text-white"
            : ""
        }`}
        style={
          !isUser
            ? {
                background:
                  "linear-gradient(135deg, rgba(14,165,233,0.25), rgba(20,184,166,0.25))",
                border: "1px solid rgba(14,165,233,0.3)",
              }
            : {}
        }
        aria-hidden
      >
        {isUser ? (
          <User className="h-4 w-4" aria-hidden />
        ) : (
          <Activity className="h-4 w-4 text-cyan-400" aria-hidden />
        )}
      </div>

      {/* Content */}
      <div className={`flex flex-col gap-2 ${isUser ? "items-end max-w-[80%]" : "items-start w-[92%] sm:max-w-[80%]"}`}>
        {/* Text bubble */}
        {message.content && (
          <div
            className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              isUser
                ? "rounded-br-sm text-white"
                : "glass-card rounded-bl-sm text-slate-200"
            }`}
            style={
              isUser
                ? {
                    background: "linear-gradient(135deg, #0EA5E9 0%, #14B8A6 100%)",
                  }
                : {}
            }
          >
            {isUser ? (
              <p>{message.content}</p>
            ) : (
              <div className="message-prose">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            )}
          </div>
        )}

        {/* Prediction card (AI only) */}
        {!isUser && message.prediction && message.imageUrl && (
          <div className="w-full">
            <PredictionCard
              result={message.prediction}
              imageUrl={message.imageUrl}
              language={language}
            />
          </div>
        )}

        {/* Timestamp */}
        <span className="px-1 text-[10px] text-slate-600">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </motion.div>
  );
}
