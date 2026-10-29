"""从用户提供的品牌图片生成透明 Logo 和浏览器图标（需要 Pillow）。"""
import argparse
from pathlib import Path

from PIL import Image


def export(source, brand, output):
    image = Image.open(source).convert("RGB")
    # 中国移动只使用上方图形，排除下方中英文字样。
    if brand == "cmcc":
        image = image.crop((0, 0, image.width, image.height // 2))
    mask = Image.new("L", image.size)
    mask.putdata([255 if min(pixel) < 190 else 0 for pixel in image.getdata()])
    bounds = mask.getbbox()
    if not bounds:
        raise ValueError("图片中未找到品牌图形")
    image = image.crop(bounds).convert("RGBA")
    if brand == "starbucks":
        # 保留圆内白色线条；圆外白底透明，注册商标仍保留。
        from PIL import ImageDraw
        alpha = Image.new("L", image.size)
        draw = ImageDraw.Draw(alpha)
        draw.ellipse((0, 0, image.width - 1, image.width - 1), fill=255)
        for y in range(image.height):
            for x in range(image.width):
                if min(image.getpixel((x, y))[:3]) < 190:
                    alpha.putpixel((x, y), 255)
        image.putalpha(alpha)
    else:
        # 只清除与画布边缘连通的白底，保留图形内部的浅色细节。
        from collections import deque
        queue = deque([(x, y) for x in range(image.width) for y in (0, image.height - 1)] +
                      [(x, y) for y in range(image.height) for x in (0, image.width - 1)])
        seen = set()
        while queue:
            x, y = queue.popleft()
            if (x, y) in seen or not (0 <= x < image.width and 0 <= y < image.height):
                continue
            seen.add((x, y))
            r, g, b, a = image.getpixel((x, y))
            if min(r, g, b) < 220:
                continue
            image.putpixel((x, y), (r, g, b, 0))
            queue.extend(((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)))
    canvas = Image.new("RGBA", (256, 256))
    scale = 240 / max(image.size)
    image = image.resize((round(image.width * scale), round(image.height * scale)), Image.Resampling.LANCZOS)
    canvas.alpha_composite(image, ((256 - image.width) // 2, (256 - image.height) // 2))
    output.mkdir(parents=True, exist_ok=True)
    canvas.save(output / "logo.png", optimize=True)
    canvas.resize((32, 32), Image.Resampling.LANCZOS).save(output / "favicon-32.png", optimize=True)
    touch = Image.new("RGBA", (180, 180), "white")
    touch.alpha_composite(canvas.resize((156, 156), Image.Resampling.LANCZOS), (12, 12))
    touch.convert("RGB").save(output / "apple-touch-icon.png", optimize=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("brand", choices=("cmcc", "starbucks"))
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    export(args.source, args.brand, args.output)
