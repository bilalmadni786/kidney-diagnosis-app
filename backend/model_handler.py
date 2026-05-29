import json
import numpy as np
from pathlib import Path
from PIL import Image
import io

# Lazy-load TensorFlow to avoid slow import on startup
_model = None
_class_info = None

MODEL_PATH = Path(__file__).parent / "kidney_classifier_model.keras"
CLASS_INFO_PATH = Path(__file__).parent / "class_info.json"


def _load_class_info() -> dict:
    global _class_info
    if _class_info is None:
        with open(CLASS_INFO_PATH) as f:
            _class_info = json.load(f)
    return _class_info


def load_model():
    global _model
    if _model is None:
        import tensorflow as tf
        _model = tf.keras.models.load_model(str(MODEL_PATH))
        print(f"[ModelHandler] Loaded model from {MODEL_PATH}")
        print(f"[ModelHandler] Total layers: {len(_model.layers)}")
        for i, layer in enumerate(_model.layers[:5]):
            print(f"[ModelHandler] Layer {i}: {layer.name} | type: {type(layer).__name__} | config: {layer.get_config().get('scale', layer.get_config().get('mean', ''))}")
    return _model


def is_model_loaded() -> bool:
    return _model is not None


def preprocess_image(image_bytes: bytes) -> np.ndarray:
    info = _load_class_info()
    img_size = tuple(info["img_size"])  # (224, 224)

    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize(img_size, Image.LANCZOS)
    # Model has internal Rescaling(1/255) in data_augmentation layer — pass raw [0-255]
    arr = np.array(img, dtype=np.float32)
    return np.expand_dims(arr, axis=0)  # (1, 224, 224, 3)


def predict(image_bytes: bytes) -> dict:
    model = load_model()
    info = _load_class_info()
    class_names: list[str] = info["class_names"]

    tensor = preprocess_image(image_bytes)
    probs = model.predict(tensor, verbose=0)[0]  # shape (4,)

    print(f"[ModelHandler] Raw probs: { {c: round(float(p),4) for c,p in zip(class_names, probs)} }")

    predicted_idx = int(np.argmax(probs))
    predicted_class = class_names[predicted_idx]
    confidence = float(probs[predicted_idx])

    all_probs = {cls: float(p) for cls, p in zip(class_names, probs)}

    return {
        "predicted_class": predicted_class,
        "confidence": confidence,
        "all_probabilities": all_probs,
    }
