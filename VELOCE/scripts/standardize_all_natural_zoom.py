import os
import sys
import io
import re
import json
import hashlib
import requests
import numpy as np
from PIL import Image

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "products", "natural")
LOCAL_JSON = os.path.join(os.path.dirname(__file__), "..", "src", "lib", "default-products.json")

os.makedirs(OUTPUT_DIR, exist_ok=True)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
}

def get_safe_id(raw_id):
    clean = re.sub(r'[^a-zA-Z0-9_-]', '_', raw_id)
    if len(clean) > 40:
        h = hashlib.md5(raw_id.encode('utf-8')).hexdigest()[:8]
        clean = f"{clean[:32]}_{h}"
    return clean

def download_image(url):
    resp = requests.get(url, headers=headers, timeout=25)
    if resp.status_code == 200:
        return Image.open(io.BytesIO(resp.content)).convert("RGBA")
    raise Exception(f"HTTP status {resp.status_code} for {url}")

def auto_crop_and_standardize_zoom(img, target_size=800):
    """
    Standardize subject zoom without removing background:
    1. If PNG has alpha transparency, crop to non-transparent bbox.
    2. If RGB image, detect foreground subject vs empty/flat background margins.
    3. Crop to subject bounding box with 3% safe padding.
    4. Fit to target_size x target_size with matching background color.
    """
    w, h = img.size
    alpha = np.array(img.split()[-1])
    has_alpha = np.mean(alpha < 200) > 0.04

    if has_alpha:
        # Native transparent PNG (e.g. F1 shirts, transparent jerseys)
        bbox = img.getbbox()
        if bbox:
            cropped = img.crop(bbox)
        else:
            cropped = img

        cw, ch = cropped.size
        scale = min((target_size * 0.94) / cw, (target_size * 0.94) / ch)
        new_w = max(1, int(cw * scale))
        new_h = max(1, int(ch * scale))
        resized = cropped.resize((new_w, new_h), Image.Resampling.LANCZOS)

        canvas = Image.new("RGBA", (target_size, target_size), (0, 0, 0, 0))
        offset_x = (target_size - new_w) // 2
        offset_y = (target_size - new_h) // 2
        canvas.paste(resized, (offset_x, offset_y), resized)
        return canvas

    # RGB image with background
    rgb_img = img.convert("RGB")
    img_np = np.array(rgb_img, dtype=np.float32)

    # Sample corners to estimate background color
    corners = np.array([
        img_np[:15, :15],
        img_np[:15, -15:],
        img_np[-15:, :15],
        img_np[-15:, -15:]
    ])
    bg_color = np.median(corners.reshape(-1, 3), axis=0)

    # Compute difference from background
    diff = np.linalg.norm(img_np - bg_color, axis=2)
    # Detect subject pixels
    is_subject = (diff > 14) | (img_np.mean(axis=2) < 45)

    y_indices, x_indices = np.where(is_subject)
    if len(y_indices) > 50 and len(x_indices) > 50:
        min_x, max_x = int(np.min(x_indices)), int(np.max(x_indices))
        min_y, max_y = int(np.min(y_indices)), int(np.max(y_indices))

        # Check if subject takes at least 15% of width/height
        if (max_x - min_x) > w * 0.15 and (max_y - min_y) > h * 0.15:
            # 3% safe padding
            pad_x = int((max_x - min_x) * 0.03)
            pad_y = int((max_y - min_y) * 0.03)

            min_x = max(0, min_x - pad_x)
            max_x = min(w, max_x + pad_x)
            min_y = max(0, min_y - pad_y)
            max_y = min(h, max_y + pad_y)

            cropped = rgb_img.crop((min_x, min_y, max_x, max_y))
        else:
            cropped = rgb_img
    else:
        cropped = rgb_img

    cw, ch = cropped.size
    scale = min((target_size * 0.96) / cw, (target_size * 0.96) / ch)
    new_w = max(1, int(cw * scale))
    new_h = max(1, int(ch * scale))
    resized = cropped.resize((new_w, new_h), Image.Resampling.LANCZOS)

    bg_tuple = tuple(int(round(c)) for c in bg_color)
    canvas = Image.new("RGB", (target_size, target_size), bg_tuple)
    offset_x = (target_size - new_w) // 2
    offset_y = (target_size - new_h) // 2
    canvas.paste(resized, (offset_x, offset_y))
    return canvas

