const fs = require('fs');
const icons = ['OpenAI', 'Anthropic', 'Gemini', 'Aws', 'Azure', 'X'];
icons.forEach(icon => {
  try {
    const content = fs.readFileSync(`node_modules/@lobehub/icons/es/${icon}/components/Mono.js`, 'utf8');
    const match = content.match(/d:\s*"([^"]+)"/g);
    if (match) {
      console.log(`\n--- ${icon} ---`);
      match.forEach(m => console.log(m));
    }
  } catch (e) {
    console.error(`Error reading ${icon}:`, e.message);
  }
});
