/**
 * Order flow logic (/start). The draft lives in this browser (localStorage) until the order is sent.
 * Steps: 0 start + price, 1 event, 2 who, 3 stories, 4 event details + host, 5 summary + contact + order,
 * 6 "payment link not connected" (only while paymentUrl is empty).
 * Sending the order posts the brief and the photos to Netlify Forms (form "order"), then goes to the payment page.
 */
import { track } from "../lib/analytics";
import { fill } from "../content/intake.he";
import type { EventTile, Shape, ShapeConfig, Prompt } from "../content/intake.he";

interface Host {
  id: string;
  name: string;
  line: string;
  image: string;
}
interface Data {
  events: EventTile[];
  shapes: Record<Shape, ShapeConfig>;
  hosts: Host[];
  material: { minChars: number; charsPerQuestion: number; maxPerPrompt: number; perPhoto: number; maxPhotos: number; minPrompts: number };
  copy: typeof import("../content/intake.he").INTAKE;
  price: string;
  paymentUrl: string;
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
  photos: { name: string; caption: string; type: "free" | "choice"; free: string; answers: string[]; correct: number; saved?: boolean }[];
  details: { date: string; guests: string };
  host: string;
  email: string;
  consent: boolean;
  orderId: string;
  own: { q: string; type: "free" | "choice"; free: string; answers: string[]; correct: number }[];
}

