"""Entry point for running the fully configured FastAPI application.

The core application lives in ``app.main``.  This module simply re-exports that
application so commands like ``uvicorn main:app`` (or the existing tests that
import ``main.app``) continue to work.
"""

from __future__ import annotations

import os

from dotenv import find_dotenv, load_dotenv
import uvicorn

from app.main import app  # re-export for compatibility

__all__ = ["app"]

# Ensure environment variables are loaded when the module is imported
load_dotenv(find_dotenv(), override=True)


def _get_port() -> int:
    raw_port = os.getenv("BACKEND_PORT", "8000")
    try:
        return int(raw_port)
    except ValueError as exc:  # pragma: no cover - defensive guard
        raise ValueError(
            f"Invalid BACKEND_PORT '{raw_port}' (must be an integer)."
        ) from exc


if __name__ == "__main__":  # pragma: no cover - manual execution path
    uvicorn.run("app.main:app", host="0.0.0.0", port=_get_port(), reload=True)