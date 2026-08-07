const fs = require('fs');
const path = require('path');

const dashboardDir = path.join(__dirname, 'src/app/(dashboard)/dashboard');
const dirs = ['api-keys', 'billing', 'policies', 'settings', 'team', 'threat-logs', 'usage', 'analytics', 'integrations'];

dirs.forEach(dir => {
  const pagePath = path.join(dashboardDir, dir, 'page.tsx');
  if (fs.existsSync(pagePath)) {
    let content = fs.readFileSync(pagePath, 'utf8');
    
    // Replace the opening div with AppContainer
    const regex = /<div className="p-6[^"]*">/g;
    if (content.match(regex)) {
      content = content.replace(regex, '<AppContainer className="py-8 flex flex-col min-h-[calc(100vh-64px)]">');
      
      // Replace the closing div. We just replace the last </div> before the end of the file.
      const lastDivIndex = content.lastIndexOf('</div>');
      if (lastDivIndex !== -1) {
        content = content.substring(0, lastDivIndex) + '</AppContainer>' + content.substring(lastDivIndex + 6);
      }
      
      // Add import
      if (!content.includes('AppContainer')) {
        content = 'import { AppContainer } from "@/components/layout/app-container";\n' + content;
      }
      
      fs.writeFileSync(pagePath, content);
      console.log(`Updated ${pagePath}`);
    }
  }
});
