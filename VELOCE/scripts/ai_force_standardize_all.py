import os
import sys
import io
import re
import json
import requests
from PIL import Image
from rembg import remove, new_session

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "products", "standardized")
LOCAL_JSON = os.path.join(os.path.dirname(__file__), "..", "src", "lib", "default-products.json")

os.makedirs(OUTPUT_DIR, exist_ok=True)

print("Initializing AI U2Net Neural Session...")
session = new_session("u2net")

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def download_image(url):
    resp = requests.get(url, headers=headers, timeout=25)
    if resp.status_code == 200:
        return Image.open(io.BytesIO(resp.content)).convert("RGBA")
    raise Exception(f"HTTP status {resp.status_code} for {url}")

def is_model_photo(img, alpha_mask):
    """
    Detect if photo is a human model wearing clothing:
    Narrow, tall portrait with subject extending from top head to bottom legs.
    """
    w, h = img.size
    bbox = alpha_mask.getbbox()
    if not bbox:
        return False
    bw = bbox[2] - bbox[0]
    bh = bbox[3] - bbox[1]
    
    # Only if it's very tall and portrait (human standing from head to waist/knees)
    if bbox[1] < h * 0.04 and bbox[3] > h * 0.96 and (bw / bh) < 0.52:
        return True
    return False

def process_product_image_ai(url, out_path, target_size=800):
    img = download_image(url)
    
    # AI Neural Background Removal
    segmented = remove(session=session, data=img)
    
    bbox = segmented.getbbox()
    if not bbox or (bbox[2] - bbox[0] < 40) or (bbox[3] - bbox[1] < 40):
        cropped = img
    else:
        if is_model_photo(img, segmented):
            cropped = img
        else:
            cropped = segmented.crop(bbox)

    # Scale jersey to FILL 95% of target canvas for BIG, prominent display
    inner_size = int(target_size * 0.95)
    
    # Calculate aspect-ratio preserving resize to fill inner_size
    w, h = cropped.size
    scale = min(inner_size / w, inner_size / h)
    new_w = max(1, int(w * scale))
    new_h = max(1, int(h * scale))
    
    resized = cropped.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # Paste centered on pure transparent 800x800 canvas
    final_canvas = Image.new("RGBA", (target_size, target_size), (0, 0, 0, 0))
    offset_x = (target_size - new_w) // 2
    offset_y = (target_size - new_h) // 2
    
    if resized.mode == 'RGBA':
        final_canvas.paste(resized, (offset_x, offset_y), resized)
    else:
        final_canvas.paste(resized, (offset_x, offset_y))
        
    final_canvas.save(out_path, "WEBP", quality=92)

def main():
    print("Fetching master catalog from Supabase...")
    try:
        supabase_url = "https://gyxjytykxzivbtmymtek.supabase.co/rest/v1/products?select=*"
        supabase_headers = {
            "apikey": "sb_publishable_NQhEUCQp7vP04rcMcO9jTA_Zd0wtfJi",
            "Authorization": "Bearer sb_publishable_NQhEUCQp7vP04rcMcO9jTA_Zd0wtfJi"
        }
        res = requests.get(supabase_url, headers=supabase_headers, timeout=20)
        db_products = res.json()
    except Exception as e:
        print(f"Error fetching Supabase products: {e}")
        db_products = []

    print(f"Total master products from Supabase: {len(db_products)}")

    all_products = []
    for p in (db_products or []):
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
        raw_images = p.get('images')
        if not raw_images or not isinstance(raw_images, list) or len(raw_images) == 0:
            continue

        clean_id = re.sub(r'[^a-zA-Z0-9_-]', '_', p.get('id', f'prod-{i}'))
        new_images = []

        safe_name = p.get('name', clean_id)[:30].encode('ascii', 'replace').decode('ascii')
        sys.stdout.write(f"[{i+1}/{len(all_products)}] Force AI processing {safe_name}... ")
        sys.stdout.flush()

        for img_idx, src_url in enumerate(raw_images):
            if not src_url:
                continue

            out_filename = f"{clean_id}-{img_idx}.webp"
            out_path = os.path.join(OUTPUT_DIR, out_filename)
            public_url = f"/products/standardized/{out_filename}"

            try:
                process_product_image_ai(src_url, out_path, 800)
                new_images.append(public_url)
            except Exception as err:
                new_images.append(src_url)

        if len(new_images) > 0:
            p['images'] = new_images
            print(f"[OK] ({len(new_images)} images AI transparent + big size)")
        else:
            print("[SKIP]")

    with open(LOCAL_JSON, 'w', encoding='utf-8') as f:
        json.dump(all_products, f, indent=2)

    print("\n======================================================")
    print(f"FORCE PROCESSED ALL {len(all_products)} PRODUCTS WITH U2NET AI!")
    print("======================================================\n")

if __name__ == "__main__":
    main()
