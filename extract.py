import json
with open('hero_snapshots.txt', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    data = json.loads(line)
    # the output is probably inside data['content'] if it's a SYSTEM message for a tool response, or somewhere else.
    # actually, in the new format, tool responses are in 'content' if it's a TOOL_RESPONSE type.
    if data.get('type') == 'TOOL_RESPONSE' and data.get('content'):
        content = data['content']
        # it might be a list of tool responses
        if isinstance(content, list):
            for res in content:
                if 'File Path: `file:///Users/krish/Documents/krixai%20web/src/components/hero.tsx`' in str(res):
                   with open(f'old_heroes/hero_{i}.tsx', 'w') as out:
                       out.write(str(res))
        elif isinstance(content, str):
            with open(f'old_heroes/hero_{i}.tsx', 'w') as out:
                out.write(content)