def main():
    print("Fetching master catalog from Supabase...", flush=True)
    supabase_url = "https://gyxjytykxzivbtmymtek.supabase.co/rest/v1/products?select=*"
    supabase_headers = {
        "apikey": "sb_publishable_NQhEUCQp7vP04rcMcO9jTA_Zd0wtfJi",
        "Authorization": "Bearer sb_publishable_NQhEUCQp7vP04rcMcO9jTA_Zd0wtfJi"
    }
    res = requests.get(supabase_url, headers=supabase_headers, timeout=20)
    db_products = res.json()

    print(f"Total master products: {len(db_products)}", flush=True)

    all_products = []
    for p in db_products:
        all_products.append({
            "id": p['id'],
            "created_at": p.get('created_at'),
            "name": p.get('name'),
            "category": p.get('category'),
            "series": p.get('series'),
            "zone": p.get('zone'),
            "team": p.get('team'),
            "driver": p.get('driver'),
            "tag": p.get('tag'),
            "price": float(p.get('price', 0)),
            "compare_at": float(p['compare_at']) if p.get('compare_at') else None,
            "badge": p.get('badge'),
            "colors": p.get('colors') or ["Default"],
            "sizes": p.get('sizes') or ["S", "M", "L", "XL"],
            "images": p.get('images') or [],
            "description": p.get('description'),
            "material": p.get('material') or "Premium cotton",
            "rating": float(p.get('rating', 4.8)),
            "reviews": int(p.get('reviews', 20)),
            "stock": int(p.get('stock', 10)),
            "has_video": p.get('has_video', False),
            "has_360": p.get('has_360', False),
            "stock_by_size": p.get('stock_by_size') or {"S": 2, "M": 3, "L": 3, "XL": 2}
        })

    for i, p in enumerate(all_products):
        raw_images = p.get('images', [])
        if not raw_images or not isinstance(raw_images, list) or len(raw_images) == 0:
            continue

        safe_id = get_safe_id(p['id'])
        new_images = []

        safe_name = p.get('name', safe_id)[:32].encode('ascii', 'replace').decode('ascii')
        sys.stdout.write(f"[{i+1}/{len(all_products)}] Standardizing zoom for {safe_name}... ")
        sys.stdout.flush()

        for img_idx, raw_url in enumerate(raw_images):
            if not raw_url:
                continue

            out_filename = f"{safe_id}-{img_idx}.webp"
            out_path = os.path.join(OUTPUT_DIR, out_filename)
            public_url = f"/products/natural/{out_filename}"

            try:
                raw_img = download_image(raw_url)
                standardized = auto_crop_and_standardize_zoom(raw_img, 800)
                standardized.save(out_path, "WEBP", quality=92)
                new_images.append(public_url)
            except Exception as err:
                new_images.append(raw_url)

        if len(new_images) > 0:
            p['images'] = new_images
            print(f"[OK] ({len(new_images)} standardized)", flush=True)
        else:
            print("[SKIP]", flush=True)

    with open(LOCAL_JSON, 'w', encoding='utf-8') as f:
        json.dump(all_products, f, indent=2)

    print("\n======================================================", flush=True)
    print(f"ALL {len(all_products)} PRODUCTS UNIFORMLY ZOOMED AND STANDARDIZED WITH NATURAL BACKGROUNDS!", flush=True)
    print("======================================================\n", flush=True)

if __name__ == "__main__":
    main()
