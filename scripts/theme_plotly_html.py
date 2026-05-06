"""Re-theme Plotly-exported HTML files for embedding on the dark site.

Reads each input HTML, extracts the `data` and `layout` JSON arguments from
the embedded `Plotly.newPlot(...)` call, applies a dark/transparent theme,
and overwrites the file with a minimal responsive shell.

Usage:
    python scripts/theme_plotly_html.py

No external dependencies (stdlib only).
"""

from __future__ import annotations

import json
import re
from pathlib import Path

PUBLIC = Path(__file__).resolve().parent.parent / "frontend" / "public"

TARGETS = [
    {"file": "encoding_plot.html", "show_legend": False, "keep_title": False},
    {"file": "retrieval_visualization.html", "show_legend": True, "keep_title": False},
]

DARK_AXIS = {
    "backgroundcolor": "rgba(0,0,0,0)",
    "gridcolor": "rgba(255,255,255,0.12)",
    "linecolor": "rgba(255,255,255,0.25)",
    "zerolinecolor": "rgba(255,255,255,0.25)",
    "showbackground": False,
}
FONT_COLOR = "#d6d3d1"

SITE_BG_DARK = "#1c1917"

HTML_SHELL = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="color-scheme" content="dark" />
<style>
html,body{{margin:0;padding:0;height:100%;width:100%;overflow:hidden;background:{bg};}}
#plot{{height:100vh;width:100vw;}}
.plotly,.plotly .main-svg{{background:transparent!important;}}
</style>
<script src="https://cdn.plot.ly/plotly-3.3.0.min.js" charset="utf-8"></script>
</head>
<body>
<div id="plot"></div>
<script>
Plotly.newPlot("plot", {data}, {layout}, {{responsive: true, displaylogo: false}});
window.addEventListener('resize', () => Plotly.Plots.resize('plot'));
</script>
</body>
</html>
"""


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


def apply_dark_theme(layout: dict, *, show_legend: bool, keep_title: bool) -> dict:
    layout["paper_bgcolor"] = "rgba(0,0,0,0)"
    layout["plot_bgcolor"] = "rgba(0,0,0,0)"
    layout["font"] = {**layout.get("font", {}), "color": FONT_COLOR}
    layout["margin"] = {"l": 0, "r": 0, "t": 10, "b": 0}
    layout["autosize"] = True
    layout["showlegend"] = show_legend
    layout.pop("width", None)
    layout.pop("height", None)
    if not keep_title:
        layout.pop("title", None)

    scene = layout.get("scene") or {}
    for axis_key in ("xaxis", "yaxis", "zaxis"):
        ax = scene.get(axis_key) or {}
        ax.update(DARK_AXIS)
        scene[axis_key] = ax
    layout["scene"] = scene

    # Plotly's default white template bleeds through scene defaults; override it.
    template = layout.get("template") or {}
    tlayout = template.get("layout") or {}
    tlayout["paper_bgcolor"] = "rgba(0,0,0,0)"
    tlayout["plot_bgcolor"] = "rgba(0,0,0,0)"
    tlayout["font"] = {**tlayout.get("font", {}), "color": FONT_COLOR}
    tscene = tlayout.get("scene") or {}
    for axis_key in ("xaxis", "yaxis", "zaxis"):
        ax = tscene.get(axis_key) or {}
        ax.update(DARK_AXIS)
        tscene[axis_key] = ax
    tlayout["scene"] = tscene
    template["layout"] = tlayout
    layout["template"] = template
    return layout


def rewrite(target: dict) -> None:
    path = PUBLIC / target["file"]
    html = path.read_text()
    data, layout = extract_data_layout(html)
    layout = apply_dark_theme(
        layout,
        show_legend=target["show_legend"],
        keep_title=target["keep_title"],
    )
    out = HTML_SHELL.format(
        bg=SITE_BG_DARK,
        data=json.dumps(data, separators=(",", ":")),
        layout=json.dumps(layout, separators=(",", ":")),
    )
    path.write_text(out)
    print(f"rewrote {path.relative_to(PUBLIC.parent.parent)} ({len(out):,} bytes)")


def main() -> None:
    for target in TARGETS:
        rewrite(target)


if __name__ == "__main__":
    main()
