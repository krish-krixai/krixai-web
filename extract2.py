import json
import re

transcript_path = '/Users/krish/.gemini/antigravity-ide/brain/aab5eac8-97ab-4417-82a0-fca5a359ca07/.system_generated/logs/transcript_full.jsonl'

with open(transcript_path, 'r') as f:
    content_blocks = []
    for line in f:
        data = json.loads(line)
        if data.get('type') == 'TOOL_RESPONSE' and data.get('content'):
            if 'hero.tsx' in data['content']:
                content_blocks.append(data['content'])

# Iterate backwards
for i, block in enumerate(reversed(content_blocks)):
    if 'export function SecurityFlow' in block and 'AcceleratorChassis' not in block:
        # We found a block that contains the OLD SecurityFlow (before AcceleratorChassis was introduced)
        print(f"Found match at index {i} from end")
        with open('old_hero_extracted.tsx', 'w') as out:
            # Strip line numbers like "123: "
            clean_text = re.sub(r'^\d+: ', '', block, flags=re.MULTILINE)
            out.write(clean_text)
        break
