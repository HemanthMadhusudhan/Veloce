import io
import requests
import numpy as np
from PIL import Image

headers = {'User-Agent': 'Mozilla/5.0'}

url = "https://cdn.media.amplience.net/i/ArsenalDirect/mjz3161_f1?$pdpMainZoomImage$"
resp = requests.get(url, headers=headers)
img = Image.open(io.BytesIO(resp.content)).convert("RGB")
print("Original size:", img.size)

# Auto-crop outer uniform borders / black frames
img_np = np.array(img)
# Detect borders (pixels that are uniform background or black border)
# Find variance / gradient to find the inner jersey box
# Or detect the bounding box of non-background content
gray = img.convert("L")
gray_np = np.array(gray)

# The image has a black outer border or white outer border
# Let's inspect edges
print("Top-left pixel RGB:", img_np[0, 0])
print("Center pixel RGB:", img_np[img.height//2, img.width//2])

# Save original
img.save("public/test_arsenal_orig.jpg")
