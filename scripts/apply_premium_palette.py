import os
import re

def replace_in_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # 1. Backgrounds to Pure Black / Deep Obsidian
    content = content.replace('bg-[#0A0E1A]', 'bg-[#000000]') # Main Background -> Pure Black
    content = content.replace('bg-[#111827]', 'bg-[#0A0A0A]') # Cards/Elevated -> Very dark gray
    
    # 2. Borders to subtle zinc
    content = content.replace('border-white/[0.06]', 'border-[#1A1A1A]')
    content = content.replace('border-white/[0.04]', 'border-[#1A1A1A]')
    content = content.replace('border-white/10', 'border-[#1A1A1A]')
    content = content.replace('border-white/20', 'border-[#27272A]')

    # 3. CTAs: Resend/Sentry Style (Pure White bg, Pure Black text)
    content = content.replace('bg-[#FFFFFF] text-[#FFFFFF]', 'bg-[#FFFFFF] text-[#000000]') # In case of double white
    content = content.replace('bg-[#FFFFFF] text-[#0A0E1A]', 'bg-[#FFFFFF] text-[#000000]') # Hero/Bottom CTA
    
    # 4. Krixai Amethyst Accent (#8B5CF6) for icons and step numbers
    # Code snippet highlight
    content = content.replace('bg-[rgba(255, 255, 255, 0.03)]', 'bg-[rgba(139,92,246,0.05)]')
    content = content.replace('bg-[rgba(255,255,255,0.04)]', 'bg-[rgba(139,92,246,0.05)]')
    content = content.replace('border-l-[3px] border-white/20', 'border-l-[2px] border-[#8B5CF6]')
    
    # Feature Cards Icons
    content = content.replace('iconColor: "#FFFFFF"', 'iconColor: "#8B5CF6"')
    content = content.replace('iconBg: "rgba(255,255,255,0.05)"', 'iconBg: "rgba(139,92,246,0.08)"')
    
    # How It Works Numbers
    content = content.replace('bg-[#FFFFFF] text-[#0A0E1A]', 'bg-[#1A1A1A] text-[#FFFFFF] border border-[#27272A]') # If numbers used this
    # Wait, HowItWorks numbers were bg-[#FFFFFF] after previous script. Let's fix specifically:
    content = re.sub(r'className="w-\[48px\] h-\[48px\] rounded-full bg-\[#FFFFFF\] text-\[#0A0E1A\].*?"', 'className="w-[48px] h-[48px] rounded-full bg-[#0A0A0A] border border-[#27272A] text-[#8B5CF6] font-bold text-[20px] flex items-center justify-center mb-[24px] shadow-[0_0_20px_rgba(139,92,246,0.15)]"', content)
    
    # Glows to Amethyst
    content = content.replace('shadow-[0_4px_14px_rgba(255,255,255,0.1)]', 'shadow-[0_0_0_1px_rgba(255,255,255,0.05)]') # Minimalist buttons
    content = content.replace('hover:shadow-[0_6px_20px_rgba(255,255,255,0.15)]', 'hover:shadow-[0_0_0_1px_rgba(255,255,255,0.2)]')
    content = content.replace('hover:border-[rgba(255,255,255,0.15)]', 'hover:border-[#8B5CF6]')
    content = content.replace('hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]', 'hover:shadow-[0_0_30px_rgba(139,92,246,0.1)]')

    # Selection color
    content = content.replace('selection:bg-white/10', 'selection:bg-[#8B5CF6]/20')

    # Background Mesh (Deep Obsidian to Violet)
    # Removing the old radial gradients and replacing with a sophisticated Amethyst mesh
    mesh_old = r'radial-gradient\(ellipse at 20% 50%, rgba\(255, 255, 255, 0.03\) 0%, transparent 50%\),\s*radial-gradient\(ellipse at 80% 20%, rgba\(255, 255, 255, 0.02\) 0%, transparent 50%\),\s*radial-gradient\(ellipse at 50% 80%, rgba\(255, 255, 255, 0.01\) 0%, transparent 50%\),\s*#0A0E1A'
    mesh_new = 'radial-gradient(ellipse at 50% 0%, rgba(139, 92, 246, 0.15) 0%, transparent 70%), #000000'
    content = re.sub(mesh_old, mesh_new, content, flags=re.MULTILINE)

    # Clean up any leftover bg-[#0A0E1A] from gradients
    content = content.replace(',\n          #0A0E1A', '')

    with open(filepath, 'w') as f:
        f.write(content)

files_to_process = [
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
