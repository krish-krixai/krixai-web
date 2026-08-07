import os
import glob
import re

# 1. Switch layout.tsx back to Geist
with open('src/app/layout.tsx', 'r') as f: layout = f.read()
layout = layout.replace('import { Inter, JetBrains_Mono } from "next/font/google";', 'import { Geist, Geist_Mono } from "next/font/google";')
layout = layout.replace('const inter = Inter({', 'const geistSans = Geist({')
layout = layout.replace('variable: "--font-inter",', 'variable: "--font-geist-sans",')
layout = layout.replace('const jetbrainsMono = JetBrains_Mono({', 'const geistMono = Geist_Mono({')
layout = layout.replace('variable: "--font-jetbrains-mono",', 'variable: "--font-geist-mono",')
layout = layout.replace('${inter.variable} ${jetbrainsMono.variable}', '${geistSans.variable} ${geistMono.variable}')
with open('src/app/layout.tsx', 'w') as f: f.write(layout)

# 2. Switch globals.css
with open('src/app/globals.css', 'r') as f: globals_css = f.read()
globals_css = globals_css.replace('--font-sans: var(--font-inter);', '--font-sans: var(--font-geist-sans);')
globals_css = globals_css.replace('--font-mono: var(--font-jetbrains-mono);', '--font-mono: var(--font-geist-mono);')
with open('src/app/globals.css', 'w') as f: f.write(globals_css)

# 3. Refine typography across landing components
files = glob.glob('src/components/landing/*.tsx')
for f in files:
    with open(f, 'r') as file: content = file.read()
    
    # Hero specifically: Medium/Semibold weight, tracking tighter, pure crisp white
    if 'hero.tsx' in f:
        # H1
        content = content.replace('font-bold', 'font-medium')
        # Add a microscopic drop shadow to make it pop like Vercel's rasterized text
        content = content.replace('className="text-[#FFFFFF] font-medium text-[40px] md:text-[64px] leading-[1.05] tracking-tighter"', 
                                  'className="text-[#EDEDED] font-medium text-[48px] md:text-[72px] leading-[1.05] tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]"')
        # Subheadline text color
        content = content.replace('text-[#A1A1AA]', 'text-[#888888]')

    # Other headings: Vercel uses font-medium a lot for large text
    content = content.replace('font-bold', 'font-medium')
    content = content.replace('font-semibold', 'font-medium')
    
    # Increase text size slightly on feature headings for that Vercel feel
    content = content.replace('text-[18px] md:text-[22px]', 'text-[20px] md:text-[24px]')
    content = content.replace('text-[28px] md:text-[40px]', 'text-[32px] md:text-[48px]')
    
    # Refine Grays to #888888 and #666666 (Classic Vercel Grays)
    content = content.replace('#A1A1AA', '#888888')
    content = content.replace('#71717A', '#666666')
    content = content.replace('#94A3B8', '#888888')

    with open(f, 'w') as file: file.write(content)
