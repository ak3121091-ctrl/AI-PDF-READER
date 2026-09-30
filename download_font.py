import urllib.request
import os

os.makedirs('src/shaders/fonts', exist_ok=True)

candidate_urls = [
    'https://raw.githubusercontent.com/MengTo/threeui/main/src/shaders/fonts/fragment-mono.woff2',
    'https://threeui.com/fonts/fragment-mono.woff2',
    'https://threeui.com/shaders/fonts/fragment-mono.woff2',
    'https://fonts.gstatic.com/s/fragmentmono/v3/4UaSrEtFpBIaEph46uhEN-1T.woff2'
]

downloaded = False
for url in candidate_urls:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = resp.read()
            if len(data) > 500:
                with open('src/shaders/fonts/fragment-mono.woff2', 'wb') as f:
                    f.write(data)
                print(f"Downloaded from {url} ({len(data)} bytes)")
                downloaded = True
                break
    except Exception as e:
        print(f"Failed {url}: {e}")

if not downloaded:
    print("Downloading standard Fragment Mono from Google Fonts...")
    # Fetch Fragment Mono woff2 from google fonts css
    css_req = urllib.request.Request('https://fonts.googleapis.com/css2?family=Fragment+Mono', headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(css_req, timeout=5) as resp:
        css = resp.read().decode('utf-8')
    import re
    font_url = re.search(r'url\((https://[^)]+\.woff2)\)', css).group(1)
    with urllib.request.urlopen(font_url, timeout=5) as resp:
        data = resp.read()
        with open('src/shaders/fonts/fragment-mono.woff2', 'wb') as f:
            f.write(data)
    print(f"Downloaded Fragment Mono from {font_url} ({len(data)} bytes)")
