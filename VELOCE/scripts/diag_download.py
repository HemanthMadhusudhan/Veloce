import requests

url = "https://thejerseynation.in/cdn/shop/files/01_20_1800x1800.png?v=1718544713"
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
}
resp = requests.get(url, headers=headers)
print("Status code:", resp.status_code)
print("Headers:", resp.headers)
print("Content length:", len(resp.content))
print("First 200 bytes:", resp.content[:200])
