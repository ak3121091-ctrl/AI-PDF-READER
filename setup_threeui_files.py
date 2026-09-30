import os
import json
import hashlib

os.makedirs('src/shaders/landing-pages', exist_ok=True)
os.makedirs('public/landing-pages', exist_ok=True)

content_path = r'C:\Users\ASUS\.gemini\antigravity-ide\brain\d700ebf0-410e-4286-b8d6-2cafe70fca75\.system_generated\steps\7\content.md'
with open(content_path, 'r', encoding='utf-8') as f:
    text = f.read()

start_idx = text.find('{')
json_str = text[start_idx:]
data = json.loads(json_str)

for file_info in data.get('files', []):
    path = file_info.get('path')
    code = file_info.get('code')
    if code is not None:
        target_path = path.replace('/', os.sep)
        os.makedirs(os.path.dirname(target_path), exist_ok=True)
        # write with newline='\n' to maintain byte-exact LF sha256
        with open(target_path, 'w', encoding='utf-8', newline='\n') as out_f:
            out_f.write(code)
        
        with open(target_path, 'rb') as check_f:
            actual_sha = hashlib.sha256(check_f.read()).hexdigest()
        print(f"Wrote {target_path} - Target SHA: {file_info.get('sha256')} - Actual: {actual_sha} - Match: {actual_sha == file_info.get('sha256')}")

# Copy pageTypography.ts from steps/54
typography_src = r'C:\Users\ASUS\.gemini\antigravity-ide\brain\d700ebf0-410e-4286-b8d6-2cafe70fca75\.system_generated\steps\54\content.md'
with open(typography_src, 'r', encoding='utf-8') as f:
    lines = f.readlines()
# strip markdown header up to ---
idx = 0
for i, line in enumerate(lines):
    if line.strip() == '---':
        idx = i + 1
        break
typ_code = ''.join(lines[idx:]).strip() + '\n'
with open('src/shaders/landing-pages/pageTypography.ts', 'w', encoding='utf-8', newline='\n') as f:
    f.write(typ_code)
print('Wrote src/shaders/landing-pages/pageTypography.ts')

print('Done setting up ThreeUI core files.')
