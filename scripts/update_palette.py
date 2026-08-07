import os
import re

def replace_in_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # 1. Replace #00D4FF (Cyan) with #FFFFFF (Pure White) in buttons/text
    content = content.replace('bg-[#00D4FF]', 'bg-[#FFFFFF]')
    content = content.replace('text-[#00D4FF]', 'text-[#FFFFFF]')
    content = content.replace('border-[#00D4FF]', 'border-white/20')
    content = content.replace('from-[#00D4FF]', 'from-[#FFFFFF]')
    
    # 2. Replace the secondary gradient color (was #3B82F6 Bright Blue) with a muted silver
    content = content.replace('to-[#3B82F6]', 'to-[#94A3B8]')

    # 3. Replace all the neon cyan glow shadows with very subtle white/gray shadows
    content = re.sub(r'shadow-\[0_0_[0-9]+px_rgba\(0,212,255,[0-9.]+\)\]', 'shadow-[0_4px_14px_rgba(255,255,255,0.1)]', content)
    content = re.sub(r'hover:shadow-\[0_0_[0-9]+px_rgba\(0,212,255,[0-9.]+\)\]', 'hover:shadow-[0_6px_20px_rgba(255,255,255,0.15)]', content)
    
    # 4. Replace rgba colors for cyan (0,212,255 or 0, 212, 255) with white (255,255,255)
    content = content.replace('rgba(0, 212, 255, 0.08)', 'rgba(255, 255, 255, 0.03)')
    content = content.replace('rgba(0,212,255,0.08)', 'rgba(255,255,255,0.04)')
    content = content.replace('rgba(0,212,255,0.1)', 'rgba(255,255,255,0.05)')
    content = content.replace('rgba(0,212,255,0.3)', 'rgba(255,255,255,0.15)')
    content = content.replace('rgba(0, 212, 255, 0.2)', 'rgba(255, 255, 255, 0.1)')
    content = content.replace('rgba(0,212,255', 'rgba(255,255,255')

    # 5. Mute the background gradient colors in Hero to silver/gray
    content = content.replace('rgba(59, 130, 246, 0.06)', 'rgba(255, 255, 255, 0.02)')
    content = content.replace('rgba(16, 185, 129, 0.04)', 'rgba(255, 255, 255, 0.01)')

    # 6. Specific fix for Demo input focus border
    content = content.replace('focus:border-[#00D4FF]/50', 'focus:border-white/30')
    
    # 7. Specific fix for Feature Cards icon color
    content = content.replace('iconColor: "#00D4FF"', 'iconColor: "#FFFFFF"')

    with open(filepath, 'w') as f:
        f.write(content)


files_to_process = [
    "src/app/globals.css",
    "src/app/(marketing)/page.tsx",
    "src/components/navbar.tsx",
    "src/components/landing/hero.tsx",
    "src/components/landing/code-snippet.tsx",
    "src/components/landing/feature-cards.tsx",
    "src/components/landing/how-it-works.tsx",
    "src/components/landing/demo.tsx",
    "src/components/landing/bottom-cta.tsx"
]

for file in files_to_process:
    filepath = os.path.join("/Users/krish/Documents/krixai web", file)
    if os.path.exists(filepath):
        replace_in_file(filepath)
        print(f"Updated {file}")
