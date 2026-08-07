import json
import re

with open('hero_snapshots.txt', 'r') as f:
    for i, line in enumerate(f):
        data = json.loads(line)
        # Content can be under 'content' or inside tool outputs
        text = ""
        if isinstance(data.get('content'), str):
            text = data['content']
        elif isinstance(data.get('content'), list):
            for item in data['content']:
                if isinstance(item, dict) and item.get('type') == 'text':
                    text += item.get('text', '')
                elif isinstance(item, dict) and item.get('type') == 'tool_result':
                    text += item.get('output', '')
        
        # If not in content, check tool_calls ? (No, this is a tool result)
        
        if 'export function SecurityFlow' in text:
            # We found a snapshot.
            out_name = f'old_heroes/hero_{i}.tsx'
            with open(out_name, 'w') as out:
                # Strip the line numbers "123: " if they exist
                clean_text = re.sub(r'^\d+: ', '', text, flags=re.MULTILINE)
                out.write(clean_text)
