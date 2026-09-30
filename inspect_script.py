with open('scraped_showcase.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

import re
scripts = re.findall(r'<script>(.*?)</script>', text, re.DOTALL)
if scripts:
    print('Script length:', len(scripts[0]))
    print(scripts[0][:2500])
    print('...')
    print(scripts[0][2500:5000])
