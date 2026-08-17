import requests
import io
from PIL import Image
from rembg import remove, new_session

session = new_session("u2net")
url = "https://cdn.media.amplience.net/i/ArsenalDirect/mjz3161_f1?$pdpMainZoomImage$"

print("Downloading from Arsenal Direct...")
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
resp = requests.get(url, headers=headers, timeout=20)
print(f"Status code: {resp.status_code}, length: {len(resp.content)}")

input_img = Image.open(io.BytesIO(resp.content)).convert("RGBA")
print("Removing background with AI u2net...")
output_img = remove(input_img, session=session)

bbox = output_img.getbbox()
print(f"Bounding box: {bbox}")
if bbox:
    cropped = output_img.crop(bbox)
else:
    cropped = output_img

target_size = 800
inner_size = int(target_size * 0.88)
cropped.thumbnail((inner_size, inner_size), Image.Resampling.LANCZOS)

final_canvas = Image.new("RGBA", (target_size, target_size), (0, 0, 0, 0))
offset_x = (target_size - cropped.width) // 2
offset_y = (target_size - cropped.height) // 2
final_canvas.paste(cropped, (offset_x, offset_y), cropped)

final_canvas.save("public/test_ai_arsenal_perfect.webp", "WEBP", quality=95)
print("SUCCESS! Output saved to public/test_ai_arsenal_perfect.webp")
