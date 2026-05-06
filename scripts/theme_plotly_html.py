"""Extract Plotly figure data from notebook-exported HTML and emit theme-neutral JSON.

Reads each input HTML from `frontend/public/`, pulls the `data` and `layout`
JSON arguments out of the embedded `Plotly.newPlot(...)` call, strips
theme-specific styling (fonts, axis colors, templates) so the React layer
can apply light or dark theming at render time, and writes the result to
`frontend/public/plots/<name>.json`.

Usage:
    python scripts/theme_plotly_html.py

No external dependencies (stdlib only).
"""

from __future__ import annotations

import json
import re
from pathlib import Path

PUBLIC = Path(__file__).resolve().parent.parent / "frontend" / "public"
PLOTS_OUT = PUBLIC / "plots"

TARGETS = [
    {"file": "encoding_plot.html", "show_legend": False, "keep_title": False},
    {"file": "retrieval_visualization.html", "show_legend": True, "keep_title": False},
]


def split_top_level_args(text: str, paren_open: int) -> list[tuple[int, int]]:
    """Walk a JS argument list starting at `(`, returning (start, end) slices
    for each top-level argument. Comma-separated, bracket/string aware."""
    assert text[paren_open] == "("
    args: list[tuple[int, int]] = []
    depth = 0
    in_str = False
    esc = False
    i = paren_open + 1
    arg_start = i
    while i < len(text):
        c = text[i]
        if in_str:
            if esc:
                esc = False
            elif c == "\\":
                esc = True
            elif c == '"':
                in_str = False
        else:
            if c == '"':
                in_str = True
            elif c in "([{":
                depth += 1
            elif c in ")]}":
                if depth == 0:
                    args.append((arg_start, i))
                    return args
                depth -= 1
            elif c == "," and depth == 0:
                args.append((arg_start, i))
                arg_start = i + 1
        i += 1
    raise ValueError("unterminated argument list")


def extract_data_layout(html: str) -> tuple[list, dict]:
    m = re.search(r"Plotly\.newPlot\s*\(", html)
    if not m:
        raise ValueError("no Plotly.newPlot(...) call found")
    paren = m.end() - 1
    args = split_top_level_args(html, paren)
    if len(args) < 3:
        raise ValueError(f"expected at least 3 args to Plotly.newPlot, got {len(args)}")
    data_raw = html[args[1][0]:args[1][1]].strip()
    layout_raw = html[args[2][0]:args[2][1]].strip()
    return json.loads(data_raw), json.loads(layout_raw)


def normalize_layout(layout: dict, *, show_legend: bool, keep_title: bool) -> dict:
    """Strip theme styling and lock down sizing so the React layer owns the look."""
    layout["margin"] = {"l": 0, "r": 0, "t": 10, "b": 0}
    layout["autosize"] = True
    layout["showlegend"] = show_legend
    layout.pop("width", None)
    layout.pop("height", None)
    layout.pop("paper_bgcolor", None)
    layout.pop("plot_bgcolor", None)
    layout.pop("font", None)
    layout.pop("template", None)
    if not keep_title:
        layout.pop("title", None)

    scene = layout.get("scene") or {}
    for axis_key in ("xaxis", "yaxis", "zaxis"):
        ax = scene.get(axis_key) or {}
        for color_key in ("backgroundcolor", "gridcolor", "linecolor", "zerolinecolor", "color"):
            ax.pop(color_key, None)
        scene[axis_key] = ax
    if scene:
        layout["scene"] = scene

    return layout


def rewrite(target: dict) -> None:
    src = PUBLIC / target["file"]
    html = src.read_text()
    data, layout = extract_data_layout(html)
    layout = normalize_layout(
        layout,
        show_legend=target["show_legend"],
        keep_title=target["keep_title"],
    )
    PLOTS_OUT.mkdir(parents=True, exist_ok=True)
    out_path = PLOTS_OUT / (Path(target["file"]).stem + ".json")
    out_path.write_text(json.dumps({"data": data, "layout": layout}, separators=(",", ":")))
    print(f"wrote {out_path.relative_to(PUBLIC.parent.parent)} ({out_path.stat().st_size:,} bytes)")


def main() -> None:
    for target in TARGETS:
        rewrite(target)


if __name__ == "__main__":
    main()
