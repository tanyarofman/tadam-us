/**
 * /llms.txt: a plain summary of טדאם! for AI assistants (ChatGPT, Gemini, Perplexity...),
 * with links to every blog article. Regenerated on each build.
 */
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { COPY } from "../content/copy.he";

export const GET: APIRoute = async ({ site }) => {
  const abs = (path: string) => new URL(path, site).href;
  const posts = (await getCollection("blog", (p) => !p.data.draft)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
  const faq = COPY.faq.items.map((f) => `- ${f.q} ${f.a}`).join("\n");

  const body = `# טדאם! (Tadam)

> טדאם! הוא משחק טריוויה חי ומותאם אישית לאירועים בישראל. המשחק נבנה מהסיפורים, השאלות והתמונות של המשפחה, החברים או הצוות, רץ על המסך הגדול באירוע, וכל האורחים עונים מהטלפון בלי להוריד אפליקציה. משחק טיפוסי לוקח 10 עד 15 דקות.

Tadam is a personalized live trivia game for events in Israel (Hebrew). Family, friends or colleagues send stories, questions and photos through a link, the organizers prepare the content, and Tadam turns them into a hosted game shown on the venue screen. Guests scan a QR code and answer from their phones in the browser.

## למי זה מתאים
- ${COPY.eventsStrip.items.join(", ")}
- אירועי חברה וצוותים: ימי גיבוש, ערבי צוות, הרמות כוסית לחג, פרידה מעובד, קליטת עובדים חדשים
- מפגשי משפחה, פגישות מחזור, מסיבות סיום

## איך זה עובד
${COPY.scene4.steps.map((s, i) => `${i + 1}. ${s.title} ${s.text}`).join("\n")}

## שאלות נפוצות
${faq}

## דפים
- [דף הבית](${abs("/")}): הסבר, דמו ומחירון
- [English version](${abs("/en/")}): the same page in English, for English speakers in Israel
- [הבלוג](${abs("/blog/")}): רעיונות לאירועים, אטרקציות וחידונים

## מאמרים
${posts.map((p) => `- [${p.data.title}](${abs(`/blog/${p.id}/`)}): ${p.data.answer}`).join("\n")}
`;

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
