import fs from 'fs';

const urls = [
  { key: '3d_tour', url: 'https://maps.app.goo.gl/db4f96FxvXLvNjC36' },
  { key: 'inside_1', url: 'https://maps.app.goo.gl/VQKstSnQSjaGUDVV6' },
  { key: 'inside_2', url: 'https://maps.app.goo.gl/TsPupXzmqJKZA4YW6' },
  { key: 'inside_3', url: 'https://maps.app.goo.gl/Vo56q4dmyj74HLsN8' },
  { key: 'owner', url: 'https://maps.app.goo.gl/HZBuGNpTxwbSRPfdA' },
  { key: 'inside_4', url: 'https://maps.app.goo.gl/tAp8c3os7Rjwqgnu7' },
  { key: 'inside_5', url: 'https://maps.app.goo.gl/196Jw9RdrTvPeNB27' },
  { key: 'inside_6', url: 'https://maps.app.goo.gl/vXswoUbui8jYowMv6' },
  { key: 'inside_7', url: 'https://maps.app.goo.gl/M2rUc86JbLPywDUZ7' },
  { key: 'inside_8', url: 'https://maps.app.goo.gl/z22LKqufemnkW1B4A' },
  { key: 'inside_9', url: 'https://maps.app.goo.gl/mL8FpyTo8LRAtoSv5' },
  { key: 'inside_10', url: 'https://maps.app.goo.gl/1nmmBAYuwsMGsSSj8' }
];

async function main() {
  const results = [];
  for (const item of urls) {
    try {
      const res = await fetch(item.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        redirect: 'follow'
      });
      const finalUrl = res.url;
      const html = await res.text();
      const ogMatch = html.match(/content="([^"]+)"\s+property="og:image"/i) || html.match(/property="og:image"\s+content="([^"]+)"/i);
      const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
      
      const matches = Array.from(html.matchAll(/https:\/\/(?:lh[0-9]|streetviewpixels-pa)\.google(?:usercontent)?\.com\/[^\s"'<>\\]+/g)).map(m => m[0]);
      
      results.push({
        key: item.key,
        shortUrl: item.url,
        finalUrl,
        title: titleMatch ? titleMatch[1] : null,
        ogImage: ogMatch ? ogMatch[1] : null,
        extractedImages: Array.from(new Set(matches)).slice(0, 5)
      });
      console.log('Processed:', item.key, ogMatch ? 'Found OG' : 'No OG');
    } catch (err) {
      console.error('Error for', item.key, err.message);
    }
  }
  fs.writeFileSync('resolved_maps.json', JSON.stringify(results, null, 2));
  console.log('Saved to resolved_maps.json');
}

main();
