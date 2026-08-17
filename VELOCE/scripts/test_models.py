import io
import requests
from PIL import Image
from rembg import remove, new_session

print("Testing available models in rembg...")

# Test on AC Milan Home 26/27 (the exact one from the screenshot where sleeves got cut)
milan_url = "https://thejerseynation.in/cdn/shop/files/Maillot-Match-AC-Milan-Domicile-2025-2026-768x768_1800x1800.jpg?v=1751028535"
# Or test Dortmund
dortmund_url = "https://thejerseynation.in/cdn/shop/files/01_20_1800x1800.png?v=1718544713"

try:
    print("Testing isnet-general-use session...")
    isnet_session = new_session("isnet-general-use")
    print("isnet session loaded successfully!")
except Exception as e:
    print(f"isnet error: {e}")

try:
    print("Testing u2net_cloth_seg session...")
    cloth_session = new_session("u2net_cloth_seg")
    print("u2net_cloth_seg session loaded successfully!")
except Exception as e:
    print(f"cloth_session error: {e}")
