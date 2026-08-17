import sys
import io
import requests
from PIL import Image
from rembg import remove, new_session

print("Loading rembg session with u2net / isnet...")
session = new_session("u2net")

# Test on Arsenal Authentic Away Shirt from the screenshot
url = "https://thejerseynation.in/cdn/shop/files/WhatsAppImage2024-06-18at14.24.45_2f37803e_1800x1800.jpg?v=1718702334"

print(f"Downloading {url}...")
resp = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'}, timeout=20)
input_img = Image.open(io.BytesIO(resp.content)).convert("RGBA")

print("Running AI Neural Background Removal...")
output_img = remove(input_img, session=session, alpha_matting=True, alpha_matting_foreground_threshold=240, alpha_matting_background_threshold=10)

# Get bounding box of jersey
bbox = output_img.getbbox()
if bbox:
    cropped = output_img.crop(bbox)
else:
    cropped = output_img

# Standardize to 800x800 square with 88% inner size
target_size = 800
inner_size = int(target_size * 0.88)
cropped.thumbnail((inner_size, inner_size), Image.Resampling.LANCZOS)

final_canvas = Image.new("RGBA", (target_size, target_size), (0, 0, 0, 0))
offset_x = (target_size - cropped.width) // 2
offset_y = (target_size - cropped.height) // 2
final_canvas.paste(cropped, (offset_x, offset_y), cropped)

final_canvas.save("public/test_ai_arsenal.webp", "WEBP", quality=95)
print("SUCCESS! Output saved to public/test_ai_arsenal.webp")
