// Cosmos47 uses its edge host's IP-derived country (request.cf.country).
// On Netlify the equivalent trusted value is context.geo.country.code.
// Never use a client-supplied country header to decide a visitor's language.
export default function locale(request, context) {
  const url = new URL(request.url);
  if (url.pathname !== '/' || !['GET', 'HEAD'].includes(request.method)) return;
  const country = context.geo?.country?.code?.toUpperCase() || '';
  if (!/^[A-Z]{2}$/.test(country) || ['IL', 'XX', 'ZZ'].includes(country)) return;
  url.pathname = '/en/';
  return new Response(null, {
    status: 302,
    headers: { Location: url.href, 'Cache-Control': 'private, no-store' },
  });
}
export const config = { path: '/' };
