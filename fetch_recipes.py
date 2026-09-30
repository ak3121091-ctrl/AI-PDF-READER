import urllib.request
import re

url = 'https://raw.githubusercontent.com/MengTo/threeui/main/src/shaders/landing-pages/pageRecipes.ts'
try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        content = resp.read().decode('utf-8', errors='ignore')
    
    with open('src/shaders/landing-pages/pageRecipes.ts', 'w', encoding='utf-8', newline='\n') as f:
        f.write(content)
    print('Successfully fetched full pageRecipes.ts, length:', len(content))
except Exception as e:
    print('Error fetching pageRecipes.ts:', e)
