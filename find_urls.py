import re
with open('src/shaders/threeui.css', 'r', encoding='utf-8') as f:
    text = f.read()

urls = set(re.findall(r'url\([\'"]?([^\'")]+)[\'"]?\)', text))
for u in urls:
    print('URL:', u)
