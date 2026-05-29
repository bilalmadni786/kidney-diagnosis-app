"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, X, FileImage } from "lucide-react";
import { t, type LanguageCode } from "@/lib/translations";

interface ImageUploadZoneProps {
  onFileSelect: (file: File) => void;
  onClose: () => void;
  language: LanguageCode;
}

const ACCEPTED_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "application/pdf": [".pdf"],
};

export default function ImageUploadZone({
  onFileSelect,
  onClose,
  language,
}: ImageUploadZoneProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");

  const onDrop = useCallback(
    (accepted: File[], rejected: { errors: { message: string }[] }[]) => {
      setError("");
      if (rejected.length) {
        setError(t("errorInvalidFile", language));
        return;
      }
      if (!accepted.length) return;
      const file = accepted[0];
      setSelectedFile(file);

      if (file.type === "application/pdf") {
        setPreview(null);
      } else {
        const url = URL.createObjectURL(file);
        setPreview(url);
      }
    },
    [language]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024,
  });

  function handleAnalyze() {
    if (selectedFile) onFileSelect(selectedFile);
  }

  function handleClear() {
    setSelectedFile(null);
    setPreview(null);
    setError("");
  }

  return (
    <motion.div
      className="glass-card p-4 space-y-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-300">
          {t("uploadFile", language)}
        </span>
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close upload zone"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Drop zone */}
      {!selectedFile && (
        <div
          {...getRootProps()}
          className="flex flex-col items-center justify-center rounded-xl p-4 sm:p-8 cursor-pointer transition-colors"
          style={{
            border: isDragActive
              ? "2px solid rgba(14,165,233,0.8)"
              : "2px dashed rgba(14,165,233,0.3)",
            background: isDragActive
              ? "rgba(14,165,233,0.08)"
              : "rgba(255,255,255,0.02)",
          }}
        >
          <input {...getInputProps()} aria-label="File upload" />
          <UploadCloud
            className={`mb-3 h-10 w-10 transition-colors ${
              isDragActive ? "text-cyan-400" : "text-slate-500"
            }`}
            aria-hidden
          />
          <p className="text-sm font-medium text-slate-300">
            {t("dropzoneText", language)}
          </p>
          <p className="mt-1 text-xs text-slate-500">{t("dropzoneHint", language)}</p>
        </div>
      )}

      {/* Preview */}
      <AnimatePresence>
        {selectedFile && (
          <motion.div
            className="relative rounded-xl overflow-hidden border border-white/10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt="CT scan preview"
                className="w-full max-h-52 object-contain bg-black"
              />
            ) : (
              <div className="flex h-24 items-center justify-center gap-3 bg-slate-800/50">
                <FileImage className="h-8 w-8 text-cyan-400" aria-hidden />
                <div>
                  <p className="text-sm font-medium text-white">{selectedFile.name}</p>
                  <p className="text-xs text-slate-400">
                    PDF — first page will be used
                  </p>
                </div>
              </div>
            )}
            <button
              onClick={handleClear}
              className="absolute top-2 right-2 rounded-lg bg-dark/80 p-1.5 text-slate-400 hover:text-white transition-colors"
              aria-label="Remove selected file"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      {/* Analyze button */}
      {selectedFile && (
        <motion.button
          onClick={handleAnalyze}
          className="w-full rounded-xl py-2.5 text-sm font-semibold text-white btn-glow-red btn-3d"
          style={{
            background: "linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)",
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {t("analyzeImage", language)}
        </motion.button>
      )}
    </motion.div>
  );
}
