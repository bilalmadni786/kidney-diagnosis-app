# KidneyAI — Intelligent Medical Assistant

> Created by **Bilal Madni**  
> Final-year medical AI project — kidney CT scan classifier + multilingual chatbot

---

## What It Does

| Feature | Details |
|---|---|
| CT Scan Analysis | Classifies kidney scans as **Cyst / Normal / Stone / Tumor** |
| Chatbot | Answers general kidney-health questions in 6 languages |
| PDF Support | Extracts first page from a PDF and runs it through the model |
| Multilingual | English, Urdu, Hindi, Arabic, Spanish, French |
| Model | MobileNetV2 fine-tuned — 97.55% validation accuracy |

---

## Quick Start

### 1 — Backend (Python 3.10+)

```bash
cd kidney-diagnosis-app/backend

# Create virtual environment
python -m venv venv

# Activate (Windows PowerShell)
.\venv\Scripts\Activate.ps1
# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at **http://localhost:8000**  
Interactive docs: **http://localhost:8000/docs**

> **PDF support**: install Poppler first  
> Windows: https://github.com/oschwartz10612/poppler-windows/releases — extract and add `bin/` to PATH  
> Mac: `brew install poppler`  
> Linux: `sudo apt-get install poppler-utils`

---

### 2 — Frontend (Node.js 18+)

```bash
cd kidney-diagnosis-app/frontend

npm install
npm run dev
```

Open **http://localhost:3000**

---

### 3 — Add an LLM API Key (optional but recommended)

By default the chatbot returns descriptive mock responses. To enable real AI:

1. Copy the example env file:
   ```bash
   cp backend/.env.example backend/.env
   ```

2. Open `backend/.env` and paste your key:
   ```
   GROQ_API_KEY=your_key_here        # fastest — free tier at console.groq.com
   # or
   OPENAI_API_KEY=your_key_here
   # or
   ANTHROPIC_API_KEY=your_key_here
   ```

3. Open `backend/chatbot_handler.py` and **uncomment the matching provider block** (search for `OPTION A / B / C`).

4. Restart the backend server.

---

## Project Structure

```
kidney-diagnosis-app/
├── backend/
│   ├── main.py                 # FastAPI app + all endpoints
│   ├── model_handler.py        # TensorFlow model loading & inference
│   ├── chatbot_handler.py      # LLM wrapper (mock + 3 real providers)
│   ├── pdf_handler.py          # PDF → image conversion
│   ├── requirements.txt
│   ├── .env.example
│   ├── kidney_classifier_model.keras
│   └── class_info.json
│
└── frontend/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx            # Root page (welcome popup + chat)
    │   └── globals.css
    ├── components/
    │   ├── WelcomePopup.tsx
    │   ├── ChatInterface.tsx
    │   ├── MessageBubble.tsx
    │   ├── ImageUploadZone.tsx
    │   ├── PredictionCard.tsx
    │   ├── TypingIndicator.tsx
    │   └── LanguageSelector.tsx
    ├── lib/
    │   ├── api.ts              # Backend API calls
    │   ├── translations.ts     # All UI strings in 6 languages
    │   └── utils.ts
    └── next.config.js          # Proxies /api/backend/* → localhost:8000
```

---

## API Reference

### `GET /health`
```json
{ "status": "ok", "model_loaded": true }
```

### `POST /predict`
Body: `multipart/form-data` with `file` (image or PDF) and optional `language` (default `en`)
```json
{
  "predicted_class": "Tumor",
  "confidence": 0.94,
  "all_probabilities": { "Cyst": 0.02, "Normal": 0.01, "Stone": 0.03, "Tumor": 0.94 },
  "explanation": "..."
}
```

### `POST /chat`
```json
{ "message": "What is a kidney stone?", "language": "en" }
```
Returns:
```json
{ "response": "..." }
```

---

## Deployment

### Frontend — Vercel
```bash
cd frontend
npx vercel --prod
```
Set env var `NEXT_PUBLIC_BACKEND_URL` if your backend is not at `localhost:8000`.

### Backend — Railway / Render
1. Push the `backend/` folder to a repo.
2. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
3. Add env vars from `.env`.

---

## Disclaimer

> This application is for **educational purposes only**.  
> AI predictions must **not** replace professional medical diagnosis.  
> Always consult a qualified doctor for any medical concerns.

---

*KidneyAI — Created by Bilal Madni*
