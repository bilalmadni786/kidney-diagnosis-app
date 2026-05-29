"""KidneyAI — FastAPI backend"""

from __future__ import annotations

import traceback
from contextlib import asynccontextmanager

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import model_handler
import chatbot_handler
from pdf_handler import pdf_to_image_bytes

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/webp"}
ALLOWED_PDF_TYPE = "application/pdf"
MAX_FILE_SIZE_MB = 20


# ---------------------------------------------------------------------------
# Lifespan: pre-load the model so first request is fast
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[Startup] Loading TensorFlow model…")
    try:
        model_handler.load_model()
        print("[Startup] Model ready.")
    except Exception as exc:
        print(f"[Startup] WARNING — model failed to load: {exc}")
    yield


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------

app = FastAPI(
    title="KidneyAI API",
    description="Kidney CT scan classifier + medical chatbot by Bilal Madni",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------

class ChatRequest(BaseModel):
    message: str
    language: str = "en"


class ChatResponse(BaseModel):
    response: str


class PredictResponse(BaseModel):
    predicted_class: str
    confidence: float
    all_probabilities: dict[str, float]
    explanation: str


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/health", response_model=HealthResponse, tags=["System"])
async def health():
    return {"status": "ok", "model_loaded": model_handler.is_model_loaded()}


@app.post("/predict", response_model=PredictResponse, tags=["Prediction"])
async def predict(
    file: UploadFile = File(...),
    language: str = Form(default="en"),
):
    # --- size guard ---
    contents = await file.read()
    size_mb = len(contents) / (1024 * 1024)
    if size_mb > MAX_FILE_SIZE_MB:
        raise HTTPException(
            status_code=413,
            detail=f"File too large ({size_mb:.1f} MB). Max allowed: {MAX_FILE_SIZE_MB} MB.",
        )

    # --- type handling ---
    content_type = (file.content_type or "").lower()

    if content_type == ALLOWED_PDF_TYPE or (file.filename or "").lower().endswith(".pdf"):
        try:
            image_bytes = pdf_to_image_bytes(contents)
        except Exception as exc:
            raise HTTPException(status_code=422, detail=f"Could not process PDF: {exc}")
    elif content_type in ALLOWED_IMAGE_TYPES or any(
        (file.filename or "").lower().endswith(ext) for ext in (".jpg", ".jpeg", ".png", ".webp")
    ):
        image_bytes = contents
    else:
        raise HTTPException(
            status_code=422,
            detail="Please upload a valid CT scan image (JPG, PNG) or PDF.",
        )

    # --- prediction ---
    try:
        result = model_handler.predict(image_bytes)
    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Analysis failed. Please try another image.")

    # --- LLM explanation ---
    explanation = chatbot_handler.call_llm(
        message="Please explain this finding and what the patient should do next.",
        language=language,
        context={
            "prediction": result["predicted_class"],
            "confidence": result["confidence"],
        },
    )

    return PredictResponse(
        predicted_class=result["predicted_class"],
        confidence=result["confidence"],
        all_probabilities=result["all_probabilities"],
        explanation=explanation,
    )


@app.post("/chat", response_model=ChatResponse, tags=["Chat"])
async def chat(body: ChatRequest):
    if not body.message.strip():
        raise HTTPException(status_code=422, detail="Message cannot be empty.")

    response = chatbot_handler.call_llm(
        message=body.message.strip(),
        language=body.language,
    )
    return {"response": response}
