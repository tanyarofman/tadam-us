# Cuts the logo out of a solid green (#00FF00) background and exports the PNG + WebP used on the site.
# Source: assets-src/tadam-logo-v4-green.jpg (2000x902, redrawn with Nano Banana Pro by Tanya, 2026-11-17).
# usage: python tools/key-logo.py assets-src/tadam-logo-v4-green.jpg public/brand/tadam-logo-v4.png public/brand/tadam-logo-v4.webp
# Keep the 2000x902 (2.217:1) canvas: LogoAssemble.astro slices the logo by fixed percentages.
import sys
import numpy as np
from PIL import Image

src, out_png, out_webp = sys.argv[1:4]
im = np.asarray(Image.open(src).convert("RGB")).astype(np.float32)
c = 20
bg = np.median(np.concatenate([im[:c, :c], im[:c, -c:], im[-c:, :c], im[-c:, -c:]]).reshape(-1, 3), axis=0)

# alpha from how much greener than red/blue a pixel is
gex = im[..., 1] - np.maximum(im[..., 0], im[..., 2])
bgex = bg[1] - max(bg[0], bg[2])
a = 1 - np.clip((gex - bgex * 0.12) / (bgex * 0.68), 0, 1)

# un-mix the background from edge pixels, then remove leftover green spill
a3 = a[..., None]
col = np.clip((im - (1 - a3) * bg) / np.maximum(a3, 1e-3), 0, 255)
col[..., 1] = np.where(a < 0.999, np.minimum(col[..., 1], np.maximum(col[..., 0], col[..., 2]) + 10), col[..., 1])

# the source has one soft stretch on the left edge of the ט: snap it to white / outline purple
x0, x1, y0, y1 = 1505, 1565, 385, 515
reg = col[y0:y1, x0:x1]
lum = reg.mean(axis=2)
mid = (lum.min() + lum.max()) / 2
t = np.clip((lum - (mid - 12)) / 24, 0, 1)[..., None]
purple = np.median(col[440:460, 1490:1500].reshape(-1, 3), axis=0)
col[y0:y1, x0:x1] = purple * (1 - t) + np.array([253, 253, 253.0]) * t

out = Image.fromarray(np.dstack([col, a * 255]).astype(np.uint8), "RGBA")
out.save(out_png, optimize=True)
out.resize((1472, 664), Image.LANCZOS).save(out_webp, "WEBP", quality=82, method=6)
