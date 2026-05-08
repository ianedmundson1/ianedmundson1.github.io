"""Render static WebP posters from the themed-neutral Plotly JSON figures.

`PlotlyEmbed` shows these as a lightweight placeholder on touch devices and
during the lazy bundle/JSON load, so the page paints something meaningful
without booting WebGL or downloading ~1 MB of Plotly.

Reads `frontend/public/plots/<name>.json`, applies styling that mirrors
`THEME_TOKENS` in `PlotlyEmbed.tsx`, renders a PNG via Kaleido, and re-encodes
it to WebP (quality 80, method 6). WebP at this quality is roughly 4-6x
smaller than the source PNG with no visible loss at poster scale.

Usage:
    pip install plotly kaleido pillow
    plotly_get_chrome  # one-time, downloads bundled Chrome for Kaleido
    python scripts/export_plot_posters.py
"""

from __future__ import annotations

import io
import json
from pathlib import Path

import plotly.graph_objects as go
from PIL import Image

PLOTS_DIR = Path(__file__).resolve().parent.parent / "frontend" / "public" / "plots"

TARGETS = ["encoding_plot", "retrieval_visualization"]

# Mirrors THEME_TOKENS in frontend/src/components/PlotlyEmbed/PlotlyEmbed.tsx,
# plus a paper background sampled from the site's dark/light surface tokens.
THEMES = {
    "light": {
        "font_color": "#1c1917",
        "grid": "rgba(28, 25, 23, 0.18)",
        "line": "rgba(28, 25, 23, 0.45)",
        "paper_bg": "#fafaf9",
    },
    "dark": {
        "font_color": "#d6d3d1",
        "grid": "rgba(255, 255, 255, 0.12)",
        "line": "rgba(255, 255, 255, 0.25)",
        "paper_bg": "#0c0a09",
    },
}


def themed_layout(layout: dict, theme: dict) -> dict:
    layout = dict(layout)
    axis_overrides = {
        "backgroundcolor": "rgba(0,0,0,0)",
        "gridcolor": theme["grid"],
        "linecolor": theme["line"],
        "zerolinecolor": theme["line"],
        "color": theme["font_color"],
        "showbackground": False,
    }
    layout["paper_bgcolor"] = theme["paper_bg"]
    layout["plot_bgcolor"] = theme["paper_bg"]
    layout["font"] = {**(layout.get("font") or {}), "color": theme["font_color"]}
    scene = dict(layout.get("scene") or {})
    for axis_key in ("xaxis", "yaxis", "zaxis"):
        ax = dict(scene.get(axis_key) or {})
        ax.update(axis_overrides)
        scene[axis_key] = ax
    layout["scene"] = scene
    return layout


def render(name: str, theme_name: str, theme: dict) -> None:
    src = PLOTS_DIR / f"{name}.json"
    out = PLOTS_DIR / f"{name}-{theme_name}.webp"
    payload = json.loads(src.read_text())
    fig = go.Figure(data=payload["data"], layout=themed_layout(payload["layout"], theme))
    png_bytes = fig.to_image(format="png", width=1200, height=720, scale=2)
    with Image.open(io.BytesIO(png_bytes)) as img:
        img.save(out, format="WEBP", quality=80, method=6)
    print(f"wrote {out.relative_to(PLOTS_DIR.parent.parent)} ({out.stat().st_size:,} bytes)")


def main() -> None:
    for name in TARGETS:
        for theme_name, theme in THEMES.items():
            render(name, theme_name, theme)


if __name__ == "__main__":
    main()
