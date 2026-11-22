import assert from 'node:assert/strict';
import locale from '../netlify/edge-functions/locale.js';
for (const code of ['IL','il','','XX','ZZ',undefined]) assert.equal(locale(new Request('https://heytadam.com/'),{geo:{country:{code}}}),undefined);
for (const code of ['US','GB','FR','ca']) {
 const r=locale(new Request('https://heytadam.com/?utm_source=test'),{geo:{country:{code}}});
 assert.equal(r.status,302);assert.equal(r.headers.get('location'),'https://heytadam.com/en/?utm_source=test');assert.match(r.headers.get('cache-control'),/no-store/);
 for(const path of ['/en/','/en/blog/','/play/123','/eyal-demo']) assert.equal(locale(new Request('https://heytadam.com'+path),{geo:{country:{code}}}),undefined);
}
assert.equal(locale(new Request('https://heytadam.com/',{method:'POST'}),{geo:{country:{code:'US'}}}),undefined);
console.log('Country routing checks passed');
