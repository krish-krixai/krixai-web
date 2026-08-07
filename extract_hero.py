import json

transcript_path = '/Users/krish/.gemini/antigravity-ide/brain/aab5eac8-97ab-4417-82a0-fca5a359ca07/.system_generated/logs/transcript_full.jsonl'

with open(transcript_path, 'r') as f:
    lines = f.readlines()

for line in reversed(lines):
    data = json.loads(line)
    if data.get('type') == 'TOOL_RESPONSE' and 'hero.tsx' in str(data.get('content')) and 'The following code has been modified' in str(data.get('content')):
        print(data['content'])
        break
