const fs = require('fs');
const path = require('path');

function checkProxy() {
    const middlewarePath = path.join(process.cwd(), 'src/middleware.ts');
    const proxyPath = path.join(process.cwd(), 'src/proxy.ts');
    
    if (fs.existsSync(middlewarePath)) {
        console.error('ERROR: src/middleware.ts must not exist. Use src/proxy.ts instead.');
        process.exit(1);
    }
    
    if (!fs.existsSync(proxyPath)) {
        console.error('ERROR: src/proxy.ts is missing.');
        process.exit(1);
    }
    console.log('PASS: Only proxy.ts exists.');
}

function checkSentryScrubbing() {
    const clientConfig = fs.readFileSync(path.join(process.cwd(), 'sentry.client.config.ts'), 'utf8');
    
    if (!clientConfig.includes('delete event.request.data;')) {
         console.error('ERROR: sentry.client.config.ts must completely delete event.request.data');
         process.exit(1);
    }
    if (!clientConfig.includes('sendDefaultPii: false')) {
         console.error('ERROR: sendDefaultPii must be false');
         process.exit(1);
    }
    console.log('PASS: Sentry client config properly scrubs payloads and PII.');
}

checkProxy();
checkSentryScrubbing();
