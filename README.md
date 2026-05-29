# kidney-diagnosis-app
AI-powered medical assistant that classifies kidney CT scan images into four categories — Normal, Cyst, Stone, and Tumor — using a fine-tuned MobileNetV2 model (97.55% validation accuracy). Includes a multilingual chatbot interface for medical Q&amp;A. Built with TensorFlow, FastAPI, and Next.js.
# KidneyAI — Intelligent Kidney Disease Detection System

An AI-powered medical assistant that classifies kidney CT scan images into four diagnostic categories using deep learning, paired with a multilingual conversational chatbot interface for medical Q&A.

**Developed by Bilal Madni** as a final-year academic project demonstrating end-to-end machine learning, full-stack development, and modern AI deployment practices.

---

## Overview

KidneyAI combines a fine-tuned convolutional neural network with a conversational AI interface to provide preliminary analysis of kidney CT scan images. Users can upload medical images (JPG, PNG, or PDF) and receive predictions across four categories — Normal, Cyst, Stone, or Tumor — along with confidence scores and AI-generated explanations.

The system also functions as a general medical assistant capable of answering health-related questions in multiple languages, making it accessible to a diverse user base.

> **Disclaimer:** This project is built strictly for educational and research purposes. It is not a substitute for professional medical diagnosis. All medical decisions should be made in consultation with qualified healthcare professionals.

---

## Key Features

- **High-Accuracy Image Classification** — Fine-tuned MobileNetV2 achieving 97.55% validation accuracy across four kidney conditions
- **Multi-Format Input Support** — Accepts JPG, PNG, and PDF medical reports
- **Conversational AI Interface** — Natural language chat with medical context awareness
- **Multilingual Support** — English, Urdu, Hindi, Arabic, Spanish, and French
- **Professional Medical UI** — Glassmorphic design with smooth animations, built for trust and clarity
- **Production-Ready Architecture** — Separation of concerns between model serving, business logic, and frontend
- **Real-Time Predictions** — Backend serves predictions in under 500ms per image

---

## Technical Architecture

### Machine Learning Pipeline

The core classification model was developed using a two-phase transfer learning approach:

**Phase 1: Feature Extraction**
- Base model: MobileNetV2 pretrained on ImageNet
- Convolutional base frozen, custom classification head trained
- Achieved 81.96% validation accuracy as baseline

**Phase 2: Fine-Tuning**
- Last 30 layers of MobileNetV2 unfrozen
- Learning rate reduced by 10x (0.0001) to preserve pretrained features
- Final validation accuracy improved to 97.55%

**Dataset**
- CT Kidney Dataset (Normal, Cyst, Tumor, Stone) — 12,446 images
- Train/Validation split: 80/20 with stratified sampling
- Data augmentation applied: random flip, rotation, zoom, contrast adjustment

**Performance Metrics**
- Overall Accuracy: 97.55%
- Weighted F1-Score: 0.9753
- Per-class precision range: 95.47% to 100%
- Per-class recall range: 91.41% to 100%

### Backend (Python / FastAPI)

The backend serves the trained model through a REST API and handles all medical inference logic.

**Stack**
- FastAPI for the web framework
- TensorFlow 2.20 for model inference
- Pillow for image preprocessing
- pdf2image for PDF document handling
- Python-multipart for file uploads

**API Endpoints**
- `POST /predict` — Accepts image or PDF, returns classification with confidence scores
- `POST /chat` — Handles general medical conversations through LLM integration
- `GET /health` — Service health check including model load status

### Frontend (Next.js / TypeScript)

The frontend is a modern single-page application designed for a polished medical product experience.

**Stack**
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for utility-first styling
- Framer Motion for animations
- shadcn/ui for accessible component primitives
- Lucide React for iconography

**Design Principles**
- Glassmorphism and subtle gradients for a clinical aesthetic
- Smooth, purposeful animations (no gimmicks)
- Accessible color contrast and typography
- Responsive layout suitable for desktop and tablet use

---

## Project Structure

```
kidney-diagnosis-app/
├── backend/
│   ├── main.py                       # FastAPI application entry
│   ├── model_handler.py              # Model loading and inference logic
│   ├── chatbot_handler.py            # LLM integration layer
│   ├── pdf_handler.py                # PDF to image conversion
│   ├── kidney_classifier_model.keras # Trained model (97.55% accuracy)
│   ├── class_info.json               # Model metadata and class labels
│   └── requirements.txt
│
├── frontend/
│   ├── app/                          # Next.js pages and layouts
│   ├── components/                   # React components
│   │   ├── WelcomePopup.tsx
│   │   ├── ChatInterface.tsx
│   │   ├── PredictionCard.tsx
│   │   └── ImageUploadZone.tsx
│   ├── lib/                          # API clients and utilities
│   └── package.json
│
└── README.md
```

