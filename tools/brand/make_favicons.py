"""Build the square favicons from the wordmark.

Google shows a site's favicon in search results only if it is square (1:1) and at
least 48x48, so the wide wordmark can't be used directly. This centers it on a
square in the logo's own outline purple.

    python3 tools/brand/make_favicons.py
"""
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "public/brand/tadam-logo-v4.png"
OUT = ROOT / "public"
BG = (46, 7, 96, 255)  # the purple of the logo's outline
PAD = 0.06  # side padding, fraction of the square


def icon(size: int, radius: float = 0.0) -> Image.Image:
    logo = Image.open(SRC).convert("RGBA")
    logo = logo.crop(logo.getchannel("A").getbbox())
    # render big, then downscale once for crisp small sizes
    big = 1024
    canvas = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    mask = Image.new("L", (big, big), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, big - 1, big - 1), radius=int(big * radius), fill=255)
    canvas.paste(Image.new("RGBA", (big, big), BG), (0, 0), mask)
    w = int(big * (1 - 2 * PAD))
    h = round(logo.height * w / logo.width)
    logo = logo.resize((w, h), Image.LANCZOS)
    canvas.alpha_composite(logo, ((big - w) // 2, (big - h) // 2))
    return canvas.resize((size, size), Image.LANCZOS)


def main() -> None:
    for size in (48, 96, 192, 512):
        icon(size).save(OUT / f"favicon-{size}.png", optimize=True)
    # iOS rounds the corners itself; keep it full-bleed
    icon(180).convert("RGB").save(OUT / "apple-touch-icon.png", optimize=True)
    icon(48).save(OUT / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])


if __name__ == "__main__":
    main()
