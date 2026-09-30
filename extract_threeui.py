import json
import os

content_path = r'C:\Users\ASUS\.gemini\antigravity-ide\brain\d700ebf0-410e-4286-b8d6-2cafe70fca75\.system_generated\steps\7\content.md'
with open(content_path, 'r', encoding='utf-8') as f:
    text = f.read()

start_idx = text.find('{')
json_str = text[start_idx:]
data = json.loads(json_str)

output_dir = 'extracted_threeui'
os.makedirs(output_dir, exist_ok=True)

for file_info in data.get('files', []):
    path = file_info.get('path')
    code = file_info.get('code')
    print('Processing:', path, 'Bytes:', file_info.get('bytes'))
    
    target_path = os.path.join(output_dir, os.path.basename(path))
    if code is not None:
        with open(target_path, 'w', encoding='utf-8') as f:
            f.write(code)
        print(f"Wrote {target_path} ({len(code)} chars)")
    else:
        print(f"No code field for {path}")
