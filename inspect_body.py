import re

with open('scraped_showcase.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

# Let's inspect titles, headings, buttons, articles, etc.
headings = re.findall(r'<h[1-6][^>]*>(.*?)</h[1-6]>', text, re.DOTALL)
print('Headings:')
for h in headings:
    print('  -', re.sub(r'\s+', ' ', h).strip())

buttons = re.findall(r'<button[^>]*>(.*?)</button>', text, re.DOTALL)
print('\nButtons:')
for b in buttons:
    print('  -', re.sub(r'\s+', ' ', b).strip())

links = re.findall(r'<a[^>]*>(.*?)</a>', text, re.DOTALL)
print('\nLinks (first 15):')
for l in links[:15]:
    print('  -', re.sub(r'\s+', ' ', l).strip())

# Check data attributes
data_attrs = set(re.findall(r'(data-[a-zA-Z0-9\-]+)', text))
print('\nData attributes:', sorted(list(data_attrs)))