---

## Installation and Setup

### Prerequisites

- Python 3.12 or higher
- Node.js 20 LTS or higher
- Poppler (for PDF processing on Windows: install via the official Poppler Windows release)

### Backend Setup

```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\Activate.ps1

# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The backend will be available at `http://localhost:8000`. Verify with `http://localhost:8000/health`.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`.

### LLM Integration (Optional)

For full chatbot functionality, add an API key from any supported LLM provider:

1. Copy `backend/.env.example` to `backend/.env`
2. Add your API key (Groq, OpenAI, or Anthropic)
3. Uncomment the matching provider block in `backend/chatbot_handler.py`

Without an API key, the chatbot operates in mock mode for development and testing.

---

## Methodology and Design Decisions

### Why MobileNetV2?

Among the candidate pretrained models (VGG16, ResNet50, MobileNetV2), MobileNetV2 was selected for its balance of accuracy and efficiency. At 14 MB, it is significantly lighter than VGG16 (528 MB) and ResNet50 (98 MB), enabling faster training, lower memory requirements, and the possibility of mobile deployment in future iterations — without sacrificing accuracy on the medical classification task.

### Why Two-Phase Training?

A single training pass with all layers unfrozen risks destroying the valuable ImageNet pretrained weights. The two-phase approach — feature extraction first, then careful fine-tuning with a reduced learning rate — is a documented best practice that produced a 16% accuracy improvement (81.96% to 97.55%) in this project.

### Why Address Class Imbalance Through Augmentation?

The dataset exhibited natural imbalance (Normal: 5077, Stone: 1377, a 3.7x ratio). Rather than oversampling synthetically or undersampling and losing information, data augmentation was used to effectively expand the minority class representations through realistic variations — rotation, flipping, zoom, and contrast — that mirror real-world imaging variability.

### Frontend Framework Choice

Streamlit was considered for rapid prototyping but rejected for the final application. The medical AI use case demanded a polished, production-grade interface with custom animations, multi-step workflows, and a trustworthy visual identity. Next.js with Tailwind and Framer Motion provided the flexibility needed to deliver this experience.

---

## Known Limitations

- **Tumor Recall (91.41%)** — The model misses approximately 8.6% of actual tumor cases. In medical contexts, false negatives carry serious implications. This is documented as a key limitation and an area for future improvement through threshold tuning and cost-sensitive learning.
- **Single Modality** — The current model only accepts CT scans. Future versions could incorporate ultrasound and MRI inputs.
- **English-Trained Model** — While the chat interface is multilingual, the underlying classification model was trained on a single dataset and does not vary by language.
- **No Real Clinical Validation** — The system has not undergone the regulatory validation required for actual clinical use.

---

## Future Work

- Incorporate Grad-CAM visualizations to provide explainability for each prediction
- Expand to multi-modality input (ultrasound, MRI)
- Implement uncertainty quantification to flag low-confidence predictions for human review
- Conduct prospective validation studies with medical professionals
- Add support for DICOM medical image format
- Deploy backend on cloud infrastructure with autoscaling

---

## Technology Stack Summary

| Layer | Technology |
|-------|-----------|
| Model Training | TensorFlow, Keras, Google Colab (T4 GPU) |
| Model Architecture | MobileNetV2 (transfer learning) |
| Backend Framework | FastAPI |
| Frontend Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS, shadcn/ui |
| Animations | Framer Motion |
| Language (Backend) | Python 3.12 |
| Language (Frontend) | TypeScript |
| Image Processing | Pillow, OpenCV, pdf2image |

---

## Acknowledgments

- Dataset: CT Kidney Dataset (Normal, Cyst, Tumor, Stone) by Nazmul Islam on Kaggle
- Pretrained Model: MobileNetV2 by Google Research, trained on ImageNet
- This project was developed as part of a final-year academic program covering Data Science and Artificial Intelligence coursework

---

## License

This project is released for educational purposes. The trained model and code are available under the MIT License. The CT Kidney Dataset is subject to its original licensing terms on Kaggle.

---

## Contact

**Bilal Madni**
Final-Year Project — Data Science and Artificial Intelligence

For questions, collaboration, or feedback, please open an issue on this repository.
