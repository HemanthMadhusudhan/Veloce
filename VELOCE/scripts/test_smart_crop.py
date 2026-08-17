import io
import requests
import numpy as np
from PIL import Image

headers = {'User-Agent': 'Mozilla/5.0'}

url = "https://cdn.media.amplience.net/i/ArsenalDirect/mjz3161_f1?$pdpMainZoomImage$"
resp = requests.get(url, headers=headers)
img = Image.open(io.BytesIO(resp.content)).convert("RGB")

# Detect subject bounding box by finding color deviation from the 4 outer corner background pixels
img_np = np.array(img, dtype=np.float32)
h, w, _ = img_np.shape

# Corner samples for background estimation
corners = np.array([
    img_np[:20, :20],
    img_np[:20, -20:],
    img_np[-20:, :20],
    img_np[-20:, -20:]
])
bg_color = np.median(corners.reshape(-1, 3), axis=0)

# Calculate color distance from background
diff = np.linalg.norm(img_np - bg_color, axis=2)
# Also detect dark borders / black boxes
is_foreground = (diff > 18) | (img_np.mean(axis=2) < 40)

# Find bounding box of foreground
y_indices, x_indices = np.where(is_foreground)
if len(y_indices) > 0 and len(x_indices) > 0:
    min_x, max_x = np.min(x_indices), np.max(x_indices)
    min_y, max_y = np.min(y_indices), np.max(y_indices)
    
    # Add 4% padding
    pad_x = int((max_x - min_x) * 0.04)
    pad_y = int((max_y - min_y) * 0.04)
    
    min_x = max(0, min_x - pad_x)
    max_x = min(w, max_x + pad_x)
    min_y = max(0, min_y - pad_y)
    max_y = min(h, max_y + pad_y)
    
    cropped = img.crop((min_x, min_y, max_x, max_y))
    print(f"Cropped from {img.size} to {cropped.size}")
    
    # Fit into 800x800 square with background fill
    target_size = 800
    cw, ch = cropped.size
    scale = min(target_size / cw, target_size / ch)
    new_w = max(1, int(cw * scale))
    new_h = max(1, int(ch * scale))
    
    resized = cropped.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # Create canvas filled with background color
    bg_tuple = tuple(int(c) for c in bg_color)
    final_canvas = Image.new("RGB", (target_size, target_size), bg_tuple)
    offset_x = (target_size - new_w) // 2
    offset_y = (target_size - new_h) // 2
    final_canvas.paste(resized, (offset_x, offset_y))
    
    final_canvas.save("public/test_arsenal_perfect_zoom.jpg", "JPEG", quality=95)
    print("Saved public/test_arsenal_perfect_zoom.jpg successfully!")
