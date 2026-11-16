/**
 * Intake prototype logic (/start). No backend: state lives in this browser (localStorage) and nothing is sent.
 * Steps: 0 start, 1 event, 2 who, 3 stories, 4 details, 5 generating + host (mock), 6 review (mock),
 * 7 order (mock), 8 launchpad (mock + the brief a developer or the team would receive).
 */
import { track } from "../lib/analytics";
import { fill } from "../content/intake.he";
import type { EventTile, Shape, ShapeConfig, Prompt } from "../content/intake.he";

interface Host {
  id: string;
  name: string;
  line: string;
}
interface Data {
  events: EventTile[];
  shapes: Record<Shape, ShapeConfig>;
  hosts: Host[];
  material: { minChars: number; charsPerQuestion: number; maxPerPrompt: number; perPhoto: number; maxPhotos: number; minPrompts: number };
  copy: typeof import("../content/intake.he").INTAKE;
}
interface State {
  v: 1;
  step: number;
  eventId: string;
  name: string;
  extra: string;
  title: string;
  titleEdited: boolean;
  answers: Record<string, string>;
  photos: { name: string; caption: string }[];
  details: { date: string; guests: string; screen: string; contact: string };
  host: string;
  approved: boolean[];
  checks: boolean[];
  code: string;
}

