import io
import os
import requests
import numpy as np
from PIL import Image
from scipy.ndimage import binary_fill_holes
from rembg import remove, new_session

print("Loading IS-Net (InSPyReNet High Resolution) session...")
session = new_session("isnet-general-use")

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
}

test_items = [
    ("Dortmund_Home", "https://thejerseynation.in/cdn/shop/files/01_10_1800x1800.png?v=1718544874"),
    ("Milan_Away", "https://thejerseynation.in/cdn/shop/files/Maillot-Match-Milan-AC-Exterieur-2024-2025-768x768_1800x1800.jpg?v=1724154075"),
    ("F1_Carlos_Sainz", "https://www.pitstopstudio.in/cdn/shop/files/6.png?v=1753952889&width=600"),
    ("F1_Mercedes_Silverstone", "https://www.pitstopstudio.in/cdn/shop/files/MercSilverstoneFront.png?v=1783613738&width=600"),
    ("Puma_RCB_Scarf", "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_1000,h_1000/global/090483/01/fnd/IND/fmt/png/PUMA-x-RCB-2026-Two-Star-Fan-Scarf")
]

for name, url in test_items:
    print(f"Processing {name}...")
    try:
        resp = requests.get(url, headers=headers, timeout=20)
        img = Image.open(io.BytesIO(resp.content)).convert("RGBA")
        
        # Check if already transparent PNG
        alpha = np.array(img.split()[-1])
        has_transparency = np.mean(alpha < 50) > 0.05
        
        if has_transparency:
            print(f" -> {name} already has transparent background! Preserving pristine original alpha.")
            segmented = img
        else:
            print(f" -> Running IS-Net background removal with sleeve preservation...")
            segmented = remove(session=session, data=img)
            
            # Hole-filling protection
            seg_np = np.array(segmented)
            seg_alpha = seg_np[:, :, 3]
            binary_mask = (seg_alpha > 30)
            filled_mask = binary_fill_holes(binary_mask)
            seg_np[:, :, 3] = np.where(filled_mask, np.maximum(seg_alpha, 255), 0)
            segmented = Image.fromarray(seg_np, mode="RGBA")

        bbox = segmented.getbbox()
        cropped = segmented.crop(bbox)
        
        target_size = 800
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
        
        out_path = f"public/test_perfect_{name}.webp"
        final_canvas.save(out_path, "WEBP", quality=95)
        print(f" -> SUCCESS! Cropped dimensions: {cropped.size}, saved to {out_path}")
    except Exception as e:
        print(f" -> ERROR on {name}: {e}")
