import json

transcript_path = '/Users/krish/.gemini/antigravity-ide/brain/aab5eac8-97ab-4417-82a0-fca5a359ca07/.system_generated/logs/transcript_full.jsonl'

with open(transcript_path, 'r') as f:
    for line in f:
        data = json.loads(line)
        if data.get('type') == 'PLANNER_RESPONSE' and data.get('tool_calls'):
            for tc in data['tool_calls']:
                if tc['name'] == 'write_to_file' and 'primitives.tsx' in tc['args'].get('TargetFile', ''):
                    code = tc['args'].get('CodeContent', '')
                    if 'AcceleratorChassis' in code:
                        with open('extracted_new_primitives.tsx', 'w') as out:
                            out.write(code)
                        print("Found new primitives!")
                elif tc['name'] == 'replace_file_content' and 'hero.tsx' in tc['args'].get('TargetFile', ''):
                    code = tc['args'].get('ReplacementContent', '')
                    if 'AcceleratorChassis' in code:
                        with open('extracted_new_hero_snippet.tsx', 'w') as out:
                            out.write(code)
                        print("Found new hero snippet!")
                elif tc['name'] == 'multi_replace_file_content' and 'hero.tsx' in tc['args'].get('TargetFile', ''):
                    chunks = tc['args'].get('ReplacementChunks', [])
                    for i, chunk in enumerate(chunks):
                        code = chunk.get('ReplacementContent', '')
                        if 'AcceleratorChassis' in code:
                            with open(f'extracted_new_hero_snippet_{i}.tsx', 'w') as out:
                                out.write(code)
                            print(f"Found new hero snippet in chunk {i}!")
