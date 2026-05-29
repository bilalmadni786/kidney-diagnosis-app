export interface PredictResponse {
  predicted_class: string;
  confidence: number;
  all_probabilities: Record<string, number>;
  explanation: string;
}

export interface ChatResponse {
  response: string;
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
}

const BASE = "/api/backend";

export async function checkHealth(): Promise<HealthResponse> {
  const res = await fetch(`${BASE}/health`);
  if (!res.ok) throw new Error("Server unreachable");
  return res.json();
}

export async function predictImage(
  file: File,
  language: string
): Promise<PredictResponse> {
  const form = new FormData();
  form.append("file", file);
  form.append("language", language);

  const res = await fetch(`${BASE}/predict`, { method: "POST", body: form });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? "Analysis failed. Please try another image.");
  }
  return res.json();
}

export async function sendChat(
  message: string,
  language: string
): Promise<ChatResponse> {
  const res = await fetch(`${BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, language }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? "Cannot connect to AI server. Please try again.");
  }
  return res.json();
}
