import json
import re

transcript = '/Users/krish/.gemini/antigravity-ide/brain/aab5eac8-97ab-4417-82a0-fca5a359ca07/.system_generated/logs/transcript_full.jsonl'
lines_of_file = []
found = False

with open(transcript, 'r') as f:
    # reverse the transcript to find the last view_file
    all_lines = f.readlines()
    
for i in range(len(all_lines)-1, -1, -1):
    line = all_lines[i]
    try:
        data = json.loads(line)
        if data.get('type') == 'TOOL_RESPONSE' and data.get('content'):
            content = data['content']
            if 'File Path: `file:///Users/krish/Documents/krixai%20web/src/components/hero.tsx`' in content:
                if 'The above content shows the entire, complete file contents' in content or 'Showing lines' in content:
                    # check if this is the OLD version. It should contain "export function SecurityFlow" 
                    # and have the old primitives
                    if 'RuntimeTelemetry' in content and 'export function SecurityFlow' in content and 'AcceleratorChassis' not in content:
                        print("Found old hero.tsx")
                        # Extract the lines
                        file_lines = []
                        for txt_line in content.split('\n'):
                            match = re.match(r'^\d+: (.*)', txt_line)
                            if match:
                                file_lines.append(match.group(1))
                            elif re.match(r'^\d+:$', txt_line):
                                file_lines.append("")
                        
                        with open('old_hero.tsx', 'w') as out:
                            out.write('\n'.join(file_lines))
                        found = True
                        break
    except Exception as e:
        pass
    if found:
        break
