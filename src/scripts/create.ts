/**
 * The game creator at /create. The draft lives in this browser (localStorage) until the order is sent.
 * Steps: 0 start, 1 event, 2 who, 3 stories, 4 host, 5 order card (package + email),
 * 6 "checkout not connected" (only on a deploy without Paddle keys).
 * Sending the order: POST /api/order (brief + photos, stored in Netlify Blobs), then the Paddle checkout opens
 * with the order id in its custom data, and Paddle returns the customer to /create/thanks/.
 */
import { track } from "../lib/analytics";
import { fill, MATERIAL } from "../content/create";
import type { EventTile, Shape, ShapeConfig, Prompt, Host, CREATE } from "../content/create";

interface Pkg {
  id: string;
  name: string;
  price: string;
  specs: string;
}
interface Data {
  events: EventTile[];
  shapes: Record<Shape, ShapeConfig>;
  hosts: Host[];
  material: typeof MATERIAL;
  copy: typeof CREATE;
  packages: Pkg[];
  checkout: { env: "sandbox" | "production"; token: string; prices: Record<string, string> };
}
declare global {
  interface Window {
    Paddle?: any;
  }
}
interface State {
  v: 1;
  step: number;
  /** Screen inside a step: the story question in step 3, date or host in step 4. */
  sub: number;
  eventId: string;
  name: string;
  extra: string;
  title: string;
  titleEdited: boolean;
  answers: Record<string, string>;
  modes: Record<string, "free" | "choice">;
  choices: Record<string, { q: string; answers: string[]; correct: number }>;
  /** Prompt id → file name of the photo attached to that question. */
  photos: Record<string, string>;
  details: { date: string; guests: string };
  host: string;
  pkg: string;
  email: string;
  consent: boolean;
  orderId: string;
  /** Random secret sent with the order: only this browser can send the same order again. Never shown. */
  token: string;
}

const KEY = "tadam-create-v1";
const MAX_STEP = 6;
const ORDER_KEY = "tadam-order";
const root = document.querySelector<HTMLElement>("[data-intake]");
const dataEl = document.getElementById("intake-data");

if (root && dataEl) init(root, JSON.parse(dataEl.textContent || "{}") as Data);

