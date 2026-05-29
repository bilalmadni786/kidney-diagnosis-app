"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type KeyboardEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Paperclip, Activity, Settings } from "lucide-react";
import { t, type LanguageCode } from "@/lib/translations";
import { predictImage, sendChat } from "@/lib/api";
import MessageBubble, { type Message } from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import ImageUploadZone from "./ImageUploadZone";
import LanguageSelector from "./LanguageSelector";
import ScannerModal from "./ScannerModal";
import HeartbeatLine from "./HeartbeatLine";

let msgIdCounter = 0;
function genId() {
  return `msg-${++msgIdCounter}`;
}

interface ChatInterfaceProps {
  language: LanguageCode;
  onLanguageChange: (l: LanguageCode) => void;
}

export default function ChatInterface({
  language,
  onLanguageChange,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [error, setError] = useState<string>("");
  const [scanningFile, setScanningFile] = useState<{ url: string; name: string } | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastMsgRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Smart scroll: prediction cards → scroll to TOP of card; text → scroll to bottom
  useEffect(() => {
    if (isThinking) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (!messages.length) return;
    const last = messages[messages.length - 1];
    if (last.role === "assistant" && last.prediction) {
      const timer = setTimeout(() => {
        lastMsgRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
      return () => clearTimeout(timer);
    }
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // Initial greeting
  useEffect(() => {
    const greeting: Message = {
      id: genId(),
      role: "assistant",
      content:
        "Hello! I'm **KidneyAI**, your intelligent medical assistant created by **Bilal Madni**.\n\nYou can:\n- Ask me any question about kidney health\n- Upload a CT scan image or PDF for AI-powered analysis\n\n> ⚠️ I'm for educational use only — always consult a qualified doctor.",
      timestamp: new Date(),
    };
    setMessages([greeting]);
  }, []);

  const addMessage = useCallback((msg: Message) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  async function handleSend() {
    const text = input.trim();
    if (!text || isThinking) return;
    setInput("");
    setError("");

    addMessage({
      id: genId(),
      role: "user",
      content: text,
      timestamp: new Date(),
    });

    setIsThinking(true);
    try {
      const data = await sendChat(text, language);
      addMessage({
        id: genId(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("errorNetwork", language);
      setError(msg);
    } finally {
      setIsThinking(false);
    }
  }

  async function handleFileSelect(file: File) {
    setShowUpload(false);
    setError("");

    const imageUrl =
      file.type !== "application/pdf" ? URL.createObjectURL(file) : "";

    // Show scanner modal for image files
    if (imageUrl) {
      setScanningFile({ url: imageUrl, name: file.name });
    }

    addMessage({
      id: genId(),
      role: "user",
      content: `📎 Uploaded: **${file.name}** — analyzing scan…`,
      timestamp: new Date(),
    });

    setIsThinking(true);
    try {
      const result = await predictImage(file, language);
      setScanningFile(null);
      addMessage({
        id: genId(),
        role: "assistant",
        content: "",
        prediction: result,
        imageUrl,
        timestamp: new Date(),
      });
    } catch (err: unknown) {
      setScanningFile(null);
      const msg = err instanceof Error ? err.message : t("errorAnalysis", language);
      setError(msg);
      addMessage({
        id: genId(),
        role: "assistant",
        content: `⚠️ ${msg}`,
        timestamp: new Date(),
      });
    } finally {
      setIsThinking(false);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const hasInput = input.trim().length > 0;

  return (
    <>
    {/* Scanner popup — always mounted so exit animation plays */}
    <ScannerModal
      open={!!scanningFile}
      imageUrl={scanningFile?.url ?? ""}
      fileName={scanningFile?.name ?? ""}
      language={language}
    />

    <div className="flex h-screen flex-col bg-animated">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-white/10 px-4 py-3 backdrop-blur-sm"
        style={{ background: "rgba(15,23,42,0.8)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{
              background: "linear-gradient(135deg, rgba(220,38,38,0.3), rgba(14,165,233,0.25))",
              border: "1px solid rgba(220,38,38,0.4)",
              boxShadow: "0 0 16px rgba(220,38,38,0.25)",
            }}
          >
            <Activity className="h-5 w-5 text-red-400" aria-hidden />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-bold gradient-text leading-none">KidneyAI</h1>
              {/* Live pulse indicator */}
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-600" />
              </span>
            </div>
            <p className="text-[10px] text-slate-500 leading-none mt-0.5">by Bilal Madni</p>
          </div>
        </div>

        {/* ECG heartbeat — center of header */}
        <div className="flex-1 px-3 sm:px-6 min-w-0">
          <HeartbeatLine className="h-6 sm:h-7 w-full" />
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <LanguageSelector value={language} onChange={onLanguageChange} />
          <button
            className="rounded-lg p-2 text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-1 min-h-0">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <div key={msg.id} ref={i === messages.length - 1 ? lastMsgRef : null}>
              <MessageBubble message={msg} language={language} />
            </div>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {isThinking && <TypingIndicator language={language} />}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Upload zone */}
      <AnimatePresence>
        {showUpload && (
          <div className="px-4 pb-2">
            <ImageUploadZone
              onFileSelect={handleFileSelect}
              onClose={() => setShowUpload(false)}
              language={language}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Error toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="mx-4 mb-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input area */}
      <div
        className="border-t border-white/10 px-4 py-3 backdrop-blur-sm"
        style={{ background: "rgba(15,23,42,0.8)" }}
      >
        <div
          className="flex items-end gap-2 rounded-2xl px-3 py-2"
          style={{
            background: "rgba(30,41,59,0.7)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {/* Upload button */}
          <motion.button
            onClick={() => setShowUpload((v) => !v)}
            className={`mb-1 rounded-lg p-1.5 transition-colors ${
              showUpload
                ? "text-cyan-400 bg-cyan-400/15"
                : "text-slate-500 hover:text-cyan-400 hover:bg-white/10"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={t("uploadFile", language)}
            title={t("uploadFile", language)}
          >
            <Paperclip className="h-4 w-4" />
          </motion.button>

          {/* Text area */}
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("typeMessage", language)}
            rows={1}
            disabled={isThinking}
            className="flex-1 resize-none bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none leading-relaxed disabled:opacity-50"
            style={{ maxHeight: "120px" }}
            aria-label="Message input"
          />

          {/* Send button */}
          <motion.button
            onClick={handleSend}
            disabled={!hasInput || isThinking}
            className={`mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${
              hasInput && !isThinking
                ? "text-white btn-glow"
                : "text-slate-600 cursor-not-allowed"
            }`}
            style={
              hasInput && !isThinking
                ? {
                    background: "linear-gradient(135deg, #0EA5E9 0%, #14B8A6 100%)",
                  }
                : { background: "rgba(255,255,255,0.05)" }
            }
            whileHover={hasInput && !isThinking ? { scale: 1.05 } : {}}
            whileTap={hasInput && !isThinking ? { scale: 0.95 } : {}}
            aria-label={t("send", language)}
          >
            <Send className="h-3.5 w-3.5" />
          </motion.button>
        </div>

        {/* Footer */}
        <p className="mt-2 text-center text-[10px] text-slate-600">
          KidneyAI by Bilal Madni · Educational use only · Not a substitute for medical advice
        </p>
      </div>
    </div>
    </>
  );
}
