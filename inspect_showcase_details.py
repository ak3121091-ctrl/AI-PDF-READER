import re

with open('scraped_showcase.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

# Let's extract the main layout blocks
nav = re.findall(r'<nav[^>]*>.*?</nav>', text, re.DOTALL)
print('NAV:', nav[0] if nav else 'None')

hero = re.findall(r'<(?:header|section|div)[^>]*class=[\'"][^\'"]*hero[^\'"]*[\'"][^>]*>.*?</(?:header|section|div)>', text, re.DOTALL)
print('\nHERO BLOCKS FOUND:', len(hero))
for h in hero[:2]:
    print('--- HERO BLOCK ---')
    print(h[:800])

books = re.findall(r'<button[^>]*data-book=[\'"][^\'"]*[\'"][^>]*>.*?</button>', text, re.DOTALL)
print('\nBOOKS FOUND:', len(books))
for b in books:
    print('--- BOOK ---')
    print(b[:400])

detail = re.findall(r'<aside[^>]*class=[\'"][^\'"]*detail[^\'"]*[\'"][^>]*>.*?</aside>', text, re.DOTALL)
print('\nDETAIL MODAL FOUND:', len(detail))
if detail:
    print(detail[0][:1200])
