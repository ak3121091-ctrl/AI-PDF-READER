import re

with open('scraped_showcase.html', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

print('Searching for URLs and asset references:')
urls = set(re.findall(r'https?://[^\s"\'<>]+', content))
for u in urls:
    print('URL:', u)

rel = set(re.findall(r'(?:src|href)=["\']([^"\']+)["\']', content))
for r in rel:
    print('REL:', r)

css_urls = set(re.findall(r'url\(["\']?([^"\'\)]+)["\']?\)', content))
for c in css_urls:
    print('CSS URL:', c)
