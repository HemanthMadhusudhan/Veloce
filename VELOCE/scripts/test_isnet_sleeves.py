import io
import requests
import numpy as np
from PIL import Image
from scipy.ndimage import binary_fill_holes
from rembg import remove, new_session

print("Loading IS-Net (InSPyReNet High Resolution) session...")
session = new_session("isnet-general-use")

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    'Referer': 'https://thejerseynation.in/'
}

test_items = [
    ("AC_Milan_Home_26_27", "https://thejerseynation.in/cdn/shop/files/Maillot-Match-AC-Milan-Domicile-2025-2026-768x768_1800x1800.jpg?v=1751028535"),
    ("Dortmund_Home_24_25", "https://thejerseynation.in/cdn/shop/files/01_20_1800x1800.png?v=1718544713"),
    ("Arsenal_Home_26_27", "https://cdn.media.amplience.net/i/ArsenalDirect/mjz3168_f1?$pdpMainImage$"),
    ("Real_Madrid_Long_Sleeve", "https://thejerseynation.in/cdn/shop/files/1_db222f2f-e8b2-4d2c-80a1-a75d5069cb91_1800x1800.jpg?v=1751028535"),
    ("Puma_RCB_Scarf", "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_1000,h_1000/global/090483/01/fnd/IND/fmt/png/PUMA-x-RCB-2026-Two-Star-Fan-Scarf"),
    ("F1_Max_Verstappen", "https://thejerseynation.in/cdn/shop/files/1_25829633-1ec9-4822-b5e1-cf6214f48ffc_1800x1800.jpg?v=1719575199")
]

for name, url in test_items:
    print(f"Testing IS-Net on {name}...")
    try:
        resp = requests.get(url, headers=headers, timeout=20)
        img = Image.open(io.BytesIO(resp.content)).convert("RGBA")
        
        # Run IS-Net
        segmented = remove(session=session, data=img)
        
        # Hole-filling
        seg_np = np.array(segmented)
        alpha = seg_np[:, :, 3]
        binary_mask = (alpha > 40)
        filled_mask = binary_fill_holes(binary_mask)
        seg_np[:, :, 3] = np.where(filled_mask, np.maximum(alpha, 255), 0)
        
        fixed = Image.fromarray(seg_np, mode="RGBA")
        bbox = fixed.getbbox()
        cropped = fixed.crop(bbox)
        
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
        
        out_path = f"public/test_isnet_{name}.webp"
        final_canvas.save(out_path, "WEBP", quality=95)
        print(f" -> SUCCESS! Cropped dimensions: {cropped.size}, saved to {out_path}")
    except Exception as e:
        print(f" -> ERROR on {name}: {e}")
