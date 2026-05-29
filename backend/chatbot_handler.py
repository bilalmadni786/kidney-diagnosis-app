"""
Chatbot handler — wraps LLM calls.

To enable real responses:
1. Choose your LLM provider (Groq / OpenAI / Claude).
2. Set the API key in the .env file (see .env.example).
3. Uncomment the relevant block below marked with TODO.
"""

import os
from dotenv import load_dotenv

load_dotenv()

# ---------------------------------------------------------------------------
# TODO: ADD API KEY HERE
# Create a file called .env in the backend/ folder and add one of:
#   GROQ_API_KEY=your_key_here
#   OPENAI_API_KEY=your_key_here
#   ANTHROPIC_API_KEY=your_key_here
# ---------------------------------------------------------------------------

SYSTEM_PROMPT_TEMPLATE = """You are KidneyAI, an intelligent medical assistant created by Bilal Madni.
You specialize in kidney health and CT scan analysis, but you can also answer general medical questions.
Always be accurate, empathetic, and remind users that your responses are educational only.
Respond in {language}."""

CONDITION_DESCRIPTIONS = {
    "Cyst": (
        "A kidney cyst is a fluid-filled sac that forms on or in the kidneys. "
        "Most simple kidney cysts are benign and rarely cause serious problems. "
        "They may cause discomfort if they grow large. Regular monitoring is recommended."
    ),
    "Normal": (
        "The scan appears normal with no detectable abnormalities. "
        "The kidney structure looks healthy. Continue regular check-ups as advised by your doctor."
    ),
    "Stone": (
        "Kidney stones are hard mineral deposits that form inside the kidneys. "
        "They can cause severe pain, nausea, and blood in urine. "
        "Treatment depends on stone size — small stones often pass naturally, "
        "while larger stones may require medical intervention."
    ),
    "Tumor": (
        "The scan suggests the presence of a renal mass that may indicate a tumor. "
        "This requires immediate attention from a qualified urologist or oncologist. "
        "Early detection significantly improves treatment outcomes. "
        "Please consult a doctor as soon as possible."
    ),
}

LANGUAGE_NAMES = {
    "en": "English",
    "ur": "Urdu",
    "hi": "Hindi",
    "ar": "Arabic",
    "es": "Spanish",
    "fr": "French",
    "zh": "Chinese (Simplified)",
}


def call_llm(message: str, language: str = "en", context: dict | None = None) -> str:
    """
    Main LLM entry point.

    Args:
        message:  User's text message.
        language: BCP-47 language code (en, ur, hi, ar, es, fr).
        context:  Optional dict with prediction data when an image was analysed.
                  Expected shape: {"prediction": str, "confidence": float}

    Returns:
        LLM response string.

    -----------------------------------------------------------------------
    To wire up a real provider, replace the _mock_response() call below
    with one of the commented provider blocks.
    -----------------------------------------------------------------------
    """

    # ------------------------------------------------------------------
    # OPTION A — Groq (fast, free tier available)
    # pip install groq
    # ------------------------------------------------------------------
    from groq import Groq
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    lang_name = LANGUAGE_NAMES.get(language, "English")
    system = SYSTEM_PROMPT_TEMPLATE.format(language=lang_name)
    user_msg = _build_user_message(message, context)
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "system", "content": system},
                  {"role": "user",   "content": user_msg}],
        temperature=0.7,
    )
    return completion.choices[0].message.content

    # ------------------------------------------------------------------
    # OPTION B — OpenAI
    # pip install openai
    # ------------------------------------------------------------------
    # from openai import OpenAI
    # client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))  # TODO: ADD API KEY HERE
    # lang_name = LANGUAGE_NAMES.get(language, "English")
    # system = SYSTEM_PROMPT_TEMPLATE.format(language=lang_name)
    # user_msg = _build_user_message(message, context)
    # resp = client.chat.completions.create(
    #     model="gpt-4o-mini",
    #     messages=[{"role": "system", "content": system},
    #               {"role": "user",   "content": user_msg}],
    # )
    # return resp.choices[0].message.content

    # ------------------------------------------------------------------
    # OPTION C — Anthropic Claude
    # pip install anthropic
    # ------------------------------------------------------------------
    # import anthropic
    # client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))  # TODO: ADD API KEY HERE
    # lang_name = LANGUAGE_NAMES.get(language, "English")
    # system = SYSTEM_PROMPT_TEMPLATE.format(language=lang_name)
    # user_msg = _build_user_message(message, context)
    # msg = client.messages.create(
    #     model="claude-sonnet-4-6",
    #     max_tokens=1024,
    #     system=system,
    #     messages=[{"role": "user", "content": user_msg}],
    # )
    # return msg.content[0].text

    # ------------------------------------------------------------------
    # MOCK — disabled (Groq is active)
    # ------------------------------------------------------------------
    # return _mock_response(message, language, context)


def _build_user_message(message: str, context: dict | None) -> str:
    if context and "prediction" in context:
        pct = round(context["confidence"] * 100, 1)
        return (
            f"A kidney CT scan was analysed. Result: {context['prediction']} "
            f"({pct}% confidence). {message}"
        )
    return message


def _mock_response(message: str, language: str, context: dict | None) -> str:
    """Deterministic mock — replace entirely once a real LLM is wired in."""
    lang_name = LANGUAGE_NAMES.get(language, "English")

    if context and "prediction" in context:
        pred = context["prediction"]
        pct = round(context["confidence"] * 100, 1)
        desc = CONDITION_DESCRIPTIONS.get(pred, "")
        return (
            f"**Analysis Result: {pred}** ({pct}% confidence)\n\n"
            f"{desc}\n\n"
            f"*Note: This is a mock response in {lang_name}. "
            f"Connect an LLM API key in backend/.env for real explanations.*\n\n"
            f"> ⚠️ This AI prediction is for educational purposes only. "
            f"Please consult a qualified medical professional for diagnosis."
        )

    return (
        f"Hello! I'm **KidneyAI**, your intelligent medical assistant created by Bilal Madni. "
        f"I can help you understand kidney health, interpret CT scan results, and answer general medical questions.\n\n"
        f"You asked: *\"{message}\"*\n\n"
        f"*This is a mock response in {lang_name}. "
        f"To enable real AI responses, add your LLM API key to `backend/.env`.*\n\n"
        f"> ⚠️ Educational purposes only — not a substitute for professional medical advice."
    )


def get_condition_description(condition: str) -> str:
    return CONDITION_DESCRIPTIONS.get(condition, "")
