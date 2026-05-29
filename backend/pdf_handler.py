"""
PDF → image conversion using pdf2image + poppler.

Poppler must be installed:
  Windows: https://github.com/oschwartz10612/poppler-windows/releases
           Extract and add the bin/ folder to PATH.
  Linux:   sudo apt-get install poppler-utils
  macOS:   brew install poppler
"""

import io
from PIL import Image


def pdf_to_image_bytes(pdf_bytes: bytes) -> bytes:
    """Convert the first page of a PDF to JPEG bytes."""
    try:
        from pdf2image import convert_from_bytes
    except ImportError:
        raise RuntimeError("pdf2image is not installed. Run: pip install pdf2image")

    pages = convert_from_bytes(pdf_bytes, first_page=1, last_page=1, dpi=200)
    if not pages:
        raise ValueError("Could not extract any pages from the PDF.")

    first_page: Image.Image = pages[0].convert("RGB")
    buf = io.BytesIO()
    first_page.save(buf, format="JPEG", quality=95)
    return buf.getvalue()
