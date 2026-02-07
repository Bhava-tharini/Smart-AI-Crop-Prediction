#!/usr/bin/env python3
"""collect_dataset.py

Download plant leaf images for ML datasets using icrawler.

Usage:
  python collect_dataset.py --plant chilli --count 200
  python collect_dataset.py --unknown --count 100

Requirements:
  pip install icrawler pillow imagehash tqdm
"""
from __future__ import annotations

import argparse
import tempfile
import random
from pathlib import Path

from tqdm import tqdm

try:
    from icrawler.builtin import BingImageCrawler
except Exception as e:  # pragma: no cover
    raise RuntimeError("icrawler is required. Install with: pip install icrawler") from e

from PIL import Image, UnidentifiedImageError
import imagehash


MIN_WIDTH = 200
MIN_HEIGHT = 200
FINAL_SIZE = (256, 256)


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Collect plant leaf images for dataset")
    p.add_argument("--plant", type=str, help="Plant name (e.g. chilli)")
    p.add_argument("--count", type=int, default=100, help="Number of images to collect")
    p.add_argument("--unknown", action="store_true", help="Download random leaf images into Unknown folder")
    return p.parse_args()


def safe_dir_name(name: str) -> str:
    return "".join(c for c in name if c.isalnum() or c in (" ", "-", "_")).strip().replace(" ", "_")


def collect_existing_hashes(dest_dir: Path) -> set:
    hashes = set()
    if not dest_dir.exists():
        return hashes
    for p in dest_dir.iterdir():
        if not p.is_file():
            continue
        try:
            with Image.open(p) as img:
                img = img.convert("RGB")
                h = imagehash.phash(img)
                hashes.add(str(h))
        except Exception:
            continue
    return hashes


def next_image_index(dest_dir: Path, plant_tag: str) -> int:
    existing = [p.name for p in dest_dir.glob("*.jpg")]
    if not existing:
        return 1
    # attempt to parse highest numeric suffix
    maxidx = 0
    for name in existing:
        parts = name.rsplit("_", 1)
        if len(parts) == 2 and parts[1].lower().endswith(".jpg"):
            numpart = parts[1][:-4]
            if numpart.isdigit():
                maxidx = max(maxidx, int(numpart))
    return maxidx + 1


def unique_filename(dest_dir: Path, plant_tag: str, idx: int) -> Path:
    while True:
        fname = f"{plant_tag}_{idx:06d}.jpg"
        p = dest_dir / fname
        if not p.exists():
            return p
        idx += 1


def process_and_save(src_path: Path, dest_dir: Path, plant_tag: str, start_idx: int, existing_hashes: set) -> tuple[bool, int]:
    """Open image, validate, dedupe, convert and save as jpg. Returns (saved, next_idx)."""
    try:
        with Image.open(src_path) as img:
            img.load()
            if img.width < MIN_WIDTH or img.height < MIN_HEIGHT:
                return False, start_idx
            img = img.convert("RGB")
            h = str(imagehash.phash(img))
            if h in existing_hashes:
                return False, start_idx
            # resize
            img = img.resize(FINAL_SIZE, Image.LANCZOS)
            out_path = unique_filename(dest_dir, plant_tag, start_idx)
            img.save(out_path, format="JPEG", quality=85)
            existing_hashes.add(h)
            return True, int(out_path.stem.rsplit("_", 1)[1]) + 1
    except (UnidentifiedImageError, OSError):
        return False, start_idx


def main():
    args = parse_args()

    if args.unknown:
        plant_tag = "Unknown"
        keywords = [
            "leaf",
            "tree leaf",
            "plant leaf",
            "foliage",
            "leaf texture",
            "green leaf",
        ]
        search_keyword = random.choice(keywords)
    else:
        if not args.plant:
            raise SystemExit("--plant is required unless --unknown is specified")
        plant_tag = safe_dir_name(args.plant).capitalize()
        search_keyword = f"{args.plant} leaf"

    dest_dir = Path("dataset") / "train" / plant_tag
    dest_dir.mkdir(parents=True, exist_ok=True)

    print(f"Searching for: '{search_keyword}' → saving to {dest_dir}")

    existing_hashes = collect_existing_hashes(dest_dir)
    start_idx = next_image_index(dest_dir, plant_tag)

    # Temporary download area
    with tempfile.TemporaryDirectory(prefix="icrawl_") as tmpdir:
        tmp = Path(tmpdir)
        # request more than needed to allow filtering/dedup; multiplier 3
        max_fetch = max(50, args.count * 3)

        crawler = BingImageCrawler(storage={"root_dir": str(tmp)})
        try:
            crawler.crawl(keyword=search_keyword, max_num=max_fetch)
        except Exception as e:
            print("Crawler error:", e)
            return

        # gather files
        all_files = [p for p in tmp.rglob("*") if p.is_file()]

        saved = 0
        pbar = tqdm(all_files, desc="Processing", unit="img")
        for f in pbar:
            if saved >= args.count:
                break
            ok, start_idx = process_and_save(f, dest_dir, plant_tag, start_idx, existing_hashes)
            if ok:
                saved += 1
                pbar.set_postfix(saved=saved)

    print(f"Done. Saved {saved} new images to {dest_dir}")


if __name__ == "__main__":
    main()
