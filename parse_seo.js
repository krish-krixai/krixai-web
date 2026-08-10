const fs = require('fs');

function parseSeo(filename) {
    const html = fs.readFileSync(filename, 'utf-8');
    
    const getTagContent = (regex) => {
        const match = html.match(regex);
        return match ? match[1].trim() : "NONE";
    };

    const title = getTagContent(/<title[^>]*>([^<]+)<\/title>/i);
    const desc = getTagContent(/<meta[^>]+name="description"[^>]+content="([^"]+)"/i) 
                 || getTagContent(/<meta[^>]+content="([^"]+)"[^>]+name="description"/i);
    const canonical = getTagContent(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i) 
                      || getTagContent(/<link[^>]+href="([^"]+)"[^>]+rel="canonical"/i);
    const robots = getTagContent(/<meta[^>]+name="robots"[^>]+content="([^"]+)"/i) 
                   || getTagContent(/<meta[^>]+content="([^"]+)"[^>]+name="robots"/i);
    
    // OG Tags
    const ogUrl = getTagContent(/<meta[^>]+property="og:url"[^>]+content="([^"]+)"/i) 
                  || getTagContent(/<meta[^>]+content="([^"]+)"[^>]+property="og:url"/i);
    const ogImage = getTagContent(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i) 
                    || getTagContent(/<meta[^>]+content="([^"]+)"[^>]+property="og:image"/i);
                    
    // H1 count
    const h1s = [...html.matchAll(/<h1[^>]*>/gi)];
    const h1Count = h1s.length;

    // JSON-LD
    const jsonLd = html.includes('application/ld+json') ? "YES" : "NO";

    console.log(`\n--- ${filename} ---`);
    console.log(`Title: ${title}`);
    console.log(`Description: ${desc}`);
    console.log(`Canonical: ${canonical}`);
    console.log(`Robots: ${robots}`);
    console.log(`H1 Count: ${h1Count}`);
    console.log(`OG:URL: ${ogUrl}`);
    console.log(`OG:Image: ${ogImage}`);
    console.log(`JSON-LD: ${jsonLd}`);
}

const files = process.argv.slice(2);
files.forEach(f => parseSeo(f));