const KEY = "tadam-intake-v1";
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
    photos: [],
    details: { date: "", guests: "" },
    host: "auto",
    email: "",
    consent: false,
    orderId: "",
    own: [],
  });

  let state = load();
  // The image files live in memory only (a reload loses them and the card asks to pick the photo again).
  // They are sent once, with the order.
  const photoFiles = new Map<number, { file: File; url: string }>();
  const tracked = new Set<string>();

  function load(): State {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw) as State;
        if (s && s.v === 1) {
          const st = { ...blank(), ...s };
          st.photos = (st.photos || []).map((p) => ({ ...p, type: p.type ?? "free", free: p.free ?? "", answers: p.answers ?? ["", "", "", ""], correct: p.correct ?? -1 }));
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
  const shape = (): ShapeConfig => ({ ...data.shapes[event()?.shape ?? "person"], ...(event()?.override || {}) });
  const subjectName = () => state.name.trim() || "החוגג.ת";
  const target = () => event()?.target ?? 9;

  // ---------- material meter ----------
  const modeOf = (id: string) => state.modes[id] || "free";
  const choiceDone = (id: string) => {
    const ch = state.choices[id];
    return !!ch && ch.answers.length === 4 && ch.answers.every((a) => a.trim()) && ch.correct >= 0;
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
    n += state.photos.filter((p) => p.caption.trim().length > 3).length * m.perPhoto;
    n += state.own.length;
    return Math.min(target(), n);
  }

  // ---------- navigation ----------
  /** Step 3: one screen per story question, then "your own question", then up to two photo screens. Step 4: date, then host. */
  const subCount = (step: number) => (step === 3 ? shape().prompts.length + 1 + data.material.maxPhotos : step === 4 ? 2 : 1);
  type Kind = "q" | "own" | "photo";
  const kindOf = (sub: number): Kind => (sub < shape().prompts.length ? "q" : sub === shape().prompts.length ? "own" : "photo");
  const photoSlot = () => state.sub - shape().prompts.length - 1;
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
    track("intake_step", { step, sub, event: state.eventId });
  }
  function forward() {
    let sub = state.sub + 1;
    // a second photo screen only makes sense after a first photo
    if (state.step === 3 && sub < subCount(3) && kindOf(sub) === "photo" && sub - shape().prompts.length - 1 > state.photos.length) sub = subCount(3);
    if (sub < subCount(state.step)) return show(state.step, sub);
    if (state.step === 3 && need() > 0) {
      const el = $<HTMLElement>("[data-more-need]")!;
      $("[data-more-need-text]")!.textContent = fill(c.stories.needMore, { n: need() });
      el.hidden = false;
      return;
    }
    show(state.step + 1);
  }
  function backward() {
    if (state.sub > 0) return show(state.step, state.sub - 1);
    const prev = state.step - 1;
    let sub = subCount(prev) - 1;
    if (prev === 3) while (kindOf(sub) === "photo" && sub - shape().prompts.length - 1 > state.photos.length) sub -= 1;
    show(prev, sub);
  }

  // The bottom bar is one element for every step, so "back" and the main button never move.
  const bar = $<HTMLElement>("[data-bar]")!;
  const barNext = $<HTMLButtonElement>("[data-bar-next]")!;
  const orderLabel = `${c.order.cta} · ${data.price}`;
  function renderBar(step: number) {
    bar.hidden = step === 0 || step === 6;
    $<HTMLElement>("[data-bar-meter]")!.hidden = step !== 3;
    barNext.dataset.next = String(step);
    barNext.setAttribute("aria-disabled", "false");
    barNext.hidden = step === 1 && !state.eventId;
    barNext.textContent = step === 4 && state.sub === 1 ? c.details.cta : step === 5 ? orderLabel : c.next;
  }
  $<HTMLElement>("[data-bar-back]")!.addEventListener("click", backward);

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
    if (step === 4) {
      renderDetails();
      renderHosts();
      $$<HTMLElement>('[data-step="4"] [data-sub]').forEach((el) => (el.hidden = Number(el.dataset.sub) !== state.sub));
      $("[data-details-title]")!.textContent = state.sub === 0 ? c.details.whenTitle : c.details.hostTitle;
      $("[data-details-lead]")!.textContent = state.sub === 0 ? c.details.whenLead : c.details.hostLead;
    }
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
  const titleIn = $<HTMLInputElement>("#f-title")!;
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
    titleIn.placeholder = defaultTitle();
    titleIn.value = state.titleEdited ? state.title : "";
    if (!state.titleEdited) state.title = defaultTitle();
    $("[data-title-preview]")!.textContent = state.title;
  }
  const titleBox = $<HTMLElement>("[data-title-box]")!;
  const titleEdit = $<HTMLButtonElement>("[data-title-edit]")!;
  titleEdit.addEventListener("click", () => {
    titleBox.hidden = !titleBox.hidden;
    titleEdit.setAttribute("aria-expanded", String(!titleBox.hidden));
    if (!titleBox.hidden) titleIn.focus();
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
  titleIn.addEventListener("input", () => {
    state.titleEdited = titleIn.value.trim() !== "";
    state.title = state.titleEdited ? titleIn.value : defaultTitle(); // emptied field falls back to the default
    $("[data-title-preview]")!.textContent = state.title;
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
        track("intake_prompt_answered", { prompt: id, event: state.eventId });
      }
    }
    const box = promptsEl.querySelector<HTMLElement>(`[data-prompt="${id}"]`);
    if (box) {
      box.dataset.answered = String(committed.has(id));
      const mark = box.querySelector(".in-prompt__mark");
      if (mark) mark.textContent = committed.has(id) ? "✓ " + c.stories.answered : "";
    }
  }
  function renderStories() {
    if (!committedInit) {
      shape().prompts.forEach((p) => hasText(p.id) && committed.add(p.id));
      committedInit = true;
    }
    const all = shape().prompts;
    const kind = kindOf(state.sub);
    const hub = kind !== "q";
    const cur = all[state.sub];
    promptsEl.hidden = hub;
    $<HTMLElement>("[data-own-screen]")!.hidden = kind !== "own";
    $<HTMLElement>("[data-photo-screen]")!.hidden = kind !== "photo";
    $<HTMLElement>("[data-more-need]")!.hidden = true;
    const name = subjectName();
    $("[data-story-count]")!.textContent =
      kind === "q"
        ? fill(c.more.count, { i: state.sub + 1, n: all.length })
        : kind === "own"
          ? fill(c.more.unlocked, { n: questionsReady(), name })
          : fill(c.more.photoCount, { i: photoSlot() + 1, n: data.material.maxPhotos });
    $("[data-story-title]")!.textContent = kind === "q" ? fill(cur.label, { name }) : kind === "own" ? c.stage5.ownSection : c.stories.photosTitle;
    $("[data-story-lead]")!.textContent = kind === "q" ? fill(cur.hint, { name }) : kind === "own" ? c.more.ownLead : c.more.photoLead;
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
      box.innerHTML = `
        <span class="in-prompt__mark" hidden></span>
        <div class="in-prompt__body" id="pb-${p.id}" ${open ? "" : "hidden"}>
          <div class="in-chips" role="radiogroup" aria-label="${esc(label)}">
            <label class="in-chip"><input type="radio" name="pm-${p.id}" value="free" data-pmode="${p.id}" ${choice ? "" : "checked"} /><span>${c.stories.modeFree}</span></label>
            <label class="in-chip"><input type="radio" name="pm-${p.id}" value="choice" data-pmode="${p.id}" ${choice ? "checked" : ""} /><span>${c.stories.modeChoice}</span></label>
          </div>
          ${
            choice
              ? `<label class="in-help" for="cq-${p.id}">${c.stories.choiceQuestion}</label>
                 <input id="cq-${p.id}" class="in-input" type="text" maxlength="120" value="${esc(typedQ)}" placeholder="${esc(label)}" aria-label="${c.stories.choiceQuestion}" data-cq="${p.id}" />
                 <p class="in-help">${c.stories.choiceHelp}</p>
                 <div class="in-own-answers">${[0, 1, 2, 3]
                   .map(
                     (k) => `<div class="in-own-row"><input class="in-input" type="text" maxlength="60" value="${esc(cv.answers[k] || "")}" data-cans="${p.id}:${k}" aria-label="${c.stage5.ownAnswer} ${k + 1}" placeholder="${c.stage5.ownAnswer} ${k + 1}" />
                       <label class="in-own-correct"><input type="radio" name="pcor-${p.id}" value="${k}" data-ccor="${p.id}" ${cv.correct === k ? "checked" : ""} /><span>${c.stage5.ownCorrectShort}</span></label></div>`,
                   )
                   .join("")}</div>`
              : `<div class="in-rec" data-rec="${p.id}" role="status" hidden>
            <span class="in-rec__dot" aria-hidden="true"></span>
            <span>${c.stories.recording}</span>
            <span class="in-rec__bars" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
            <span class="in-rec__time" data-mic-time="${p.id}">0:00</span>
          </div>
          <textarea class="in-textarea" id="pt-${p.id}" placeholder="${esc(p.placeholder)}" aria-label="${esc(label)}">${esc(state.answers[p.id] || "")}</textarea>`
          }
          <div class="in-prompt__row">
            ${choice ? "" : `<button type="button" class="in-mic" aria-pressed="false" data-mic="${p.id}" hidden></button>`}
          </div>
          ${choice ? "" : `<p class="in-rec__heard" data-mic-heard="${p.id}" aria-live="polite"></p>
          <p class="in-err" role="alert" data-mic-err="${p.id}" hidden></p>`}
        </div>`;
      promptsEl.append(box);
      if (!choice) setupMic(box, p.id);
    }
    renderPhotos();
    renderOwnList();
    renderMeter();
  }
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
    const help = $("[data-meter-help]");
    if (help) help.textContent = "";
    if (state.step !== 3) return;
    // "next" when this screen has something, "skip" when it is empty
    const kind = kindOf(state.sub);
    const has = kind === "q" ? isDone(shape().prompts[state.sub].id) : kind === "own" ? state.own.length > 0 || ownDirty() : !!state.photos[photoSlot()];
    barNext.textContent = has ? c.next : c.more.skip;
    if (kind === "own") $("[data-story-count]")!.textContent = fill(c.more.unlocked, { n: ready, name: subjectName() });
    if (need() === 0) $<HTMLElement>("[data-more-need]")!.hidden = true;
  }

  // voice input (Web Speech API). Hidden where the browser does not support it.
  type Rec = { lang: string; interimResults: boolean; continuous: boolean; start(): void; stop(): void; onresult: ((e: any) => void) | null; onerror: ((e: any) => void) | null; onend: (() => void) | null };
  const SR = ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) as (new () => Rec) | undefined;
  let activeRec: Rec | null = null;
  function setupMic(box: HTMLElement, id: string) {
    const btn = box.querySelector<HTMLButtonElement>(`[data-mic="${id}"]`)!;
    const timeEl = box.querySelector<HTMLElement>(`[data-mic-time="${id}"]`)!;
    const recEl = box.querySelector<HTMLElement>(`[data-rec="${id}"]`)!;
    const heardEl = box.querySelector<HTMLElement>(`[data-mic-heard="${id}"]`)!;
    const errEl = box.querySelector<HTMLElement>(`[data-mic-err="${id}"]`)!;
    const ta = box.querySelector<HTMLTextAreaElement>("textarea")!;
    btn.textContent = "🎤 " + c.stories.mic;
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
      rec.lang = "he-IL";
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
        btn.textContent = "🎤 " + c.stories.mic;
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
      btn.textContent = "■ " + c.stories.micStop;
      recEl.hidden = false;
      ta.dataset.recording = "true";
      timeEl.textContent = "0:00";
      timer = window.setInterval(() => {
        secs += 1;
        timeEl.textContent = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
      }, 1000);
    });
  }

  // photos: kept in memory only, so no minors' images are stored or uploaded by the prototype
  const photoInput = $<HTMLInputElement>("[data-photo-input]")!;
  const photoList = $<HTMLElement>("[data-photos]")!;
  function renderPhotos() {
    photoList.innerHTML = "";
    state.photos.forEach((p, i) => {
      const li = document.createElement("li");
      const url = photoFiles.get(i)?.url;
      const choice = p.type === "choice";
      li.dataset.photo = String(i);
      li.hidden = state.step === 3 && kindOf(state.sub) === "photo" && i !== photoSlot();
      li.innerHTML = `${url ? `<img src="${url}" alt="" />` : `<label class="btn btn-white in-photo-again">${c.stories.photosAgain}<input type="file" accept="image/*" class="sr-only" data-photo-again="${i}" /></label>`}
        <div class="in-photo-body">
          <label class="in-help" for="pq-${i}">${esc(c.stories.photosCaption)}</label>
          <input id="pq-${i}" class="in-input" type="text" value="${esc(p.caption)}" placeholder="${esc(c.stories.photosPlaceholder)}" data-caption="${i}" />
          <div class="in-chips" role="radiogroup" aria-label="${esc(c.stage5.ownType)}">
            <label class="in-chip"><input type="radio" name="pt-${i}" value="free" data-ptype="${i}" ${choice ? "" : "checked"} /><span>${c.stage5.ownTypeFree}</span></label>
            <label class="in-chip"><input type="radio" name="pt-${i}" value="choice" data-ptype="${i}" ${choice ? "checked" : ""} /><span>${c.stage5.ownTypeChoice}</span></label>
          </div>
          ${
            choice
              ? `<div class="in-own-answers">` + [0, 1, 2, 3]
                  .map(
                    (k) => `<div class="in-own-row"><input class="in-input" type="text" maxlength="60" value="${esc(p.answers[k] || "")}" data-pans="${i}:${k}" aria-label="${c.stage5.ownAnswer} ${k + 1}" placeholder="${c.stage5.ownAnswer} ${k + 1}" />
                      <label class="in-own-correct"><input type="radio" name="pc-${i}" value="${k}" data-pcorrect="${i}" ${p.correct === k ? "checked" : ""} /><span>${c.stage5.ownCorrectShort}</span></label></div>`,
                  )
                  .join("") + `</div>`
              : `<label class="in-help" for="pf-${i}">${c.stage5.ownFreeAnswer}</label>
                 <input id="pf-${i}" class="in-input" type="text" maxlength="80" value="${esc(p.free)}" placeholder="${c.stage5.ownFreeAnswer}" data-pfree="${i}" />`
          }
          <p class="in-err" role="alert" data-photo-err="${i}" hidden>${c.stories.photoNeed}</p>
          <div class="in-photo-actions">
            <button type="button" class="btn btn-white in-save-btn" data-photo-save="${i}">${c.stories.save}</button>
            <span class="in-saved" data-photo-badge="${i}" role="status" ${p.saved ? "" : "hidden"}>✓ ${c.stories.photoSaved}</span>
            <button type="button" class="btn btn-ghost" data-photo-remove="${i}">${c.stories.photosRemove}</button>
          </div>
        </div>`;
      photoList.append(li);
    });
    const add = $<HTMLElement>("[data-photo-add]");
    if (add) add.hidden = state.photos.length >= data.material.maxPhotos || !!state.photos[photoSlot()];
  }
  const photoComplete = (p: State["photos"][number]) =>
    p.caption.trim().length > 3 && (p.type === "free" ? !!p.free.trim() : p.answers.every((a) => a.trim()) && p.correct >= 0);
  function markPhoto(i: number, ok: boolean) {
    state.photos[i].saved = ok;
    const badge = photoList.querySelector<HTMLElement>(`[data-photo-badge="${i}"]`);
    if (badge) badge.hidden = !ok;
    const err = photoList.querySelector<HTMLElement>(`[data-photo-err="${i}"]`);
    if (err && ok) err.hidden = true;
  }
  photoList.addEventListener("focusout", (e) => {
    const t = e.target as HTMLInputElement;
    const li = t.closest<HTMLElement>("[data-photo]");
    if (!li || t.type === "radio") return;
    const i = Number(li.dataset.photo);
    if (photoComplete(state.photos[i]) && !state.photos[i].saved) {
      markPhoto(i, true);
      save();
    }
  });
  photoInput.addEventListener("change", () => {
    const f = photoInput.files?.[0];
    if (!f || state.photos.length >= data.material.maxPhotos) return;
    photoFiles.set(state.photos.length, { file: f, url: URL.createObjectURL(f) });
    state.photos.push({ name: f.name, caption: "", type: "free", free: "", answers: ["", "", "", ""], correct: -1 });
    photoInput.value = "";
    renderPhotos();
    renderMeter();
    save();
    photoList.querySelector<HTMLInputElement>(`[data-caption="${state.photos.length - 1}"]`)?.focus();
  });
  photoList.addEventListener("input", (e) => {
    const t = e.target as HTMLInputElement;
    if (t.dataset.caption !== undefined) state.photos[Number(t.dataset.caption)].caption = t.value;
    else if (t.dataset.pfree !== undefined) state.photos[Number(t.dataset.pfree)].free = t.value;
    else if (t.dataset.pans !== undefined) {
      const [i, k] = t.dataset.pans.split(":").map(Number);
      state.photos[i].answers[k] = t.value;
    } else return;
    const li = t.closest<HTMLElement>("[data-photo]");
    if (li) {
      const i = Number(li.dataset.photo);
      if (state.photos[i].saved && !photoComplete(state.photos[i])) markPhoto(i, false);
    }
    renderMeter();
    save();
  });
  photoList.addEventListener("change", (e) => {
    const t = e.target as HTMLInputElement;
    if (t.dataset.photoAgain !== undefined) {
      const f = t.files?.[0];
      const i = Number(t.dataset.photoAgain);
      if (!f || !state.photos[i]) return;
      photoFiles.set(i, { file: f, url: URL.createObjectURL(f) });
      state.photos[i].name = f.name;
      renderPhotos();
    } else if (t.dataset.ptype !== undefined) {
      state.photos[Number(t.dataset.ptype)].type = t.value as "free" | "choice";
      renderPhotos();
      photoList.querySelector<HTMLInputElement>(`[data-ptype="${t.dataset.ptype}"][value="${t.value}"]`)?.focus();
    } else if (t.dataset.pcorrect !== undefined) state.photos[Number(t.dataset.pcorrect)].correct = Number(t.value);
    else return;
    save();
  });
  photoList.addEventListener("click", (e) => {
    const sb = (e.target as HTMLElement).closest<HTMLElement>("[data-photo-save]");
    if (sb) {
      const i = Number(sb.dataset.photoSave);
      if (photoComplete(state.photos[i])) {
        markPhoto(i, true);
        save();
      } else photoList.querySelector<HTMLElement>(`[data-photo-err="${i}"]`)!.hidden = false;
      return;
    }
    const b = (e.target as HTMLElement).closest<HTMLElement>("[data-photo-remove]");
    if (!b) return;
    const i = Number(b.dataset.photoRemove);
    state.photos.splice(i, 1);
    const urls = [...photoFiles.entries()].filter(([k]) => k !== i).map(([k, v]) => [k > i ? k - 1 : k, v] as [number, { file: File; url: string }]);
    photoFiles.clear();
    urls.forEach(([k, v]) => photoFiles.set(k, v));
    renderPhotos();
    renderMeter();
    save();
  });

  // ---------- 4: details ----------
  const pad = (n: number) => String(n).padStart(2, "0");
  const now = new Date();
  const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  $<HTMLInputElement>("#d-date")!.min = today; // the calendar does not offer days that have passed
  function renderDetails() {
    $<HTMLElement>("[data-date-err]")!.hidden = true;
    $$<HTMLInputElement>("[data-detail]").forEach((el) => {
      const k = el.dataset.detail as keyof State["details"];
      if (el.type === "radio") el.checked = state.details[k] === el.value;
      else el.value = state.details[k];
    });
  }
  root.addEventListener("input", (e) => {
    const el = e.target as HTMLInputElement;
    if (el.dataset?.detail) {
      state.details[el.dataset.detail as keyof State["details"]] = el.value;
      if (el.dataset.detail === "date") $<HTMLElement>("[data-date-err]")!.hidden = !(el.value && el.value < today);
      save();
    }
  });

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

  // own question form: a question, four answers, one marked correct
  const ownForm = $<HTMLFormElement>("[data-own-form]")!;
  const ownErr = $<HTMLElement>("[data-own-err]")!;
  const ownList = $<HTMLElement>("[data-own-list]")!;
  const ownFree = $<HTMLElement>("[data-own-free]")!;
  const ownChoice = $<HTMLElement>("[data-own-choice]")!;
  const ownType = () => (ownForm.querySelector<HTMLInputElement>('input[name="own-type"]:checked')?.value || "free") as "free" | "choice";
  function syncOwnType() {
    ownFree.hidden = ownType() !== "free";
    ownChoice.hidden = ownType() !== "choice";
  }
  ownForm.addEventListener("change", (e) => {
    if ((e.target as HTMLInputElement).name === "own-type") syncOwnType();
  });
  function renderOwnList() {
    ownList.innerHTML = state.own
      .map(
        (o, i) => `<li><span>${esc(o.q)}<small>${o.type === "free" ? c.stage5.ownTypeFree : c.stage5.ownTypeChoice}</small></span>
          <button type="button" class="btn btn-ghost" data-own-remove="${i}">${c.stage5.ownRemove}</button></li>`,
      )
      .join("");
  }
  ownList.addEventListener("click", (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>("[data-own-remove]");
    if (!b) return;
    state.own.splice(Number(b.dataset.ownRemove), 1);
    renderOwnList();
    renderMeter();
    save();
  });
  const ownQ = ownForm.querySelector<HTMLInputElement>("#own-q")!;
  const ownFreeIn = ownForm.querySelector<HTMLInputElement>("#own-free")!;
  const ownAnswers = () => [0, 1, 2, 3].map((i) => ownForm.querySelector<HTMLInputElement>(`[data-own-a="${i}"]`)!.value.trim());
  /** Something was typed in the form but not added yet. */
  const ownDirty = () => !!ownQ.value.trim() || !!ownFreeIn.value.trim() || ownAnswers().some(Boolean);
  /** Adds the typed question. "empty": nothing typed, "invalid": half filled (the error is shown), "added". */
  function addOwn(): "empty" | "invalid" | "added" {
    if (!ownDirty()) return "empty";
    const q = ownQ.value.trim();
    const type = ownType();
    const free = ownFreeIn.value.trim();
    const answers = ownAnswers();
    const picked = ownForm.querySelector<HTMLInputElement>('input[name="own-correct"]:checked');
    if (!q || (type === "free" ? !free : answers.some((a) => !a) || !picked)) {
      ownErr.textContent = type === "free" ? c.stage5.ownNeed : c.stage5.ownNeedChoice;
      ownErr.hidden = false;
      return "invalid";
    }
    state.own.push({ q, type, free: type === "free" ? free : "", answers: type === "choice" ? answers : [], correct: type === "choice" ? Number(picked!.value) : 0 });
    ownForm.reset();
    syncOwnType();
    ownErr.hidden = true;
    renderOwnList();
    renderMeter();
    save();
    return "added";
  }
  ownForm.addEventListener("input", () => {
    ownErr.hidden = true;
    renderMeter();
  });
  ownForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (addOwn() !== "invalid") ownQ.focus();
  });

  // ---------- 5: summary, contact, order ----------
  const orderForm = $<HTMLFormElement>("[data-order-form]")!;
  const orderErr = $<HTMLElement>("[data-order-err]")!;
  const orderCta = barNext;
  const consentIn = $<HTMLInputElement>("[data-order-consent]")!;
  const emailIn = $<HTMLInputElement>("#o-email")!;
  const missingPhotos = () => state.photos.filter((_, i) => !photoFiles.has(i)).length;
  const hostName = () => data.hosts.find((h) => h.id === state.host)?.name || "";
  function renderOrder() {
    $("[data-ticket-title]")!.textContent = state.title;
    $("[data-ticket-meta]")!.textContent =
      fill(c.order.meta, { event: event()?.label || "", host: hostName(), n: questionsReady() }) +
      (state.photos.length ? fill(c.order.metaPhotos, { n: state.photos.length }) : "");
    $<HTMLElement>("[data-photos-missing]")!.hidden = missingPhotos() === 0;
    emailIn.value = state.email;
    consentIn.checked = state.consent;
    orderErr.hidden = true;
  }
  orderForm.addEventListener("input", (e) => {
    const el = e.target as HTMLInputElement;
    if (el === emailIn) state.email = el.value;
    else if (el === consentIn) state.consent = el.checked;
    else return;
    el.removeAttribute("aria-invalid");
    save();
  });

  function brief() {
    const d = state.details;
    return {
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
      photos: state.photos.map((p) => ({ file: p.name, question: p.caption.trim(), type: p.type, free: p.type === "free" ? p.free.trim() : "", answers: p.type === "choice" ? p.answers.map((a) => a.trim()) : [], correct: p.type === "choice" ? p.correct : null })),
      logistics: { date: d.date || null, guests: d.guests ? Number(d.guests) : null },
      contact: { email: state.email.trim() },
      orderId: state.orderId,
      host: state.host,
      ownQuestions: state.own,
      questionCount: target(),
      materialReady: questionsReady(),
      consent: { factsAndPhotos: state.consent },
    };
  }
  function briefText(): string {
    const b = brief();
    const lines = [`אירוע: ${event()?.label}`, `על מי: ${b.subject.name}${b.subject.ageOrRole ? " (" + b.subject.ageOrRole + ")" : ""}`, `שם המשחק: ${b.title}`, "", "סיפורים:"];
    b.stories.forEach((s) => lines.push(`- ${s.prompt}: ${s.type === "choice" ? (s.answers || []).map((a, i) => (i === s.correct ? "*" : "") + a).join(" / ") : s.text}`));
    if (b.ownQuestions.length) {
      lines.push("", "שאלות של המזמינים:");
      b.ownQuestions.forEach((o) => lines.push(`- ${o.q}: ${o.type === "free" ? o.free : o.answers.map((a, i) => (i === o.correct ? "*" : "") + a).join(" / ")}`));
    }
    if (b.photos.length) {
      lines.push("", "תמונות (לפי הסדר, photo-1 והלאה):");
      b.photos.forEach((p) => lines.push(`- ${p.question || p.file}: ${p.type === "free" ? p.free : p.answers.map((a, i) => (i === p.correct ? "*" : "") + a).join(" / ")}`));
    }
    const l = b.logistics;
    const extra = [l.date && `תאריך: ${l.date}`, l.guests && `אורחים: ${l.guests}`].filter(Boolean);
    if (extra.length) lines.push("", ...(extra as string[]));
    lines.push("", `מנחה: ${data.hosts.find((h) => h.id === state.host)?.name || ""}`, `מספר שאלות: ${b.questionCount}`, "(* מסמן את התשובה הנכונה)");
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
      return blob && blob.size < file.size ? blob : file;
    } catch {
      return file; // a format the browser cannot draw: send it as it is
    }
  }
  let sending = false;
  orderForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (sending) return;
    const badEmail = !emailIn.value.trim() || !emailIn.validity.valid;
    if (badEmail) emailIn.setAttribute("aria-invalid", "true");
    if (badEmail || !consentIn.checked) {
      orderErr.textContent = c.order.errRequired;
      orderErr.hidden = false;
      (badEmail ? emailIn : consentIn).focus();
      return;
    }
    sending = true;
    orderErr.hidden = true;
    orderCta.setAttribute("aria-busy", "true");
    orderCta.textContent = c.order.sending;
    // one id per draft, so pressing again after a failed payment does not look like a second order
    state.orderId ||= "TD-" + Date.now().toString(36).toUpperCase().slice(-6);
    save();
    try {
      const b = brief();
      const d = state.details;
      const fd = new FormData();
      const fields: Record<string, string> = {
        "form-name": "order",
        "order-id": state.orderId,
        email: state.email.trim(),
        event: event()?.label || "",
        about: `${b.subject.name}${b.subject.ageOrRole ? " (" + b.subject.ageOrRole + ")" : ""}`,
        "game-title": state.title,
        host: hostName(),
        "event-date": d.date,
        guests: d.guests,
        price: data.price,
        brief: briefText(),
        "brief-json": JSON.stringify(b),
      };
      Object.entries(fields).forEach(([k, v]) => fd.append(k, v));
      for (const [i, p] of photoFiles) {
        const blob = await shrink(p.file);
        const name = blob === p.file ? p.file.name : p.file.name.replace(/\.[^.]*$/, "") + ".jpg";
        fd.append(`photo-${i + 1}`, blob, name);
      }
      const res = await fetch("/", { method: "POST", body: fd });
      if (!res.ok) throw new Error(String(res.status));
      try {
        localStorage.setItem(ORDER_KEY, JSON.stringify({ id: state.orderId, event: state.eventId, at: Date.now() }));
      } catch {
        /* ignore */
      }
      track("order_submit", { event: state.eventId, photos: photoFiles.size });
      track("intake_complete", { event: state.eventId, answered: answeredPrompts().length });
      if (data.paymentUrl) location.href = data.paymentUrl;
      else show(6);
    } catch (x) {
      track("order_error", { error: String(x) });
      orderErr.textContent = c.order.errSend;
      orderErr.hidden = false;
    } finally {
      sending = false;
      orderCta.removeAttribute("aria-busy");
      if (state.step === 5) orderCta.textContent = orderLabel;
    }
  });

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
      if (go.dataset.go === "1" && state.step === 0) track("intake_start");
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
      if (from === 3 && kindOf(state.sub) === "q") {
        const id = shape().prompts[state.sub].id;
        if (isDone(id)) commit(id);
      }
      if (from === 3 && kindOf(state.sub) === "own" && addOwn() === "invalid") return;
      if (from === 4 && state.sub === 0 && state.details.date && state.details.date < today) {
        $<HTMLElement>("[data-date-err]")!.hidden = false;
        return;
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