function init(root: HTMLElement, data: Data) {
  const c = data.copy;
  const $ = <T extends HTMLElement>(sel: string) => root.querySelector<T>(sel);
  const $$ = <T extends HTMLElement>(sel: string) => Array.from(root.querySelectorAll<T>(sel));

  const blank = (): State => ({
    v: 1,
    step: 0,
    sub: 0,
    eventId: "",
    name: "",
    extra: "",
    title: "",
    titleEdited: false,
    answers: {},
    modes: {},
    choices: {},
    photos: {},
    details: { date: "", guests: "" },
    host: "auto",
    pkg: "basic",
    email: "",
    consent: false,
    orderId: "",
    token: "",
  });

  // /create/?new starts from a clean slate (the saved draft and the last order number are dropped)
  if (new URLSearchParams(location.search).has("new")) {
    try {
      localStorage.removeItem(KEY);
      localStorage.removeItem(ORDER_KEY);
    } catch {
      /* ignore */
    }
    history.replaceState(null, "", location.pathname);
  }
  let state = load();
  // The image files live in memory only (a reload loses them and the card asks to pick the photo again).
  // They are sent once, with the order.
  const photoFiles = new Map<string, { file: File; url: string }>();
  const tracked = new Set<string>();

  function load(): State {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw) as State;
        if (s && s.v === 1) {
          const st = { ...blank(), ...s };
          if (Array.isArray(st.photos)) st.photos = {}; // drafts from the older photo screens
          return st;
        }
      }
    } catch {
      /* private mode or blocked storage: the prototype still works, it just does not resume */
    }
    return blank();
  }
  let saveTimer = 0;
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
    const el = $("[data-save]");
    if (el && state.step > 0) {
      el.textContent = c.save;
      window.clearTimeout(saveTimer);
      saveTimer = window.setTimeout(() => (el.textContent = ""), 2500);
    }
  }

  const event = () => data.events.find((e) => e.id === state.eventId);
  /** The event's wording and questions, plus the closing "anything else?" question that every event gets. */
  const shape = (): ShapeConfig => {
    const sc = { ...data.shapes[event()?.shape ?? "person"], ...(event()?.override || {}) };
    return { ...sc, prompts: [...sc.prompts, c.more.extra] };
  };
  const subjectName = () => state.name.trim() || c.ui.someone;
  const target = () => event()?.target ?? 9;

  // ---------- material meter ----------
  const modeOf = (id: string) => state.modes[id] || "free";
  const choiceDone = (id: string) => {
    const ch = state.choices[id];
    return !!ch && (id !== c.more.extra.id || !!ch.q.trim()) && ch.answers.length === 4 && ch.answers.every((a) => a.trim()) && ch.correct >= 0;
  };
  /** A story is usable when it has text (free mode) or a complete question with four answers (choice mode). */
  const isDone = (id: string) =>
    modeOf(id) === "choice" ? choiceDone(id) : (state.answers[id] || "").trim().length >= data.material.minChars;
  function answeredPrompts(): Prompt[] {
    return shape().prompts.filter((p) => isDone(p.id));
  }
  function questionsReady(): number {
    const m = data.material;
    let n = 0;
    for (const p of shape().prompts) {
      if (modeOf(p.id) === "choice") {
        if (choiceDone(p.id)) n += 1;
        continue;
      }
      const len = (state.answers[p.id] || "").trim().length;
      if (len >= m.minChars) n += Math.min(m.maxPerPrompt, Math.max(1, Math.round(len / m.charsPerQuestion)));
    }
    n += Object.keys(state.photos).length * m.perPhoto;
    return Math.min(target(), n);
  }

  // ---------- navigation ----------
  /** Step 3: one screen per story question (the last one is "anything else?"). Every other step is one screen. */
  const subCount = (step: number) => (step === 3 ? shape().prompts.length : 1);
  const need = () => Math.max(0, data.material.minPrompts - answeredPrompts().length);
  function show(step: number, sub = 0, push = true) {
    step = Math.max(0, Math.min(MAX_STEP, step));
    if (step >= 2 && !state.eventId) step = 1;
    if (step === 6 && !state.orderId) step = 5;
    sub = Math.max(0, Math.min(subCount(step) - 1, sub));
    state.step = step;
    state.sub = sub;
    $$<HTMLElement>("[data-step]").forEach((s) => (s.hidden = Number(s.dataset.step) !== step));
    renderBar(step);
    renderStep(step);
    renderProgress(step);
    const hash = `#s${step}-${sub}`;
    if (push) history.pushState({ step, sub }, "", hash);
    else history.replaceState({ step, sub }, "", hash);
    save();
    window.scrollTo({ top: 0 });
    $<HTMLElement>(`[data-step="${step}"] [tabindex="-1"]`)?.focus({ preventScroll: true });
    track("create_step", { step, sub, event: state.eventId });
  }
  function forward() {
    if (state.sub < subCount(state.step) - 1) return show(state.step, state.sub + 1);
    if (state.step === 3 && need() > 0) {
      $("[data-more-need-text]")!.textContent = fill(c.stories.needMore, { n: need() });
      $<HTMLElement>("[data-more-need]")!.hidden = false;
      return;
    }
    show(state.step + 1);
  }
  const backward = () => (state.sub > 0 ? show(state.step, state.sub - 1) : show(state.step - 1, subCount(state.step - 1) - 1));

  // The bottom bar is one element for every step, so "back" and the main button never move.
  const bar = $<HTMLElement>("[data-bar]")!;
  const barNext = $<HTMLButtonElement>("[data-bar-next]")!;
  const pkg = () => data.packages.find((p) => p.id === state.pkg) || data.packages[0];
  const orderLabel = () => fill(c.order.cta, { price: pkg().price });
  function renderBar(step: number) {
    bar.hidden = step === 0 || step === 6;
    // on wide screens step 5 pays from the order summary, so the bar hides its button there (CSS reads this)
    bar.dataset.step = String(step);
    $<HTMLElement>("[data-bar-meter]")!.hidden = step !== 3;
    barNext.dataset.next = String(step);
    barNext.setAttribute("aria-disabled", "false");
    barSkip.hidden = true;
    barNext.hidden = step === 1 && !state.eventId;
    barNext.textContent = step === 4 ? c.details.cta : step === 5 ? orderLabel() : c.next;
  }
  $<HTMLElement>("[data-bar-back]")!.addEventListener("click", backward);
  const barSkip = $<HTMLButtonElement>("[data-bar-skip]")!;
  barSkip.addEventListener("click", forward);

  function renderProgress(step: number) {
    const nav = $("[data-progress]");
    if (!nav) return;
    nav.hidden = step === 0 || step === 6;
    // every screen counts the same, so the line moves on each "next"
    let done = 0;
    let total = 0;
    for (let i = 1; i <= 5; i++) {
      if (i < step) done += subCount(i);
      total += subCount(i);
    }
    const pct = Math.round(((done + state.sub + 1) / total) * 100);
    nav.setAttribute("aria-valuenow", String(pct));
    $<HTMLElement>("[data-progress-bar]")!.style.width = `${pct}%`;
  }

  function renderStep(step: number) {
    if (step >= 2) applyShapeText();
    if (step === 1) renderEvents();
    if (step === 2) renderWho();
    if (step === 3) renderStories();
    if (step === 4) renderHosts();
    if (step === 5) renderOrder();
  }

  function applyShapeText() {
    const sc = shape() as unknown as Record<string, string>;
    $$<HTMLElement>("[data-t]").forEach((el) => {
      const key = el.dataset.t || "";
      el.textContent = fill(sc[key] || "", { name: subjectName() });
    });
  }

  // ---------- 1: events ----------
  function renderEvents() {
    $$<HTMLButtonElement>("[data-event]").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.event === state.eventId)));
  }

  // ---------- 2: who ----------
  const nameIn = $<HTMLInputElement>("#f-name")!;
  const extraIn = $<HTMLInputElement>("#f-extra")!;
  function renderWho() {
    nameIn.placeholder = shape().namePlaceholder;
    extraIn.placeholder = shape().extraPlaceholder;
    nameIn.value = state.name;
    extraIn.value = state.extra;
    syncTitle();
  }
  /** The default title is only a placeholder (grey, behind the field). The field holds text only if the creator typed one. */
  function defaultTitle() {
    return fill(shape().title, { name: state.name.trim() || "..." });
  }
  function syncTitle() {
    if (!state.titleEdited) state.title = defaultTitle();
    $("[data-title-preview]")!.textContent = state.title;
  }
  // The game title is edited in place: "change the name" (or a click on the title) selects the text on the screen itself.
  const titleView = $<HTMLElement>("[data-title-preview]")!;
  function editTitle() {
    if (titleView.isContentEditable) return;
    titleView.contentEditable = "plaintext-only";
    if (!titleView.isContentEditable) titleView.contentEditable = "true"; // older browsers
    titleView.focus();
    const range = document.createRange();
    range.selectNodeContents(titleView);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }
  $<HTMLButtonElement>("[data-title-edit]")!.addEventListener("click", editTitle);
  titleView.addEventListener("click", editTitle);
  titleView.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === "Escape") {
      e.preventDefault();
      titleView.blur();
    }
  });
  titleView.addEventListener("input", () => {
    const text = (titleView.textContent || "").replace(/\s+/g, " ").slice(0, 80);
    state.titleEdited = text.trim() !== "" && text.trim() !== defaultTitle();
    state.title = state.titleEdited ? text.trim() : defaultTitle();
    save();
  });
  titleView.addEventListener("blur", () => {
    titleView.contentEditable = "false";
    titleView.textContent = state.title; // an emptied title falls back to the suggested one
  });
  nameIn.addEventListener("input", () => {
    state.name = nameIn.value;
    syncTitle();
    nameIn.removeAttribute("aria-invalid");
    $("#f-name-err")!.hidden = true;
    save();
  });
  extraIn.addEventListener("input", () => {
    state.extra = extraIn.value;
    save();
  });

  // ---------- 3: stories ----------
  const promptsEl = $<HTMLElement>("[data-prompts]")!;
  // A story counts as "answered" (the green mark) once the creator leaves the box or presses save.
  // The text itself is autosaved on every keystroke.
  const committed = new Set<string>();
  let committedInit = false;
  const hasText = (id: string) => isDone(id);
  function commit(id: string) {
    if (!hasText(id)) {
      committed.delete(id);
    } else {
      committed.add(id);
      if (!tracked.has(id)) {
        tracked.add(id);
        track("create_prompt_answered", { prompt: id, event: state.eventId });
      }
    }
    const box = promptsEl.querySelector<HTMLElement>(`[data-prompt="${id}"]`);
    if (box) {
      box.dataset.answered = String(committed.has(id));
      const mark = box.querySelector(".in-prompt__mark");
      if (mark) mark.textContent = committed.has(id) ? "✓ " + c.stories.answered : "";
    }
  }
  // voice input (Web Speech API): the mic button is hidden where the browser does not support it
  type Rec = { lang: string; interimResults: boolean; continuous: boolean; start(): void; stop(): void; onresult: ((e: any) => void) | null; onerror: ((e: any) => void) | null; onend: (() => void) | null };
  const SR = ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) as (new () => Rec) | undefined;
  function renderStories() {
    if (!committedInit) {
      shape().prompts.forEach((p) => hasText(p.id) && committed.add(p.id));
      committedInit = true;
    }
    const all = shape().prompts;
    const cur = all[state.sub];
    const isExtra = cur.id === c.more.extra.id;
    const hub = false;
    $<HTMLElement>("[data-more-need]")!.hidden = true;
    const name = subjectName();
    $("[data-story-count]")!.textContent = isExtra
      ? fill(c.more.unlocked, { n: questionsReady(), name })
      : fill(c.more.count, { i: state.sub + 1, n: all.length - 1 });
    $("[data-story-title]")!.textContent = fill(cur.label, { name });
    $("[data-story-lead]")!.textContent = fill(cur.hint, { name });
    const tip = $<HTMLElement>("[data-story-tip]")!;
    tip.textContent = shape().storiesLead;
    tip.hidden = state.sub !== 0;
    promptsEl.innerHTML = "";
    for (const p of hub ? [] : [cur]) {
      const answered = committed.has(p.id);
      const open = true;
      const box = document.createElement("div");
      box.className = "in-prompt";
      box.dataset.answered = String(answered);
      box.dataset.prompt = p.id;
      const label = fill(p.label, { name: subjectName() });
      const choice = modeOf(p.id) === "choice";
      const cv = state.choices[p.id] || { q: "", answers: ["", "", "", ""], correct: -1 };
      // the suggested question is only a grey hint: an older draft that stored it as text shows it as a hint too
      const typedQ = cv.q.trim() === label ? "" : cv.q;
      const photoLabel = photoFiles.has(p.id) ? c.stories.photoReplace : state.photos[p.id] ? c.stories.photosAgain : c.stories.photoAttach;
      const attach = `<label class="in-tool in-attach" title="${esc(photoLabel)}"><span aria-hidden="true">📷</span><span class="sr-only">${esc(photoLabel)}</span><input type="file" accept="image/*" class="sr-only" data-attach="${p.id}" /></label>
            ${photoFiles.has(p.id) ? `<span class="in-attached"><img src="${photoFiles.get(p.id)!.url}" alt="" /><button type="button" data-attach-remove="${p.id}" aria-label="${c.stories.photoRemove}">✕</button></span>` : ""}`;
      box.innerHTML = `
        <span class="in-prompt__mark" hidden></span>
        <div class="in-prompt__body" id="pb-${p.id}" ${open ? "" : "hidden"}>
          ${
            choice
              ? `<label class="in-help" for="cq-${p.id}">${c.stories.choiceQuestion}</label>
                 <input id="cq-${p.id}" class="in-input" type="text" maxlength="120" value="${esc(typedQ)}" placeholder="${esc(p.id === c.more.extra.id ? c.more.extraQuestion : label)}" aria-label="${c.stories.choiceQuestion}" data-cq="${p.id}" />
                 <p class="in-help">${c.stories.choiceHelp}</p>
                 <div class="in-own-answers">${[0, 1, 2, 3]
                   .map(
                     (k) => `<div class="in-own-row"><input class="in-input" type="text" maxlength="60" value="${esc(cv.answers[k] || "")}" data-cans="${p.id}:${k}" aria-label="${c.stories.answer} ${k + 1}" placeholder="${c.stories.answer} ${k + 1}" />
                       <label class="in-own-correct"><input type="radio" name="pcor-${p.id}" value="${k}" data-ccor="${p.id}" ${cv.correct === k ? "checked" : ""} /><span>${c.stories.correctShort}</span></label></div>`,
                   )
                   .join("")}</div>
                 <div class="in-prompt__row">${attach}</div>`
              : `<div class="in-answer">
            <div class="in-rec" data-rec="${p.id}" role="status" hidden>
              <span class="in-rec__dot" aria-hidden="true"></span>
              <span>${c.stories.recording}</span>
              <span class="in-rec__bars" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
              <span class="in-rec__time" data-mic-time="${p.id}">0:00</span>
            </div>
            <textarea class="in-textarea" id="pt-${p.id}" placeholder="${esc(p.placeholder)}" aria-label="${esc(label)}">${esc(state.answers[p.id] || "")}</textarea>
            <div class="in-answer__tools">
              <button type="button" class="in-tool in-mic" aria-pressed="false" data-mic="${p.id}" hidden></button>
              ${attach}
              <span class="in-answer__hint">${SR ? c.stories.toolsHint : c.stories.photoAttach}</span>
            </div>
          </div>`
          }
          <p class="in-err" role="alert" data-attach-err hidden></p>
          ${choice ? "" : `<p class="in-rec__heard" data-mic-heard="${p.id}" aria-live="polite"></p>
          <p class="in-err" role="alert" data-mic-err="${p.id}" hidden></p>`}
          <button type="button" class="in-switch" data-pswitch="${p.id}" data-to="${choice ? "free" : "choice"}">${choice ? c.stories.toFree : c.stories.toChoice}</button>
        </div>`;
      promptsEl.append(box);
      if (!choice) setupMic(box, p.id);
    }
    renderMeter();
  }
  // a photo attached to the question: opened once to make sure the browser can read it, sent with the order
  promptsEl.addEventListener("change", (e) => {
    const t = e.target as HTMLInputElement;
    const id = t.dataset.attach;
    const f = t.files?.[0];
    if (!id || !f) return;
    const fail = (msg: string) => {
      const err = promptsEl.querySelector<HTMLElement>("[data-attach-err]");
      if (err) {
        err.textContent = msg;
        err.hidden = false;
      }
    };
    if (!state.photos[id] && Object.keys(state.photos).length >= data.material.maxPhotos) return fail(c.stories.photoMax);
    void readablePhoto(f, () => fail(c.stories.photoConverting)).then(
      (file) => {
        photoFiles.set(id, { file, url: URL.createObjectURL(file) });
        state.photos[id] = file.name;
        renderStories();
        save();
      },
      () => fail(c.stories.photosBad),
    );
  });
  /**
   * A photo the browser can draw. iPhone photos are often HEIC, which only Safari opens: those are converted to JPG
   * in the browser first (the converter, about 1 MB, is downloaded only when such a photo is picked).
   */
  async function readablePhoto(f: File, onConverting: () => void): Promise<File> {
    try {
      (await createImageBitmap(f)).close();
      return f;
    } catch {
      /* not drawable here: maybe HEIC */
    }
    const looksHeic = /^image\/hei[cf]/i.test(f.type) || /\.hei[cf]$/i.test(f.name);
    const { heicTo, isHeic } = await import("heic-to");
    if (!looksHeic && !(await isHeic(f))) throw new Error("unreadable");
    onConverting();
    const jpg = await heicTo({ blob: f, type: "image/jpeg", quality: 0.85 });
    const file = new File([jpg], f.name.replace(/\.[^.]*$/, "") + ".jpg", { type: "image/jpeg" });
    (await createImageBitmap(file)).close();
    return file;
  }
  // "make it a multiple-choice question" / "write it as a story instead"
  promptsEl.addEventListener("click", (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>("[data-pswitch]");
    if (!b) return;
    const id = b.dataset.pswitch!;
    state.modes[id] = b.dataset.to as "free" | "choice";
    if (b.dataset.to === "choice") ensureChoice(id);
    commit(id);
    renderStories();
    save();
    promptsEl.querySelector<HTMLElement>("textarea, [data-cq]")?.focus();
  });
  promptsEl.addEventListener("click", (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>("[data-attach-remove]");
    if (!b) return;
    const id = b.dataset.attachRemove!;
    photoFiles.delete(id);
    delete state.photos[id];
    renderStories();
    save();
  });
  // choice mode: mode switch, question, four answers, correct mark
  const ensureChoice = (id: string) => (state.choices[id] ||= { q: "", answers: ["", "", "", ""], correct: -1 });
  promptsEl.addEventListener("change", (e) => {
    const t = e.target as HTMLInputElement;
    if (t.dataset.pmode !== undefined) {
      const id = t.dataset.pmode;
      state.modes[id] = t.value as "free" | "choice";
      if (t.value === "choice") ensureChoice(id);
      commit(id);
      renderStories();
      save();
    } else if (t.dataset.ccor !== undefined) {
      ensureChoice(t.dataset.ccor).correct = Number(t.value);
      if (isDone(t.dataset.ccor)) commit(t.dataset.ccor);
      renderMeter();
      save();
    }
  });
  promptsEl.addEventListener("input", (e) => {
    const t = e.target as HTMLInputElement;
    if (t.dataset.cq !== undefined) ensureChoice(t.dataset.cq).q = t.value;
    else if (t.dataset.cans !== undefined) {
      const [id, k] = t.dataset.cans.split(":");
      ensureChoice(id).answers[Number(k)] = t.value;
    } else return;
    const id = (t.dataset.cq ?? t.dataset.cans!.split(":")[0]) as string;
    if (!isDone(id) && committed.has(id)) commit(id);
    renderMeter();
    save();
  });
  promptsEl.addEventListener("input", (e) => {
    const ta = e.target as HTMLTextAreaElement;
    if (!ta.id.startsWith("pt-")) return;
    const id = ta.id.slice(3);
    state.answers[id] = ta.value;
    if (!hasText(id) && committed.has(id)) commit(id); // emptied: no longer answered
    renderMeter();
    save();
  });
  // leaving the box saves it and marks the story as answered
  promptsEl.addEventListener("focusout", (e) => {
    const ta = e.target as HTMLTextAreaElement;
    const cid = (ta as HTMLElement).dataset?.cq ?? (ta as HTMLElement).dataset?.cans?.split(":")[0];
    const id = cid ?? (ta.id && ta.id.startsWith("pt-") ? ta.id.slice(3) : "");
    if (!id) return;
    if (hasText(id) && !committed.has(id)) {
      commit(id);
      renderMeter();
      save();
    }
  });

  function renderMeter() {
    const ready = questionsReady();
    const t = target();
    const text = $("[data-meter-text]");
    if (text) text.textContent = fill(c.stories.counter, { n: ready, total: t });
    const meterBar = $<HTMLElement>("[data-meter-bar]");
    if (meterBar) meterBar.style.width = `${(ready / t) * 100}%`;
    if (state.step !== 3) return;
    // the meter shows once there is something to count; "continue" lights up once this screen has an answer
    $<HTMLElement>("[data-bar-meter]")!.hidden = ready === 0;
    const id = shape().prompts[state.sub].id;
    const has = isDone(id) || !!state.photos[id];
    barNext.textContent = c.next;
    barNext.setAttribute("aria-disabled", String(!has));
    barSkip.hidden = has;
    if (id === c.more.extra.id) $("[data-story-count]")!.textContent = fill(c.more.unlocked, { n: ready, name: subjectName() });
    if (need() === 0) $<HTMLElement>("[data-more-need]")!.hidden = true;
  }

  // voice input (Web Speech API). Hidden where the browser does not support it.
  let activeRec: Rec | null = null;
  function setupMic(box: HTMLElement, id: string) {
    const btn = box.querySelector<HTMLButtonElement>(`[data-mic="${id}"]`)!;
    const timeEl = box.querySelector<HTMLElement>(`[data-mic-time="${id}"]`)!;
    const recEl = box.querySelector<HTMLElement>(`[data-rec="${id}"]`)!;
    const heardEl = box.querySelector<HTMLElement>(`[data-mic-heard="${id}"]`)!;
    const errEl = box.querySelector<HTMLElement>(`[data-mic-err="${id}"]`)!;
    const ta = box.querySelector<HTMLTextAreaElement>("textarea")!;
    const idle = () => {
      btn.textContent = "🎤";
      btn.setAttribute("aria-label", c.stories.mic);
    };
    idle();
    if (!SR) return; // stays hidden, typing is always possible
    btn.hidden = false;
    let timer = 0;
    let heard = false;
    btn.addEventListener("click", () => {
      errEl.hidden = true;
      if (activeRec) {
        activeRec.stop();
        return;
      }
      const rec = new SR();
      rec.lang = c.ui.speechLang;
      rec.interimResults = true;
      rec.continuous = true;
      const base = ta.value;
      let finalText = "";
      let secs = 0;
      heard = false;
      rec.onresult = (e: any) => {
        let interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) finalText += e.results[i][0].transcript + " ";
          else interim += e.results[i][0].transcript;
        }
        heardEl.textContent = interim ? `${c.stories.heard} ${interim}` : "";
        if (interim) heard = true;
        if (finalText.trim()) {
          heard = true;
          ta.value = (base ? base.trimEnd() + " " : "") + finalText.trim();
          ta.dispatchEvent(new Event("input", { bubbles: true }));
        }
      };
      rec.onerror = (e: any) => {
        const code = String(e?.error || "");
        if (code === "not-allowed" || code === "service-not-allowed") showErr(c.stories.micDenied);
        else if (code === "no-speech") showErr(c.stories.micEmpty);
      };
      rec.onend = () => {
        window.clearInterval(timer);
        btn.setAttribute("aria-pressed", "false");
        idle();
        recEl.hidden = true;
        heardEl.textContent = "";
        ta.removeAttribute("data-recording");
        if (!heard && errEl.hidden) showErr(c.stories.micEmpty);
        activeRec = null;
      };
      const showErr = (m: string) => {
        errEl.textContent = m; // next to the mic button, not at the bottom of the page
        errEl.hidden = false;
      };
      try {
        rec.start();
      } catch {
        showErr(c.stories.micDenied);
        return;
      }
      activeRec = rec;
      btn.setAttribute("aria-pressed", "true");
      btn.textContent = "■";
      btn.setAttribute("aria-label", c.stories.micStop);
      recEl.hidden = false;
      ta.dataset.recording = "true";
      timeEl.textContent = "0:00";
      timer = window.setInterval(() => {
        secs += 1;
        timeEl.textContent = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
      }, 1000);
    });
  }

  // ---------- 4: host ----------
  function renderHosts() {
    const hostsEl = $<HTMLElement>("[data-hosts]")!;
    hostsEl.innerHTML = data.hosts
      .map(
        (h) => `<button type="button" class="in-host" role="radio" aria-checked="${state.host === h.id}" data-host="${h.id}">
          ${h.image ? `<img src="${h.image}" alt="" width="520" height="650" loading="lazy" />` : `<span class="in-host__ph" aria-hidden="true">🎲</span>`}
          <span class="in-host__info"><span class="in-host__tick" aria-hidden="true"></span><span><strong>${esc(h.name)}</strong><span>${esc(h.line)}</span></span></span>
        </button>`,
      )
      .join("");
    showHostLine();
  }
  function showHostLine() {
    const h = data.hosts.find((x) => x.id === state.host);
    $("[data-host-line]")!.textContent = h ? `${h.name}: ${h.line}` : "";
  }
  root.addEventListener("click", (e) => {
    const h = (e.target as HTMLElement).closest<HTMLElement>("[data-host]");
    if (!h) return;
    state.host = h.dataset.host || "auto";
    $$<HTMLElement>("[data-host]").forEach((b) => b.setAttribute("aria-checked", String(b === h)));
    showHostLine();
    save();
  });

  // ---------- 5: summary, contact, order ----------
  const orderForm = $<HTMLFormElement>("[data-order-form]")!;
  const orderErr = $<HTMLElement>("[data-order-err]")!;
  // two pay buttons with one job: the bottom bar's (phones) and the order summary's (wide screens)
  const payBtns = [barNext, $<HTMLButtonElement>("[data-order-pay]")!];
  const setPay = (text: string, busy = false) =>
    payBtns.forEach((b) => {
      b.textContent = text;
      if (busy) b.setAttribute("aria-busy", "true");
      else b.removeAttribute("aria-busy");
    });
  const consentIn = $<HTMLInputElement>("[data-order-consent]")!;
  const agreeRow = $<HTMLElement>("[data-agree]")!;
  const consentErr = $<HTMLElement>("#o-consent-err")!;
  const emailIn = $<HTMLInputElement>("#o-email")!;
  const emailErr = $<HTMLElement>("#o-email-err")!;
  function setEmailErr(on: boolean) {
    emailErr.hidden = !on;
    if (on) emailIn.setAttribute("aria-invalid", "true");
    else emailIn.removeAttribute("aria-invalid");
    emailIn.setAttribute("aria-describedby", on ? "o-email-hint o-email-err" : "o-email-hint");
  }
  function setConsentErr(on: boolean) {
    consentErr.hidden = !on;
    agreeRow.classList.toggle("is-invalid", on);
    if (on) consentIn.setAttribute("aria-describedby", "o-consent-err");
    else consentIn.removeAttribute("aria-describedby");
  }
  const missingPhotos = () => Object.keys(state.photos).filter((id) => !photoFiles.has(id)).length;
  const hostName = () => data.hosts.find((h) => h.id === state.host)?.name || "";
  function renderOrder() {
    $("[data-ticket-title]")!.textContent = state.title;
    $("[data-ticket-meta]")!.textContent =
      fill(c.order.meta, { event: event()?.label || "", host: hostName(), n: questionsReady() }) +
      (photoFiles.size === 1 ? c.order.metaPhoto : photoFiles.size ? fill(c.order.metaPhotos, { n: photoFiles.size }) : "");
    $<HTMLElement>("[data-photos-missing]")!.hidden = missingPhotos() === 0;
    // the agreement asks about photos only when photos travel with the order
    $("[data-consent-text]")!.textContent = photoFiles.size ? c.order.consent : c.order.consentNoPhotos;
    emailIn.value = state.email;
    consentIn.checked = state.consent;
    orderErr.hidden = true;
    setEmailErr(false);
    setConsentErr(false);
    renderPkg();
  }
  function renderPkg() {
    $$<HTMLInputElement>("[data-pkg]").forEach((r) => (r.checked = r.value === pkg().id));
    $("[data-price]")!.textContent = pkg().price;
    $("[data-order-item]")!.textContent = fill(c.order.item, { name: pkg().name });
    $("[data-order-item-price]")!.textContent = pkg().price;
    if (state.step === 5 && !sending) setPay(orderLabel());
  }
  orderForm.addEventListener("input", (e) => {
    const el = e.target as HTMLInputElement;
    if (el === emailIn) {
      state.email = el.value;
      setEmailErr(false);
    } else if (el === consentIn) {
      state.consent = el.checked;
      setConsentErr(false);
    }
    else if (el.dataset.pkg !== undefined) {
      state.pkg = el.value;
      renderPkg();
      save();
      return;
    } else return;
    el.removeAttribute("aria-invalid");
    save();
  });

  /** Attached photos in question order; `field` is the form field the file travels in (photo-1 … photo-5). */
  function photoList() {
    return shape()
      .prompts.filter((p) => photoFiles.has(p.id))
      .map((p, i) => ({ id: p.id, field: `photo-${i + 1}`, label: fill(p.label, { name: subjectName() }), name: state.photos[p.id], file: photoFiles.get(p.id)!.file }));
  }
  function brief() {
    const d = state.details;
    return {
      orderId: state.orderId,
      package: pkg().id,
      eventType: state.eventId,
      subjectShape: event()?.shape,
      subject: { name: state.name.trim(), ageOrRole: state.extra.trim() },
      title: state.title,
      stories: shape().prompts
        .filter((p) => (modeOf(p.id) === "choice" ? choiceDone(p.id) : (state.answers[p.id] || "").trim()))
        .map((p) =>
          modeOf(p.id) === "choice"
            ? { promptId: p.id, prompt: state.choices[p.id].q.trim() || fill(p.label, { name: subjectName() }), type: "choice", answers: state.choices[p.id].answers.map((a) => a.trim()), correct: state.choices[p.id].correct }
            : { promptId: p.id, prompt: fill(p.label, { name: subjectName() }), type: "free", text: state.answers[p.id].trim() },
        ),
      photos: photoList().map((x) => ({ field: x.field, promptId: x.id, prompt: x.label, file: x.name })),
      logistics: { date: d.date || null, guests: d.guests ? Number(d.guests) : null },
      contact: { email: state.email.trim() },
      host: state.host,
      questionCount: target(),
      materialReady: questionsReady(),
      consent: { factsAndPhotos: state.consent },
    };
  }
  function briefText(): string {
    const b = brief();
    const lines = [`Package: ${pkg().name}`, `Event: ${event()?.label}`, `About: ${b.subject.name}${b.subject.ageOrRole ? " (" + b.subject.ageOrRole + ")" : ""}`, `Game title: ${b.title}`, "", "Stories:"];
    b.stories.forEach((s) => lines.push(`- ${s.prompt}: ${s.type === "choice" ? (s.answers || []).map((a, i) => (i === s.correct ? "*" : "") + a).join(" / ") : s.text}`));
    if (b.photos.length) {
      lines.push("", "Photos:");
      b.photos.forEach((x) => lines.push(`- ${x.field}: ${x.prompt}`));
    }
    const l = b.logistics;
    const extra = [l.date && `Date: ${l.date}`, l.guests && `Guests: ${l.guests}`].filter(Boolean);
    if (extra.length) lines.push("", ...(extra as string[]));
    lines.push("", `Host: ${hostName()}`, "(* marks the correct answer)");
    return lines.join("\n");
  }
  /** Phone photos are several MB each; the form accepts a few MB in total, so each is scaled down first. */
  async function shrink(file: File): Promise<Blob> {
    try {
      const bmp = await createImageBitmap(file);
      const k = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
      const cv = document.createElement("canvas");
      cv.width = Math.round(bmp.width * k);
      cv.height = Math.round(bmp.height * k);
      cv.getContext("2d")!.drawImage(bmp, 0, 0, cv.width, cv.height);
      const blob = await new Promise<Blob | null>((res) => cv.toBlob(res, "image/jpeg", 0.82));
      // The server accepts only JPEG, PNG, WebP and GIF: keep the original only if it is one of those and smaller.
      const keep = /^image\/(jpeg|png|webp|gif)$/.test(file.type) && (!blob || file.size <= blob.size);
      return keep || !blob ? file : blob;
    } catch {
      return file;
    }
  }
  let sending = false;
  orderForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (sending) return;
    const badEmail = !emailIn.value.trim() || !emailIn.validity.valid;
    const noConsent = !consentIn.checked;
    setEmailErr(badEmail);
    setConsentErr(noConsent);
    if (badEmail || noConsent) {
      (badEmail ? emailIn : consentIn).focus();
      return;
    }
    sending = true;
    orderErr.hidden = true;
    setPay(c.order.sending, true);
    // one id per draft, so pressing again after a closed checkout does not create a second order
    state.token ||= crypto.randomUUID();
    state.orderId ||= "TD-" + Date.now().toString(36).toUpperCase().slice(-6) + Math.random().toString(36).slice(2, 5).toUpperCase();
    save();
    try {
      const b = brief();
      const d = state.details;
      const fd = new FormData();
      const fields: Record<string, string> = {
        "order-id": state.orderId,
        token: state.token,
        package: pkg().id,
        email: state.email.trim(),
        event: event()?.label || "",
        about: `${b.subject.name}${b.subject.ageOrRole ? " (" + b.subject.ageOrRole + ")" : ""}`,
        "game-title": state.title,
        host: hostName(),
        "event-date": d.date,
        guests: d.guests,
        brief: briefText(),
        "brief-json": JSON.stringify(b),
      };
      Object.entries(fields).forEach(([k, v]) => fd.append(k, v));
      for (const x of photoList()) {
        const blob = await shrink(x.file);
        fd.append(x.field, blob, blob === x.file ? x.file.name : x.file.name.replace(/\.[^.]*$/, "") + ".jpg");
      }
      const res = await fetch("/api/order", { method: "POST", body: fd });
      if (!res.ok) throw new Error(String(res.status));
      try {
        localStorage.setItem(ORDER_KEY, JSON.stringify({ id: state.orderId, event: state.eventId, at: Date.now() }));
      } catch {
        /* ignore */
      }
      track("create_order_submit", { event: state.eventId, package: pkg().id, photos: photoFiles.size });
      const priceId = data.checkout.prices[pkg().id];
      if (data.checkout.token && priceId) {
        try {
          await openCheckout(priceId);
        } catch (x) {
          track("create_checkout_error", { error: String(x) });
          orderErr.textContent = c.order.errPay;
          orderErr.hidden = false;
        }
      } else show(6);
    } catch (x) {
      track("create_order_error", { error: String(x) });
      orderErr.textContent = c.order.errSend;
      orderErr.hidden = false;
    } finally {
      sending = false;
      if (state.step === 5) setPay(orderLabel());
      else payBtns.forEach((b) => b.removeAttribute("aria-busy"));
    }
  });

  // ---------- Paddle checkout (overlay on this page) ----------
  let paddleReady: Promise<any> | null = null;
  function loadPaddle(): Promise<any> {
    paddleReady ||= new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
      s.onload = () => {
        const P = window.Paddle;
        if (!P) return reject(new Error("paddle-missing"));
        if (data.checkout.env === "sandbox") P.Environment.set("sandbox");
        P.Initialize({
          token: data.checkout.token,
          eventCallback: (ev: { name?: string }) => {
            if (ev?.name === "checkout.completed") track("create_paid", { order: state.orderId, package: pkg().id });
          },
        });
        resolve(P);
      };
      s.onerror = () => {
        paddleReady = null;
        reject(new Error("paddle-load"));
      };
      document.head.append(s);
    });
    return paddleReady;
  }
  async function openCheckout(priceId: string) {
    const P = await loadPaddle();
    track("create_checkout_open", { package: pkg().id });
    P.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customer: { email: state.email.trim() },
      customData: { orderId: state.orderId, package: pkg().id },
      settings: {
        displayMode: "overlay",
        theme: "dark",
        locale: "en",
        successUrl: `${location.origin}/create/thanks/?order=${encodeURIComponent(state.orderId)}`,
      },
    });
  }

  // ---------- global clicks ----------
  root.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    const ev = t.closest<HTMLElement>("[data-event]");
    if (ev) {
      const changed = state.eventId !== ev.dataset.event;
      state.eventId = ev.dataset.event!;
      if (changed) {
        // a different event can change the shape: keep what was typed, drop the title default and prompts' open state
        if (!state.titleEdited) state.title = "";
      }
      renderEvents();
      const tiles = ev.parentElement!;
      tiles.dataset.picked = "";
      window.setTimeout(() => {
        delete tiles.dataset.picked;
        show(2);
      }, 380);
      return;
    }
    const go = t.closest<HTMLElement>("[data-go]");
    if (go) {
      if (go.dataset.go === "1" && state.step === 0) track("create_start");
      show(Number(go.dataset.go));
      return;
    }
    const nx = t.closest<HTMLElement>("[data-next]");
    if (nx) {
      const from = Number(nx.dataset.next);
      if (from === 5) {
        orderForm.requestSubmit();
        return;
      }
      if (nx.getAttribute("aria-disabled") === "true") return;
      if (from === 3) {
        const id = shape().prompts[state.sub].id;
        if (isDone(id)) commit(id);
      }
      if (from === 2 && !state.name.trim()) {
        nameIn.setAttribute("aria-invalid", "true");
        $("#f-name-err")!.hidden = false;
        nameIn.focus();
        return;
      }
      forward();
      return;
    }
    if (t.closest("[data-first-empty]")) {
      const i = shape().prompts.findIndex((p) => !isDone(p.id));
      show(3, Math.max(0, i));
      return;
    }
    if (t.closest("[data-restart]")) {
      if (!window.confirm(c.restart + "?")) return;
      state = blank();
      photoFiles.clear();
      save();
      show(0);
      return;
    }
  });

  // Back button returns to the previous stage without wiping anything (state is saved on every change).
  window.addEventListener("popstate", (e) => {
    const [s, sub] = e.state && typeof e.state.step === "number" ? [e.state.step, e.state.sub || 0] : parseHash();
    show(s, sub, false);
  });
  function parseHash(): [number, number] {
    const m = /^#s(\d)(?:-(\d+))?$/.exec(location.hash);
    return m ? [Number(m[1]), Number(m[2] || 0)] : [state.step, state.sub];
  }

  show(state.step, state.sub, false);
}

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch] as string);
}
