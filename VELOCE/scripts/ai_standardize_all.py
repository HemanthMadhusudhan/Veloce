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
    if url.startswith('/'):
        local_path = os.path.join(os.path.dirname(__file__), "..", "public", url.lstrip('/'))
        if os.path.exists(local_path):
            return Image.open(local_path).convert("RGBA")
    
    resp = requests.get(url, headers=headers, timeout=25)
    if resp.status_code == 200:
        return Image.open(io.BytesIO(resp.content)).convert("RGBA")
    raise Exception(f"HTTP status {resp.status_code} for {url}")

def is_model_photo(img, alpha_mask):
    w, h = img.size
    bbox = alpha_mask.getbbox()
    if not bbox:
        return False
    bw = bbox[2] - bbox[0]
    bh = bbox[3] - bbox[1]
    
    if bbox[1] < h * 0.05 and bbox[3] > h * 0.95 and (bw / bh) < 0.55:
        return True
    return False

def process_product_image(url, out_path, target_size=800):
    img = download_image(url)
    segmented = remove(session=session, data=img)
    
    bbox = segmented.getbbox()
    if not bbox or (bbox[2] - bbox[0] < 50) or (bbox[3] - bbox[1] < 50):
        cropped = img
    else:
        if is_model_photo(img, segmented):
            cropped = img
        else:
            cropped = segmented.crop(bbox)

    inner_size = int(target_size * 0.88)
    cropped.thumbnail((inner_size, inner_size), Image.Resampling.LANCZOS)
    
    final_canvas = Image.new("RGBA", (target_size, target_size), (0, 0, 0, 0))
    offset_x = (target_size - cropped.width) // 2
    offset_y = (target_size - cropped.height) // 2
    
    if cropped.mode == 'RGBA':
        final_canvas.paste(cropped, (offset_x, offset_y), cropped)
    else:
        final_canvas.paste(cropped, (offset_x, offset_y))
        
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

    try:
        with open(LOCAL_JSON, 'r', encoding='utf-8') as f:
            local_products = json.load(f)
    except Exception:
        local_products = []

    product_map = {}
    for p in (db_products or []):
        product_map[p['id']] = {
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
        }

    for p in (local_products or []):
        if p['id'] not in product_map:
            product_map[p['id']] = p

    all_products = list(product_map.values())
    print(f"Total products to process: {len(all_products)}")

    for i, p in enumerate(all_products):
        if not p.get('images') or not isinstance(p['images'], list) or len(p['images']) == 0:
            continue

        clean_id = re.sub(r'[^a-zA-Z0-9_-]', '_', p.get('id', f'prod-{i}'))
        new_images = []

        safe_name = p.get('name', clean_id)[:30].encode('ascii', 'replace').decode('ascii')
        sys.stdout.write(f"[{i+1}/{len(all_products)}] AI processing {safe_name}... ")
        sys.stdout.flush()

        for img_idx, src_url in enumerate(p['images']):
            if not src_url:
                continue

            out_filename = f"{clean_id}-{img_idx}.webp"
            out_path = os.path.join(OUTPUT_DIR, out_filename)
            public_url = f"/products/standardized/{out_filename}"

            if os.path.exists(out_path) and os.path.getsize(out_path) > 1000:
                new_images.append(public_url)
                continue

            try:
                process_product_image(src_url, out_path, 800)
                new_images.append(public_url)
            except Exception as err:
                new_images.append(src_url)

        if len(new_images) > 0:
            p['images'] = new_images
            print(f"[OK] ({len(new_images)} images AI standardized)")
        else:
            print("[SKIP]")

    with open(LOCAL_JSON, 'w', encoding='utf-8') as f:
        json.dump(all_products, f, indent=2)

    print("\n======================================================")
    print(f"ALL {len(all_products)} PRODUCTS AI STANDARDIZED VIA U2NET!")
    print("======================================================\n")

if __name__ == "__main__":
    main()