const KEY = "tadam-intake-v1";
const MAX_STEP = 8;
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
    eventId: "",
    name: "",
    extra: "",
    title: "",
    titleEdited: false,
    answers: {},
    photos: [],
    details: { date: "", guests: "", screen: "", contact: "" },
    host: "auto",
    approved: [],
    checks: [false, false, false],
    code: String(1000 + Math.floor(Math.random() * 9000)),
  });

  let state = load();
  const photoFiles = new Map<number, string>(); // object URLs for this session only; images are never stored or sent
  const tracked = new Set<string>();

  function load(): State {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw) as State;
        if (s && s.v === 1) return { ...blank(), ...s };
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
  const shape = (): ShapeConfig => data.shapes[event()?.shape ?? "person"];
  const subjectName = () => state.name.trim() || "החוגג.ת";
  const target = () => event()?.target ?? 9;

  // ---------- material meter ----------
  function answeredPrompts(): Prompt[] {
    return shape().prompts.filter((p) => (state.answers[p.id] || "").trim().length >= data.material.minChars);
  }
  function questionsReady(): number {
    const m = data.material;
    let n = 0;
    for (const p of shape().prompts) {
      const len = (state.answers[p.id] || "").trim().length;
      if (len >= m.minChars) n += Math.min(m.maxPerPrompt, Math.max(1, Math.round(len / m.charsPerQuestion)));
    }
    n += state.photos.filter((p) => p.caption.trim().length > 3).length * m.perPhoto;
    return Math.min(target(), n);
  }

  // ---------- navigation ----------
  function show(step: number, push = true) {
    step = Math.max(0, Math.min(MAX_STEP, step));
    if (step >= 2 && !state.eventId) step = 1;
    state.step = step;
    $$<HTMLElement>("[data-step]").forEach((s) => (s.hidden = Number(s.dataset.step) !== step));
    renderStep(step);
    renderProgress(step);
    if (push) history.pushState({ step }, "", `#s${step}`);
    else history.replaceState({ step }, "", `#s${step}`);
    save();
    window.scrollTo({ top: 0 });
    $<HTMLElement>(`[data-step="${step}"] [tabindex="-1"]`)?.focus({ preventScroll: true });
    track("intake_step", { step, event: state.eventId });
    if (step === 7) track("intake_complete", { event: state.eventId, answered: answeredPrompts().length });
  }

  function renderProgress(step: number) {
    const nav = $("[data-progress]");
    if (!nav) return;
    nav.hidden = step === 0;
    const stage = step <= 4 ? step : 5;
    const text = $("[data-progress-text]");
    if (text) text.textContent = `${c.stepWord} ${stage} ${c.of} 5`;
    const bar = $<HTMLElement>("[data-progress-bar]");
    if (bar) bar.style.width = `${(stage / 5) * 100}%`;
    $$("[data-stage]").forEach((li) => {
      if (Number(li.dataset.stage) === stage) li.setAttribute("aria-current", "step");
      else li.removeAttribute("aria-current");
    });
  }

  function renderStep(step: number) {
    if (step >= 2) applyShapeText();
    if (step === 1) renderEvents();
    if (step === 2) renderWho();
    if (step === 3) renderStories();
    if (step === 4) renderDetails();
    if (step === 5) startGeneration();
    if (step === 6) renderReview();
    if (step === 7) renderOrder();
    if (step === 8) renderLaunch();
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
    if (!state.titleEdited) state.title = fill(shape().title, { name: state.name.trim() || "..." });
    titleIn.value = state.title;
    renderSample();
  }
  function renderSample() {
    const sc = shape();
    const name = state.name.trim() || "...";
    const q = $("[data-sample-q]");
    const a = $("[data-sample-a]");
    if (q) q.textContent = fill(sc.sampleQuestion, { name });
    if (a) a.innerHTML = sc.sampleAnswers.map((t) => `<li>${esc(t)}</li>`).join("");
  }
  nameIn.addEventListener("input", () => {
    state.name = nameIn.value;
    if (!state.titleEdited) {
      state.title = fill(shape().title, { name: state.name.trim() || "..." });
      titleIn.value = state.title;
    }
    nameIn.removeAttribute("aria-invalid");
    $("#f-name-err")!.hidden = true;
    renderSample();
    save();
  });
  extraIn.addEventListener("input", () => {
    state.extra = extraIn.value;
    save();
  });
  titleIn.addEventListener("input", () => {
    state.title = titleIn.value;
    state.titleEdited = true;
    save();
  });

  // ---------- 3: stories ----------
  const promptsEl = $<HTMLElement>("[data-prompts]")!;
  let openPrompt = "";
  function renderStories() {
    if (!openPrompt) openPrompt = shape().prompts.find((p) => !state.answers[p.id])?.id || shape().prompts[0].id;
    promptsEl.innerHTML = "";
    for (const p of shape().prompts) {
      const answered = (state.answers[p.id] || "").trim().length >= data.material.minChars;
      const open = openPrompt === p.id;
      const box = document.createElement("div");
      box.className = "in-prompt";
      box.dataset.answered = String(answered);
      box.dataset.prompt = p.id;
      const label = fill(p.label, { name: subjectName() });
      box.innerHTML = `
        <button type="button" class="in-prompt__head" aria-expanded="${open}" aria-controls="pb-${p.id}">
          <span>${esc(label)}</span><span class="in-prompt__mark">${answered ? "✓ " + c.stories.answered : ""}</span>
        </button>
        <div class="in-prompt__body" id="pb-${p.id}" ${open ? "" : "hidden"}>
          <label class="in-help" for="pt-${p.id}">${esc(fill(p.hint, { name: subjectName() }))}</label>
          <textarea class="in-textarea" id="pt-${p.id}" placeholder="${esc(p.placeholder)}" aria-label="${esc(label)}">${esc(state.answers[p.id] || "")}</textarea>
          <div class="in-prompt__row">
            <button type="button" class="in-mic" aria-pressed="false" data-mic="${p.id}" hidden></button>
            <span class="in-help" data-mic-time="${p.id}"></span>
            <button type="button" class="btn btn-ghost" data-skip="${p.id}">${c.stories.skip}</button>
          </div>
          <p class="in-err" role="alert" data-mic-err="${p.id}" hidden></p>
        </div>`;
      promptsEl.append(box);
      setupMic(box, p.id);
    }
    renderPhotos();
    renderMeter();
    const share = $<HTMLAnchorElement>("[data-share]");
    if (share) share.href = `https://wa.me/?text=${encodeURIComponent(c.stories.shareText + location.origin + location.pathname)}`;
  }
  promptsEl.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    const head = t.closest<HTMLElement>(".in-prompt__head");
    if (head) {
      const id = head.closest<HTMLElement>("[data-prompt]")!.dataset.prompt!;
      openPrompt = openPrompt === id ? "" : id;
      renderStories();
      return;
    }
    const skip = t.closest<HTMLElement>("[data-skip]");
    if (skip) {
      const ps = shape().prompts;
      const i = ps.findIndex((p) => p.id === skip.dataset.skip);
      openPrompt = ps[i + 1]?.id || "";
      renderStories();
    }
  });
  promptsEl.addEventListener("input", (e) => {
    const ta = e.target as HTMLTextAreaElement;
    if (!ta.id.startsWith("pt-")) return;
    const id = ta.id.slice(3);
    state.answers[id] = ta.value;
    const done = ta.value.trim().length >= data.material.minChars;
    const box = ta.closest<HTMLElement>("[data-prompt]");
    if (box) {
      box.dataset.answered = String(done);
      const mark = box.querySelector(".in-prompt__mark");
      if (mark) mark.textContent = done ? "✓ " + c.stories.answered : "";
    }
    if (done && !tracked.has(id)) {
      tracked.add(id);
      track("intake_prompt_answered", { prompt: id, event: state.eventId });
    }
    renderMeter();
    save();
  });

  function renderMeter() {
    const ready = questionsReady();
    const t = target();
    const text = $("[data-meter-text]");
    if (text) text.textContent = fill(c.stories.counter, { n: ready, total: t });
    const bar = $<HTMLElement>("[data-meter-bar]");
    if (bar) bar.style.width = `${(ready / t) * 100}%`;
    const need = Math.max(0, data.material.minPrompts - answeredPrompts().length);
    const next = $<HTMLElement>('[data-next="3"]');
    const help = $("[data-meter-help]");
    if (next) next.setAttribute("aria-disabled", String(need > 0));
    if (help) help.textContent = need > 0 ? fill(c.stories.needMore, { n: need }) : `${c.stories.ready}. ${c.stories.meterHelp}`;
  }

  // voice input (Web Speech API). Hidden where the browser does not support it.
  type Rec = { lang: string; interimResults: boolean; continuous: boolean; start(): void; stop(): void; onresult: ((e: any) => void) | null; onerror: ((e: any) => void) | null; onend: (() => void) | null };
  const SR = ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) as (new () => Rec) | undefined;
  let activeRec: Rec | null = null;
  function setupMic(box: HTMLElement, id: string) {
    const btn = box.querySelector<HTMLButtonElement>(`[data-mic="${id}"]`)!;
    const timeEl = box.querySelector<HTMLElement>(`[data-mic-time="${id}"]`)!;
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
      rec.interimResults = false;
      rec.continuous = true;
      const base = ta.value;
      let finalText = "";
      let secs = 0;
      heard = false;
      rec.onresult = (e: any) => {
        for (let i = e.resultIndex; i < e.results.length; i++) if (e.results[i].isFinal) finalText += e.results[i][0].transcript + " ";
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
        timeEl.textContent = "";
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
      timer = window.setInterval(() => {
        secs += 1;
        timeEl.textContent = `0:${String(secs).padStart(2, "0")}`;
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
      const url = photoFiles.get(i);
      li.innerHTML = `${url ? `<img src="${url}" alt="" />` : `<span aria-hidden="true">🖼️</span>`}
        <input class="in-input" type="text" value="${esc(p.caption)}" placeholder="${esc(c.stories.photosCaption)}" aria-label="${esc(c.stories.photosCaption)} ${i + 1}" data-caption="${i}" />
        <button type="button" class="btn btn-ghost" data-photo-remove="${i}">${c.stories.photosRemove}</button>`;
      photoList.append(li);
    });
    const add = $<HTMLElement>("[data-photo-add]");
    if (add) add.hidden = state.photos.length >= data.material.maxPhotos;
  }
  photoInput.addEventListener("change", () => {
    const f = photoInput.files?.[0];
    if (!f || state.photos.length >= data.material.maxPhotos) return;
    photoFiles.set(state.photos.length, URL.createObjectURL(f));
    state.photos.push({ name: f.name, caption: "" });
    photoInput.value = "";
    renderPhotos();
    renderMeter();
    save();
    photoList.querySelector<HTMLInputElement>(`[data-caption="${state.photos.length - 1}"]`)?.focus();
  });
  photoList.addEventListener("input", (e) => {
    const t = e.target as HTMLInputElement;
    if (t.dataset.caption === undefined) return;
    state.photos[Number(t.dataset.caption)].caption = t.value;
    renderMeter();
    save();
  });
  photoList.addEventListener("click", (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>("[data-photo-remove]");
    if (!b) return;
    const i = Number(b.dataset.photoRemove);
    state.photos.splice(i, 1);
    const urls = [...photoFiles.entries()].filter(([k]) => k !== i).map(([k, v]) => [k > i ? k - 1 : k, v] as [number, string]);
    photoFiles.clear();
    urls.forEach(([k, v]) => photoFiles.set(k, v));
    renderPhotos();
    renderMeter();
    save();
  });

  // ---------- 4: details ----------
  function renderDetails() {
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
      save();
    }
  });

  // ---------- 5: generating (mock) + host ----------
  let genTimer = 0;
  function startGeneration() {
    const title = $("[data-gen-title]");
    if (title) title.textContent = fill(c.stage5.generating, { name: subjectName() });
    const bar = $<HTMLElement>("[data-gen-bar]")!;
    const label = $("[data-gen-label]")!;
    const next = $<HTMLElement>("[data-gen-next]")!;
    const hostsEl = $<HTMLElement>("[data-hosts]")!;
    hostsEl.innerHTML = data.hosts
      .map((h) => `<button type="button" class="in-host" role="radio" aria-checked="${state.host === h.id}" data-host="${h.id}"><strong>${esc(h.name)}</strong><span>${esc(h.line)}</span></button>`)
      .join("");
    window.clearInterval(genTimer);
    let pct = 0;
    const stages = c.stage5.stages;
    next.setAttribute("aria-disabled", "true");
    const tick = () => {
      pct = Math.min(100, pct + 4);
      bar.style.width = `${pct}%`;
      label.textContent = stages[Math.min(stages.length - 1, Math.floor((pct / 100) * stages.length))];
      if (pct >= 100) {
        window.clearInterval(genTimer);
        next.setAttribute("aria-disabled", "false");
        label.textContent = c.stage5.reviewLead;
      }
    };
    genTimer = window.setInterval(tick, 400);
    tick();
  }
  root.addEventListener("click", (e) => {
    const h = (e.target as HTMLElement).closest<HTMLElement>("[data-host]");
    if (!h) return;
    state.host = h.dataset.host || "auto";
    $$<HTMLElement>("[data-host]").forEach((b) => b.setAttribute("aria-checked", String(b === h)));
    save();
  });

  // ---------- 6: review (mock questions, real sources) ----------
  type Source = { label: string; snippet: string };
  function sources(): Source[] {
    const list: Source[] = answeredPrompts().map((p) => ({
      label: fill(p.label, { name: subjectName() }),
      snippet: (state.answers[p.id] || "").trim(),
    }));
    state.photos.filter((p) => p.caption.trim()).forEach((p) => list.push({ label: c.stories.photosTitle, snippet: p.caption.trim() }));
    return list;
  }
  let reviewIndex = 0;
  function renderReview() {
    const list = sources();
    if (state.approved.length !== list.length) state.approved = list.map((_, i) => !!state.approved[i]);
    reviewIndex = Math.min(reviewIndex, Math.max(0, list.length - 1));
    const el = $<HTMLElement>("[data-review]")!;
    const s = list[reviewIndex];
    if (!s) {
      el.innerHTML = "";
      return;
    }
    const ok = state.approved[reviewIndex];
    el.innerHTML = `<article class="in-qcard" data-approved="${ok}">
        <h3 class="in-sub">${fill(c.stage5.questionOf, { i: reviewIndex + 1, n: list.length })}</h3>
        <p class="in-qcard__source">${c.stage5.source}: «${esc(s.snippet.length > 110 ? s.snippet.slice(0, 110) + "..." : s.snippet)}»</p>
        <p class="in-qcard__ph">${c.stage5.placeholderQuestion}</p>
        <div class="in-qcard__actions">
          <button type="button" class="btn btn-buzzer" data-approve>${ok ? "✓ " + c.stage5.approved : c.stage5.approve}</button>
          <button type="button" class="btn btn-white" data-rewrite>${c.stage5.rewrite}</button>
          <button type="button" class="btn btn-ghost" data-rv="-1" ${reviewIndex === 0 ? "disabled" : ""}>${c.back}</button>
          <button type="button" class="btn btn-ghost" data-rv="1" ${reviewIndex >= list.length - 1 ? "disabled" : ""}>${c.next}</button>
        </div>
      </article>`;
    $$<HTMLInputElement>("[data-check]").forEach((cb) => (cb.checked = !!state.checks[Number(cb.dataset.check)]));
    const share = $<HTMLAnchorElement>("[data-share-review]");
    if (share) share.href = `https://wa.me/?text=${encodeURIComponent(c.stories.shareText + location.origin + location.pathname)}`;
    updateReviewGate();
  }
  function updateReviewGate() {
    const all = state.approved.length > 0 && state.approved.every(Boolean) && state.checks.every(Boolean);
    $<HTMLElement>('[data-next="6"]')?.setAttribute("aria-disabled", String(!all));
  }
  root.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    if (t.closest("[data-approve]")) {
      state.approved[reviewIndex] = !state.approved[reviewIndex];
      if (state.approved[reviewIndex] && reviewIndex < state.approved.length - 1) reviewIndex += 1;
      renderReview();
      save();
    }
    const rv = t.closest<HTMLElement>("[data-rv]");
    if (rv) {
      reviewIndex += Number(rv.dataset.rv);
      renderReview();
    }
  });
  root.addEventListener("change", (e) => {
    const cb = e.target as HTMLInputElement;
    if (cb.dataset?.check !== undefined) {
      state.checks[Number(cb.dataset.check)] = cb.checked;
      updateReviewGate();
      save();
    }
  });

  // ---------- 7: order (mock) ----------
  function renderOrder() {
    const d = state.details;
    const hostName = data.hosts.find((h) => h.id === state.host)?.name || "";
    const rows: [string, string][] = [
      ["אירוע", event()?.label || ""],
      ["על מי", subjectName()],
      ["שם המשחק", state.title],
      ["מנחה", hostName],
      ["שאלות", String(questionsReady())],
    ];
    if (d.guests) rows.push(["אורחים", d.guests]);
    $("[data-summary]")!.innerHTML = rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("");
    const od = $<HTMLElement>("[data-order-date]")!;
    if (d.date) {
      od.hidden = false;
      od.textContent = fill(c.stage5.orderDate, { date: new Date(d.date).toLocaleDateString("he-IL") });
    } else od.hidden = true;
  }

  // ---------- 8: launchpad + brief ----------
  function brief() {
    const d = state.details;
    return {
      eventType: state.eventId,
      subjectShape: event()?.shape,
      subject: { name: state.name.trim(), ageOrRole: state.extra.trim() },
      title: state.title,
      stories: shape().prompts
        .filter((p) => (state.answers[p.id] || "").trim())
        .map((p) => ({ promptId: p.id, prompt: fill(p.label, { name: subjectName() }), text: state.answers[p.id].trim() })),
      photos: state.photos.map((p) => ({ file: p.name, caption: p.caption.trim() })),
      logistics: { date: d.date || null, guests: d.guests ? Number(d.guests) : null, screen: d.screen || null, contact: d.contact || null },
      host: state.host,
      questionCount: target(),
      materialReady: questionsReady(),
      consent: { photos: state.photos.length > 0 },
    };
  }
  function briefText(): string {
    const b = brief();
    const lines = [`אירוע: ${event()?.label}`, `על מי: ${b.subject.name}${b.subject.ageOrRole ? " (" + b.subject.ageOrRole + ")" : ""}`, `שם המשחק: ${b.title}`, "", "סיפורים:"];
    b.stories.forEach((s) => lines.push(`- ${s.prompt}: ${s.text}`));
    if (b.photos.length) {
      lines.push("", "תמונות (כיתובים):");
      b.photos.forEach((p) => lines.push(`- ${p.caption || p.file}`));
    }
    const l = b.logistics;
    const extra = [l.date && `תאריך: ${l.date}`, l.guests && `אורחים: ${l.guests}`, l.screen && `מסך: ${l.screen}`].filter(Boolean);
    if (extra.length) lines.push("", ...(extra as string[]));
    lines.push("", `מספר שאלות: ${b.questionCount}`);
    return lines.join("\n");
  }
  async function renderLaunch() {
    const t = $("[data-launch-title]");
    if (t) t.textContent = fill(c.stage5.launchTitle, { name: subjectName() });
    $("[data-code]")!.textContent = state.code;
    $("[data-dev-json]")!.textContent = JSON.stringify(brief(), null, 2);
    $("[data-dev-text]")!.textContent = briefText();
    const box = $<HTMLElement>("[data-qr]")!;
    if (!box.firstChild) {
      const { default: qrcode } = await import("qrcode-generator");
      const qr = qrcode(0, "M");
      qr.addData(location.origin + location.pathname + "#sample-" + state.code);
      qr.make();
      box.innerHTML = qr.createSvgTag({ cellSize: 8, margin: 0, scalable: true });
    }
  }
  async function copy(text: string, btn: HTMLElement) {
    const old = btn.textContent;
    try {
      await navigator.clipboard.writeText(text);
      btn.textContent = c.stage5.copied;
    } catch {
      btn.textContent = "לא הצלחנו להעתיק";
    }
    window.setTimeout(() => (btn.textContent = old), 1800);
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
        openPrompt = "";
      }
      renderEvents();
      window.setTimeout(() => show(2), 160);
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
      if (nx.getAttribute("aria-disabled") === "true") {
        if (from === 3) renderMeter();
        return;
      }
      if (from === 2 && !state.name.trim()) {
        nameIn.setAttribute("aria-invalid", "true");
        $("#f-name-err")!.hidden = false;
        nameIn.focus();
        return;
      }
      show(from + 1);
      return;
    }
    if (t.closest("[data-restart]")) {
      if (!window.confirm(c.restart + "?")) return;
      state = blank();
      photoFiles.clear();
      openPrompt = "";
      reviewIndex = 0;
      save();
      show(0);
      return;
    }
    if (t.closest("[data-copy-link]")) {
      void copy(location.origin + location.pathname, t.closest<HTMLElement>("[data-copy-link]")!);
      return;
    }
    const cp = t.closest<HTMLElement>("[data-copy]");
    if (cp) void copy(cp.dataset.copy === "json" ? JSON.stringify(brief(), null, 2) : briefText(), cp);
  });

  // Back button returns to the previous stage without wiping anything (state is saved on every change).
  window.addEventListener("popstate", (e) => {
    const s = (e.state && typeof e.state.step === "number" ? e.state.step : parseHash()) as number;
    show(s, false);
  });
  function parseHash(): number {
    const m = /^#s(\d)$/.exec(location.hash);
    return m ? Number(m[1]) : state.step;
  }

  show(state.step, false);
}

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch] as string);
}
