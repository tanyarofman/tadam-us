# Cleans the logo cutout: removes the white fringe from background removal,
# smooths the jagged edge and exports a 2x PNG + WebP.
# usage: python tools/clean-logo.py assets-src/tadam-logo-original.png public/brand/tadam-logo-v2.png public/brand/tadam-logo-v2.webp  (needs pillow + numpy)

import sys
from PIL import Image, ImageFilter
import numpy as np
src, out_png, out_webp = sys.argv[1:4]
im = np.array(Image.open(src).convert("RGBA")).astype(np.float32)
rgb, a = im[..., :3], im[..., 3] > 127
H, W = a.shape

def dilate(m, r=1):
    o = m.copy()
    for dy in range(-r, r + 1):
        for dx in range(-r, r + 1):
            o |= np.roll(np.roll(m, dy, 0), dx, 1)
    return o

# 1. fringe = opaque pixels within 3px of transparency that are whitish/greyish (low saturation, bright)
near = a & dilate(~a, 3)
mx, mn = rgb.max(-1), rgb.min(-1)
whitish = (mn > 110) & ((mx - mn) < 60)
fringe = near & whitish
# 2. inpaint fringe from good neighbours (grow inward colours outward)
good = a & ~fringe
col = rgb.copy()
for _ in range(6):
    todo = fringe & ~good
    if not todo.any():
        break
    acc = np.zeros_like(col); cnt = np.zeros((H, W, 1), np.float32)
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            g = np.roll(np.roll(good, dy, 0), dx, 1)[..., None]
            acc += np.roll(np.roll(col, dy, 0), dx, 1) * g
            cnt += g
    fill = todo & (cnt[..., 0] > 0)
    col[fill] = acc[fill] / cnt[fill]
    good = good | fill
# 3. shave 1px off the outer edge (removes leftover stair-step noise)
alpha = a & ~dilate(~a, 1)
# morphological opening: remove thin slivers/bridges left by the background removal
eroded = alpha & ~dilate(~alpha, 2)
alpha = alpha & dilate(eroded, 2)
# extend colours into transparent area so resampling doesn't pull in black/white
for _ in range(4):
    acc = np.zeros_like(col); cnt = np.zeros((H, W, 1), np.float32)
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            g = np.roll(np.roll(good, dy, 0), dx, 1)[..., None]
            acc += np.roll(np.roll(col, dy, 0), dx, 1) * g
            cnt += g
    fill = ~good & (cnt[..., 0] > 0)
    col[fill] = acc[fill] / cnt[fill]
    good = good | fill
# 4. upscale 2x, smooth anti-aliased alpha
S = 2
rgb_img = Image.fromarray(np.clip(col, 0, 255).astype(np.uint8)).resize((W * S, H * S), Image.LANCZOS)
rgb_img = rgb_img.filter(ImageFilter.UnsharpMask(radius=1.6, percent=60, threshold=2))
al = Image.fromarray((alpha * 255).astype(np.uint8)).resize((W * S, H * S), Image.BICUBIC).filter(ImageFilter.GaussianBlur(1.1))
al = np.array(al).astype(np.float32)
al = np.clip((al - 128) * 2.2 + 128, 0, 255).astype(np.uint8)  # crisp but smooth edge
out = rgb_img.convert("RGBA"); out.putalpha(Image.fromarray(al))
out.save(out_png, optimize=True)
out.save(out_webp, "WEBP", quality=90, method=6)
print("fringe px", int(fringe.sum()), "size", out.size)
