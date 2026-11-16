# Intake flow: how a creator asks for a game

Status: proposal, 2026-11-16. Prototype: `/start` (noindex, not linked from the site). Copy and config: `src/content/intake.he.ts`.
Builds on `docs/onboarding-flow.md` (audit of Ilan's `/create`). Inputs: the UX research PDF and the persona docx from Tanya.

## 1. The idea in five lines

1. The game is made from the creator's real stories, so **the intake is the product**. Two lines of input produce an empty game (audit, friction #1).
2. One flow for every event. Only the wording and the story prompts change, through a small config per "shape" (a person, a couple, a group).
3. No account, ever, before the creator has seen value. A private draft link is created silently, as today.
4. One question per screen, mobile first, Hebrew RTL, autosave, a progress bar, and a meter that shows how many questions the stories can feed.
5. We do not rebuild the game. The runtime (host screen, QR, phones, scoring, voice, video) stays in Ilan's Base44 app. The intake produces one structured **brief** that his app can take as a prefilled draft.

## 2. What we took from the research, and what we did not

| Research point | Decision | Why |
|---|---|---|
| Tap an audience preset, prefilled title, no login wall, progress bar, autosave (PDF) | Adopted | Matches the audit: the wizard is short, the blank step 1 is the problem |
| Base44 login wall, 6-digit email code, OAuth showing base44.com, SSO (PDF) | Dropped | The PDF says it could not open the app. The audit did: `/create` makes an anonymous draft, there is no login |
| "Playable game in 3 taps, under a minute" (PDF) | Reframed | Content is the family's stories and generation takes about 4 minutes. We promise a first preview with their name at once, and real content in about 10 minutes |
| Goal first, one question per screen, labels above fields, optional fields marked (docx) | Adopted | |
| Personal details in a collapsed optional section (docx) | Reversed | For Tadam the details are the content. They are the main path, with a minimum. Only logistics are optional |
| Generate a draft from event type, name and age alone (docx) | Not enough | The generator refuses to invent facts. A generic fallback pack is a possible later add-on |
| English toggle, CSV import, analytics dashboard (docx) | Out of MVP | The brief is Hebrew only |
| Personas: parent, HR, teachers' union (both) | Replaced by the 12 events in the landing marquee | See section 4 |

## 3. Layers and hand-off

1. **Intake** (this proposal). Prototype here, spec for Ilan.
2. **Generation** (Base44, with rule changes). Brief in, script out. Rules in section 7.
3. **Runtime** (Base44). Host screen, QR, phones, podium. We add a pre-event test screen and a launchpad.

Hand-off between 1 and 2 is the **brief** (section 6). Until Ilan accepts a prefilled draft, the prototype's last screen shows the same brief as JSON and as one text block that can be pasted into step 1 of his app.

## 4. One flow for everyone, with config differences

The 12 landing-marquee events group by who the game is about:

| Shape | Events | Name step asks | Prompts lean toward |
|---|---|---|---|
| person | יום הולדת, יום הולדת עגול, בר או בת מצווה, מסיבת פרידה או פרישה, מסיבת רווקים או רווקות | a name, plus one optional word (age, class, role) | favorites, nicknames, a habit, one story, closest people, an inside joke |
| couple | חתונה, חינה, יום נישואין | both names, how long together (optional) | how they met, the proposal, who is who, a trip, shared taste, an inside joke |
| group | אירוע משפחתי, פגישת מחזור, יום גיבוש, הרמת כוסית | group or company name, size (optional) | a shared memory, a running joke, who is who, how it started, a tradition, a place |

Same screens and same order for all. The config decides three things: the wording of screens 2 and 3, the prompt list, and the question target (12 for every event).

Differences to keep in mind, none needed in the MVP:
- **Company and group events:** the person filling the form often does not hold the stories. The "someone else knows more" link (screen 3) matters most here, and the contributor link add-on grows out of it. Logo and branding come later.
- **Bar and bat mitzvah, family:** photos of minors. The consent line sits next to the photo upload, and a deletion promise is needed (the game's terms say there is no automatic deletion today).
- **Teachers and unions:** there is no marquee event for them. They fit "group" today. Test with a few real ones before building anything special.

## 5. The screens

Common rules: one question per screen, labels above fields, optional fields say so, 44px minimum touch targets, progress "שלב N מתוך 5" with five named stages (אירוע, על מי, סיפורים, פרטים, המשחק), "נשמר אוטומטית" after each change, Back returns to the previous stage and keeps every answer (each stage has its own history entry), focus moves to the screen heading on every change.

| # | Screen | What the creator does | Rules and states |
|---|---|---|---|
| 0 | Start | Reads the promise (about 10 minutes, no account, they approve everything), taps "בואו נתחיל" | A draft is created here in the real app |
| 1 | איזה אירוע? | Taps one of 12 tiles | One tap moves on. Tiles are a radio group. Changing the event later keeps the typed answers |
| 2 | על מי המשחק? | Types a name (required), one optional word, can edit the prefilled game title | Empty name shows an inline error next to the field and focuses it. The title follows the name until the creator edits it. A sample question with their name appears at once (labelled "דוגמה בלבד") as the early reward, with no AI |
| 3 | ספרו לנו על {name} | Opens a prompt card, types or records an answer, skips what does not fit. Adds up to 5 photos with a caption | One card open at a time. An answer counts at 20 characters. The meter reads "יש לנו חומר ל N מתוך T שאלות". "המשך" unlocks at 3 answered prompts and until then says how many are missing. Mic: a pulsing red bar above the field ("מקליטים עכשיו"), a timer, a red glow on the field, live text of what was heard where the browser provides it, permission error and "no speech" shown next to the button, hidden where the browser has no speech recognition. Photos: consent line beside the upload, caption hint with an example |
| 3a | יש לכם שאלה משלכם? | After the last story prompt and before the photos: adds any number of own questions. Each is either **free text** (question plus the correct answer, guests type theirs) or **four options** (four answers, one marked correct) | Required fields depend on the type. Each own question counts toward the meter and the 12, and is approved in the review like the rest |
| 3b | מישהו אחר מכיר יותר טוב? | Shares the draft link by WhatsApp | MVP shares the draft only. The real contributor link (friends add, parent approves) is a later add-on |
| 4 | כמה פרטים על האירוע | Optional: date, guests, screen type, WhatsApp or email | "דלגו" is always available. Contact is asked late, with the reason. The date drives the advice "start a few days before" |
| 5 | בונים את המשחק | Waits, picks a host meanwhile ("תבחרו בשבילי" is the default) | Mock in the prototype. Real: about 4 minutes, progress meter, "your work is saved" on failure |
| 6 | בודקים ומאשרים | One question at a time (12 generated, then any of the creator's own) ("שאלה 3 מתוך 12"), sees which story each came from, approves or asks for another wording, ticks a 3-point checklist | "לאישור והזמנה" unlocks only when every question is approved and every box is ticked. A read-only share link for the second parent. Questions are placeholders in the prototype, the source stories are real |
| 7 | הזמנה | Reads a summary, orders | Payment after approval and before production. The price is shown before the click (the page hides prices for now, per Tanya). Provider is not decided |
| 8 | Launchpad | Gets a QR, a short code, a copy-link button, a pre-event test list, the note that the private link is the edit key | Players need no app and no account. Duplicate and edit shortcuts belong here in the real app |

## 6. The brief (what the intake hands over)

```json
{
  "eventType": "bar-bat",
  "subjectShape": "person",
  "subject": { "name": "נועה", "ageOrRole": "בת 12" },
  "title": "כמה אתם מכירים את נועה?",
  "stories": [{ "promptId": "loves", "prompt": "מה נועה אוהב.ת?", "text": "..." }],
  "photos": [{ "file": "IMG_1.jpg", "caption": "הטיול בצפון, מי צילם?" }],
  "logistics": { "date": "2026-12-20", "guests": 80, "screen": "מקרן", "contact": "..." },
  "host": "auto",
  "questionCount": 12,
  "materialReady": 12,
  "ownQuestions": [
    { "q": "...", "type": "free", "free": "..." },
    { "q": "...", "type": "choice", "answers": ["..", "..", "..", ".."], "correct": 2 }
  ],
  "consent": { "photos": true }
}
```

`subject.name` is one string (couple names are not split: Hebrew names can start with ו). The prototype's launchpad prints this JSON and a plain-text version for a developer or the team.

## 7. Rules for the generator (for Ilan)

1. Every question must cite a story or a photo caption from the brief. No source, no question. This matches today's behaviour, where thin input gives "no verified info" questions.
2. If the material is below the target, generate fewer questions and say so ("יש חומר ל 7 שאלות"), instead of padding.
3. Examples and prompts are event-neutral and never name real artists, films or people (the brief). The movie-scene question type needs Tanya's approval.
4. The creator can ask for another wording per question, and approves each one.
5. The meter heuristic (60 characters of story per question, at most 3 questions per prompt, 1 per captioned photo) is a starting point in `MATERIAL` in `intake.he.ts`. Tune it against the generator on real stories.

## 8. Edge cases

- Reload or lost connection: state is in localStorage and resumes at the same screen. The real app also saves to the server.
- Mic blocked or in-app browser (WhatsApp, Instagram): the message appears next to the mic and suggests Chrome or Safari. Typing always works.
- Fewer than 3 answered prompts: the button stays locked and says how many are missing. Nothing is lost.
- Back from the order screen: returns to the review and keeps approvals.
- HEIC photos from iPhones: the prototype accepts any image. The real app must accept and convert HEIC (audit friction #5).
- Storage blocked: the prototype works but does not resume.

## 9. Metrics

Completion rate (start to order), time from start to "המשך" on screen 3, median answered prompts, share of creators who use the mic, drop-off per screen, share who skip screen 4, time from order to approval, share who use the "someone else knows more" link. The prototype already emits `intake_start`, `intake_step`, `intake_prompt_answered` and `intake_complete` through `track()` (the stub in `src/lib/analytics.ts`, no vendor yet).

## 10. What the prototype is and is not

- Real: screens 0 to 4 (the whole input), validation, the meter, autosave and resume, photo captions, the mic where supported, the brief and the text version.
- Mock: screens 5 to 8 (generation, host picker, review questions, order, launchpad). The review shows real source snippets next to placeholder questions. The QR encodes a sample link.
- Nothing is sent anywhere. Answers stay in this browser. Photos are kept in memory only and never stored or uploaded.
- The hosts list in `HOSTS` is a placeholder copied from Ilan's app (5 versus 6 is still open).

Run it: `npm run dev`, then open `/start`. A shared preview: `npm run build && netlify deploy --dir dist` gives a draft URL.

## 11. Open questions

**For Ilan**
1. Can `/create` accept a prefilled draft (a URL with a payload, or a call that returns a draft link)? If not, is the pasted text block good enough for now?
2. Can the generator refuse a question that has no source story and return fewer questions?
3. A host preview, HEIC photos, a visible "saved" state in his wizard, and the checkout price aligned to 750 and 50.

**For Tanya**
1. Payment provider and the delivery promise (hours, or a deadline tied to the date).
2. 5 or 6 ready hosts. The movie-scene question type and the "famous hosts" block against the brief.
3. When the landing CTAs may point to the new flow. Today they do not, because that changes the story's call to action.
4. Whether the contributor link ships in the MVP or right after.
