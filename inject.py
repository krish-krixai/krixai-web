import re

with open('extracted_new_hero_snippet_1.tsx', 'r') as f:
    code = f.read()

# Remove RuntimeTelemetry usage
code = code.replace('<RuntimeTelemetry />', '')
# Rename SecurityFlow
code = code.replace('function SecurityFlow()', 'function AcceleratorPipeline()')

# Now inject into runtime-engine.tsx
with open('src/components/runtime-engine.tsx', 'r') as f:
    engine_code = f.read()

# Add imports for accelerator-primitives
imports = "import { AcceleratorChassis, PolicyModule, ContainmentVault, RuntimeColors } from '@/components/runtime/accelerator-primitives';\n"
engine_code = engine_code.replace('import { twMerge } from "tailwind-merge";', 'import { twMerge } from "tailwind-merge";\n' + imports)

# Insert AcceleratorPipeline function before RuntimeEngine
engine_code = engine_code.replace('export function RuntimeEngine() {', code + '\n\nexport function RuntimeEngine() {')

# Replace the 3D illustration section
# Find the start and end of the 3D illustration section
replace_target = """                {/* 3D Illustration Background */}
                <motion.div 
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}
                  className="relative w-[150%] sm:w-[120%] lg:w-[100%] aspect-[16/9] flex items-center justify-center z-10"
                >
                  <Image 
                    src="/illustrations/runtime-protection.png"
                    alt="Runtime Security Engine"
                    fill
                    className="object-contain filter contrast-[1.15] brightness-[0.9] saturate-[0.85] transition-all duration-700 drop-shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
                  />
                </motion.div>"""

new_component = """                <div className="absolute inset-0 w-full h-full flex items-center justify-center scale-[0.6] sm:scale-[0.8] lg:scale-[1.1] z-10">
                  <AcceleratorPipeline />
                </div>"""

engine_code = engine_code.replace(replace_target, new_component)

with open('src/components/runtime-engine.tsx', 'w') as f:
    f.write(engine_code)
