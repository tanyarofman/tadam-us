/**
 * /llms.txt: a plain summary of Tadam! for AI assistants (ChatGPT, Gemini, Perplexity, Claude...),
 * with links to every blog article. Regenerated on each build from copy.en.ts and the blog.
 */
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { COPY } from "../content/copy.en";
import { PRICING, fillPrices } from "../config/pricing";

export const GET: APIRoute = async ({ site }) => {
  const abs = (path: string) => new URL(path, site).href;
  const posts = (await getCollection("blog", (p) => !p.data.draft)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
  const isPrice = (it: object) => "pricesOnly" in it && it.pricesOnly === true;
  const faq = [
    ...(PRICING.showPrices ? COPY.pricing.faq.filter(isPrice) : []),
    ...COPY.faq.items,
    ...COPY.pricing.faq.filter((it) => !isPrice(it)),
  ]
    .map((f) => `- ${f.q} ${fillPrices(f.a)}`)
    .join("\n");

  const body = `# Tadam!

> Tadam! is a personalized live trivia game show for events. We build the questions from your stories, photos and inside jokes, a host runs the game on the big screen, and every guest plays from their phone, with no app to download. A game takes about 10 to 15 minutes.

Organizers tell us about the event and the guest of honor, send stories and photos (friends and family can contribute too), and approve every question. Tadam turns them into a hosted game show on the venue screen or TV. Guests scan a QR code and answer in their phone's browser; a live leaderboard shows who knows the guest of honor best, and the winner is revealed at the end.

## Who it's for
- ${COPY.eventsStrip.items.join(", ")}
- Companies and teams: office holiday parties, team building, offsites, farewell and retirement parties, welcoming new hires
- Families and friends: birthdays, showers, anniversaries, reunions and holiday gatherings

## How it works
${COPY.scene4.steps.map((s, i) => `${i + 1}. ${s.title} ${s.text}`).join("\n")}

## Frequently asked questions
${faq}

## Pages
- [Home](${abs("/")}): what Tadam is, how it works, the hosts and the FAQ
- [Demo video](${abs("/#demo")}): a recording of a real game
- [Playable demo](${abs("/tom-demo")}): open it on a computer and join from your phone
- [Blog](${abs("/blog/")}): party ideas, games and trivia for birthdays, weddings and showers, teams and holidays

## Articles
${posts.map((p) => `- [${p.data.title}](${abs(`/blog/${p.id}/`)}): ${p.data.answer}`).join("\n")}
`;

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
