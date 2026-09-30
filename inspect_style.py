with open('scraped_showcase.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

import re
style = re.search(r'<style>(.*?)</style>', text, re.DOTALL).group(1)

selectors = ['.stage', '.topbar', '.hero-word', '.gallery', '.book-card', '.book', '.detail-panel']
for s in selectors:
    m = re.search(r'(' + re.escape(s) + r'\s*\{[^}]+\})', style)
    if m:
        print(m.group(1))
        print('---')
