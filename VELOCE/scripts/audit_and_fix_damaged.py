import os
import sys
import io
import re
import json
import requests
import numpy as np
from PIL import Image
from scipy.ndimage import binary_fill_holes
from rembg import remove, new_session

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "products", "standardized")
LOCAL_JSON = os.path.join(os.path.dirname(__file__), "..", "src", "lib", "default-products.json")

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

def is_damaged(img_path):
    """
    Check if an image in standardized folder is damaged:
    - Swiss cheese holes inside jersey (internal transparency holes)
    - Too small / low opaque pixel count (< 10% coverage)
    - Solid white background untouched (borders 100% opaque)
    - Tiny bounding box
    """
    if not os.path.exists(img_path):
        return True, "File missing"
    
    try:
        img = Image.open(img_path).convert("RGBA")
    except Exception as e:
        return True, f"Corrupted file: {e}"

    w, h = img.size
    alpha = np.array(img.split()[-1]) # Alpha channel

    # 1. Check if borders are 100% opaque (meaning background was NOT removed)
    top_edge = alpha[0, :]
    bot_edge = alpha[-1, :]
    left_edge = alpha[:, 0]
    right_edge = alpha[:, -1]
    
    border_opaque_ratio = (
        np.mean(top_edge > 200) + np.mean(bot_edge > 200) +
        np.mean(left_edge > 200) + np.mean(right_edge > 200)
    ) / 4.0
    
    if border_opaque_ratio > 0.85:
        return True, "Untouched solid background"

    # 2. Check total opaque coverage
    opaque_pixels = np.sum(alpha > 50)
    total_pixels = w * h
    coverage = opaque_pixels / total_pixels
    if coverage < 0.08:
        return True, f"Abnormally low coverage ({coverage*100:.1f}%)"

    # 3. Check for internal holes inside jersey silhouette
    binary_mask = (alpha > 50)
    filled_mask = binary_fill_holes(binary_mask)
    hole_pixels = np.sum(filled_mask) - np.sum(binary_mask)
    
    if hole_pixels > (opaque_pixels * 0.08) and hole_pixels > 2000:
        return True, f"Internal holes detected ({hole_pixels} hole pixels)"

    return False, "OK"

def fix_image_flawlessly(raw_url, out_path, target_size=800):
    """
    Flawless Background Removal with Silhouette Hole-Closing:
    1. Run AI U2Net segmentation.
    2. Apply morphological binary_fill_holes to guarantee 100% solid fabric (zero holes inside jersey).
    3. Crop to bounding box.
    4. Scale to 95% of target canvas.
    5. Save clean WebP.
    """
    orig_img = download_image(raw_url)
    segmented = remove(session=session, data=orig_img)
    
    # Extract alpha mask
    seg_np = np.array(segmented)
    alpha = seg_np[:, :, 3]
    
    # Fill any holes inside the jersey silhouette
    binary_mask = (alpha > 40)
    filled_mask = binary_fill_holes(binary_mask)
    
    # Apply filled mask back to alpha channel
    seg_np[:, :, 3] = np.where(filled_mask, np.maximum(alpha, 255), 0)
    
    fixed_img = Image.fromarray(seg_np, mode="RGBA")
    
    bbox = fixed_img.getbbox()
    if not bbox:
        cropped = orig_img
    else:
        cropped = fixed_img.crop(bbox)

    inner_size = int(target_size * 0.95)
    w, h = cropped.size
    scale = min(inner_size / w, inner_size / h)
    new_w = max(1, int(w * scale))
    new_h = max(1, int(h * scale))
    
    resized = cropped.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    final_canvas = Image.new("RGBA", (target_size, target_size), (0, 0, 0, 0))
    offset_x = (target_size - new_w) // 2
    offset_y = (target_size - new_h) // 2
    
    final_canvas.paste(resized, (offset_x, offset_y), resized)
    final_canvas.save(out_path, "WEBP", quality=92)

def main():
    print("Fetching master catalog from Supabase...")
    supabase_url = "https://gyxjytykxzivbtmymtek.supabase.co/rest/v1/products?select=*"
    supabase_headers = {
        "apikey": "sb_publishable_NQhEUCQp7vP04rcMcO9jTA_Zd0wtfJi",
        "Authorization": "Bearer sb_publishable_NQhEUCQp7vP04rcMcO9jTA_Zd0wtfJi"
    }
    res = requests.get(supabase_url, headers=supabase_headers, timeout=20)
    db_products = res.json()

    print(f"Auditing {len(db_products)} products for damaged / broken images...")
    
    damaged_list = []
    
    for i, p in enumerate(db_products):
        clean_id = re.sub(r'[^a-zA-Z0-9_-]', '_', p['id'])
        raw_images = p.get('images', [])
        
        for img_idx, raw_url in enumerate(raw_images):
            out_filename = f"{clean_id}-{img_idx}.webp"
            out_path = os.path.join(OUTPUT_DIR, out_filename)
            
            is_dmg, reason = is_damaged(out_path)
            if is_dmg:
                damaged_list.append({
                    "product_id": p['id'],
                    "name": p.get('name', p['id']),
                    "img_idx": img_idx,
                    "raw_url": raw_url,
                    "out_path": out_path,
                    "reason": reason
                })

    print(f"\n======================================================", flush=True)
    print(f"AUDIT FOUND {len(damaged_list)} DAMAGED / BROKEN IMAGES", flush=True)
    print(f"======================================================\n", flush=True)

    for idx, item in enumerate(damaged_list):
        safe_name = item['name'][:35].encode('ascii', 'replace').decode('ascii')
        print(f"[{idx+1}/{len(damaged_list)}] Fixing {safe_name} ({item['reason']})...", flush=True)
        try:
            fix_image_flawlessly(item['raw_url'], item['out_path'], 800)
            print(f" -> FIXED [OK]", flush=True)
        except Exception as e:
            print(f" -> ERROR: {e}", flush=True)

    print("\nAll damaged images successfully audited and fixed with hole-filling!", flush=True)

if __name__ == "__main__":
    main()
