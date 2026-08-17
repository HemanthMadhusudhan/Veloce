import json

with open("src/lib/default-products.json", "r", encoding="utf-8") as f:
    products = json.load(f)

print(f"Total products: {len(products)}")
arsenal_prods = [p for p in products if "arsenal" in p.get("name", "").lower()]
print(f"Found {len(arsenal_prods)} Arsenal products:")
for p in arsenal_prods:
    print(p["id"], p["name"], p["images"][:2])
