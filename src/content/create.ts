/**
 * Copy and config for the game creator at /create (the order wizard). English only.
 * Ported from the draft built in tanyarofman/tadam-il (branch claude/stoic-albattani-id4pku, docs/order-flow-handoff.md).
 *
 * WHAT TANYA CHANGES HERE (everything else is wording):
 *  - EVENTS: the event tiles (label, icon, which question set they use).
 *  - HOSTS: host names, one-line descriptions, photos (public/create/hosts/).
 *  - SHAPES: the guided questions for a person, a couple and a group (COMPANY replaces them for the office party).
 *  - CREATE.more.extra: the closing "anything else?" question.
 * Placeholders for now (2026-11-26): the host names, the events and the questions.
 *
 * Keep event ids, host ids and question ids stable once orders come in: they travel with every order.
 * Rules (CLAUDE.md): American English, "you", no em-dashes or en-dashes, no real people, no prices in the text
 * (prices come from src/config/pricing.ts), nothing from Israel.
 * `{name}` is replaced with what the customer typed.
 */

export type Shape = "person" | "couple" | "group";

export interface EventTile {
  id: string;
  label: string;
  shape: Shape;
  icon: string;
  /** How many questions the game aims for (the meter on the question screens). */
  target: number;
  /** Wording and prompts that replace the shape's own (for an event that needs a different flavor). */
  override?: Partial<ShapeConfig>;
}

export interface Prompt {
  id: string;
  label: string;
  hint: string;
  placeholder: string;
}

export interface ShapeConfig {
  nameLabel: string;
  namePlaceholder: string;
  nameHelp: string;
  extraLabel: string;
  extraPlaceholder: string;
  /** Prefilled game title. */
  title: string;
  sampleQuestion: string;
  sampleAnswers: string[];
  /** Index of the correct sample answer. */
  sampleCorrect: number;
  storiesTitle: string;
  storiesLead: string;
  prompts: Prompt[];
}

export interface Host {
  id: string;
  name: string;
  line: string;
  image: string;
}

/** How much written material counts as one question (starting heuristic, tune with the game generator). */
export const MATERIAL = {
  /** An answer shorter than this does not count as answered. */
  minChars: 2,
  /** Characters of story that make one question. */
  charsPerQuestion: 60,
  /** One prompt cannot feed more than this many questions, so one long story is not enough alone. */
  maxPerPrompt: 3,
  /** A photo is worth this many questions. */
  perPhoto: 1,
  maxPhotos: 5,
  /** "Continue" after the questions unlocks at this many answered prompts. */
  minPrompts: 3,
};

export function fill(text: string, vars: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}

/** Company and team events: workplace prompts instead of the family-and-friends ones. No real brands. */
const COMPANY: Partial<ShapeConfig> = {
  nameLabel: "What is the company or team called?",
  namePlaceholder: "For example: the product team, or Acme",
  nameHelp: "The name appears in the game. It can be a company, a department or a team.",
  extraLabel: "Roughly how many people? (optional)",
  extraPlaceholder: "For example: 80",
  sampleQuestion: "What happens every Thursday at {name}?",
  sampleAnswers: ["Team meeting", "Lunch together", "A release", "A vote on pizza"],
  sampleCorrect: 1,
  storiesLead: "Write it the way you would tell a friend, in a few sentences.",
  prompts: [
    { id: "c-milestone", label: "The win you are celebrating", hint: "A launch, a big deal, a target you hit, a full year together", placeholder: "For example: we shipped the first version after three months of late nights" },
    { id: "c-culture", label: "A joke or line the team keeps repeating", hint: "Something everyone knows, from meetings and from the chat", placeholder: "For example: \"it works on my machine\" after every bug" },
    { id: "c-who", label: "Who is who on the team?", hint: "Roles, nicknames, and the person who always does the same thing", placeholder: "For example: Dana always brings cake to the demo, and Ben is the only one who remembers how the system works" },
    { id: "c-history", label: "How did it all start?", hint: "The first moment of the company or the team, the first office, the first customer", placeholder: "For example: three people in a garage, and the first customer came through a friend" },
    { id: "c-ritual", label: "A tradition or a regular ritual", hint: "Lunch, a hackathon, the morning stand-up, the Friday demo", placeholder: "For example: every Thursday we eat together, and whoever is late buys coffee for everyone" },
    { id: "c-legend", label: "A mishap you can laugh about today", hint: "Something that became a legend at work, without hurting anyone", placeholder: "For example: the customer demo where the system went down at the worst moment" },
  ],
};

/** The event tiles (placeholder list; Tanya will revise it). */
export const EVENTS: EventTile[] = [
  { id: "birthday", label: "Birthday", shape: "person", icon: "🎂", target: 12 },
  { id: "round-birthday", label: "Milestone birthday", shape: "person", icon: "🎈", target: 12 },
  { id: "bar-bat", label: "Bar or bat mitzvah", shape: "person", icon: "✡️", target: 12 },
  { id: "farewell", label: "Farewell or retirement", shape: "person", icon: "👋", target: 12 },
  { id: "bachelor", label: "Bachelor or bachelorette party", shape: "person", icon: "🥂", target: 12 },
  { id: "shower", label: "Bridal or baby shower", shape: "person", icon: "🎁", target: 12 },
  { id: "wedding", label: "Wedding", shape: "couple", icon: "💍", target: 12 },
  { id: "anniversary", label: "Anniversary", shape: "couple", icon: "💞", target: 12 },
  { id: "family", label: "Family gathering", shape: "group", icon: "👨‍👩‍👧‍👦", target: 12 },
  { id: "reunion", label: "Class reunion", shape: "group", icon: "🎓", target: 12 },
  { id: "teambuilding", label: "Team day", shape: "group", icon: "🤝", target: 12 },
  { id: "toast", label: "Office party", shape: "group", icon: "🍾", target: 12, override: COMPANY },
];

/** The guided questions for each kind of event (placeholders; Tanya may revise them). */
export const SHAPES: Record<Shape, ShapeConfig> = {
  person: {
    nameLabel: "Who are we celebrating?",
    namePlaceholder: "For example: Emma",
    nameHelp: "The name appears in the game, so write it the way people will say it at the event.",
    extraLabel: "One more word about them (optional)",
    extraPlaceholder: "Age, grade or role",
    title: "How well do you know {name}?",
    sampleQuestion: "What is {name}'s favorite food?",
    sampleAnswers: ["Pizza", "Sushi", "Tacos", "Ice cream"],
    sampleCorrect: 0,
    storiesTitle: "Tell us about {name}",
    storiesLead: "Write it the way you would tell a friend, in a few sentences.",
    prompts: [
      { id: "loves", label: "What does {name} love?", hint: "A food, a song, a show, a hobby, a game", placeholder: "For example: pepperoni pizza, one song on repeat, basketball" },
      { id: "sayings", label: "Nicknames and things they say all the time", hint: "What does everyone know? What are they called at home?", placeholder: "For example: everyone calls her \"Em\", and her line is \"one more minute\"" },
      { id: "story", label: "One story people tell about them", hint: "In the family, at school or among friends. A few lines are enough.", placeholder: "For example: on a road trip he insisted on navigating, and we ended up in the wrong state" },
      { id: "inside", label: "An inside joke", hint: "Something only the people who were there will get. We turn it into the question everyone waits for.", placeholder: "For example: what happened with the pancakes on Saturday?" },
    ],
  },
  couple: {
    nameLabel: "What are the two of them called?",
    namePlaceholder: "For example: Dana and Ben",
    nameHelp: "Both names, the way the guests know them.",
    extraLabel: "How long together? (optional)",
    extraPlaceholder: "For example: 7 years",
    title: "How well do you know {name}?",
    sampleQuestion: "Where did {name} first meet?",
    sampleAnswers: ["At school", "At work", "Through friends", "At college"],
    sampleCorrect: 2,
    storiesTitle: "Tell us about {name}",
    storiesLead: "Write it the way you would tell a friend, in a few sentences.",
    prompts: [
      { id: "met", label: "How did they meet?", hint: "Where, when, and who was there", placeholder: "For example: at a friend's party, and he spilled coffee on her" },
      { id: "proposal", label: "How did it happen? The proposal, the decision or a special moment", hint: "Who asked, where, and what was said", placeholder: "For example: on the roof, with a cake he baked himself" },
      { id: "quirks", label: "Who is who? Each one's habits", hint: "Who is late, who tidies up, who cooks", placeholder: "For example: she is always late, and he always arrives ten minutes early" },
      { id: "trip", label: "A trip or a shared memory", hint: "A place, an event or an adventure they keep telling", placeholder: "For example: the trip to Italy where we lost the keys" },
      { id: "taste", label: "A song, a show or a food they share", hint: "What they always pick together", placeholder: "For example: the first dance song, a show they watched three times" },
      { id: "inside", label: "Their inside joke", hint: "Something only people who know them will get", placeholder: "For example: what they say when someone misses the exit" },
    ],
  },
  group: {
    nameLabel: "What is the group called?",
    namePlaceholder: "For example: the Miller family, the class of 2010, or the sales team",
    nameHelp: "The name appears in the game, so make it one everybody recognizes.",
    extraLabel: "Roughly how many people? (optional)",
    extraPlaceholder: "For example: 40",
    title: "How much do you know about {name}?",
    sampleQuestion: "What does {name} do best together?",
    sampleAnswers: ["Organize", "Eat", "Argue", "Laugh"],
    sampleCorrect: 3,
    storiesTitle: "Tell us about {name}",
    storiesLead: "Write it the way you would tell a friend, in a few sentences.",
    prompts: [
      { id: "memory", label: "A shared memory everyone tells", hint: "An event, a trip or a day that stuck", placeholder: "For example: the day the bus broke down and we sang on the roadside for an hour" },
      { id: "running", label: "A running joke or a line that keeps coming back", hint: "Something you only need to start for everyone to laugh", placeholder: "For example: \"not my department\" after every mishap" },
      { id: "who", label: "Who is who?", hint: "Roles, nicknames, and the person who always does the same thing", placeholder: "For example: Ryan always brings the cake, Jess is always late" },
      { id: "history", label: "How did it all start?", hint: "The history of the group in a few lines", placeholder: "For example: we met in seventh grade at the same back table" },
      { id: "tradition", label: "A tradition or a regular ritual", hint: "Something you do every time you meet", placeholder: "For example: we always start with an awkward group photo" },
      { id: "place", label: "A place, a thing or a topic that is yours", hint: "Something everyone in the group knows", placeholder: "For example: the diner next to the office" },
    ],
  },
};

/**
 * The ready-made hosts (placeholders, 2026-11-26). Same ids and photos as the draft; the names are placeholders
 * (the draft's hosts were made for the Hebrew game). English-speaking hosts are still to be made.
 * VIP can also have a custom host, set up by email (CLAUDE.md, "Hosts and demo artwork").
 */
export const HOSTS: Host[] = [
  { id: "auto", name: "Pick for me", line: "We match a host to the event", image: "" },
  { id: "ido", name: "Ethan", line: "The classic host, in the blue studio", image: "/create/hosts/ido.webp" },
  { id: "cartoon", name: "Goldie", line: "A cartoon character with a lot of personality", image: "/create/hosts/cartoon.webp" },
  { id: "noa", name: "Nora", line: "Young, light and at your pace", image: "/create/hosts/noa.webp" },
  { id: "lian", name: "Lily", line: "Creator style, in the orange studio", image: "/create/hosts/lian.webp" },
  { id: "football", name: "Ray", line: "Finals energy, in the green studio", image: "/create/hosts/football.webp" },
];

export const CREATE = {
  ui: {
    brand: "Tadam!",
    home: "Tadam!, home page",
    skipLink: "Skip to content",
    progress: "Progress",
    someone: "the guest of honor",
    emailPlaceholder: "name@example.com",
    speechLang: "en-US",
  },
  meta: {
    title: "Create Your Game | Tadam!",
    description: "Create a personal trivia game for your event: tell us about it, pick a package and pay.",
  },

  save: "Saved automatically",
  restart: "Start over",
  back: "Back",
  next: "Continue",

  start: {
    title: "Let's build the game for your event",
    lead: "Tell us about the event in ten minutes, and we turn it into a personal trivia game show.",
    /** After "From {price}". */
    priceNote: "for a complete game. You pay only at the end.",
    from: "From",
    cta: "Let's start",
  },

  event: {
    title: "What are you celebrating?",
  },

  who: {
    titleLabel: "Game title",
    titleEdit: "Change the game title",
    screenNote: "This is how the game opens on the big screen",
    required: "Write a name to continue",
  },

  stories: {
    answered: "Answered",
    modeFree: "Free story",
    modeChoice: "Four options",
    choiceQuestion: "The question",
    choiceHelp: "Write four answers and mark the correct one. Guests will pick one.",
    answer: "Answer",
    correctShort: "Correct",
    counter: "{n} of {total} questions",
    meterLabel: "We have material for",
    needMore: "We need at least 3 answers to build a game. {n} more to go.",
    backToQuestions: "Back to the questions",
    mic: "Or record it",
    micStop: "Stop recording",
    recording: "Recording now, go ahead",
    heard: "What we heard:",
    micDenied: "To record, allow access to the microphone. If you opened this from WhatsApp or Instagram, try Chrome or Safari.",
    micEmpty: "We did not hear anything, try again.",
    photosAgain: "Choose the photo again",
    photoAttach: "Add a photo",
    photoReplace: "Replace photo",
    photoRemove: "Remove the photo",
    photoMax: "You can attach up to 5 photos in total.",
    photosBad: "We could not open this photo. Try a JPG or PNG.",
  },

  more: {
    unlocked: "We already have material for {n} questions about {name}",
    count: "Question {i} of {n}",
    skip: "Skip",
    extra: {
      id: "extra",
      label: "Anything else you have not told us?",
      hint: "A story, a question of your own, or anything you want in the game. Optional.",
      placeholder: "For example: every Thanksgiving he bakes the same pie, and nobody dares to tell him",
    },
    extraQuestion: "Write your question here",
  },

  details: {
    whenTitle: "When is the event?",
    whenLead: "Optional. It helps us plan the timing.",
    hostTitle: "Who hosts the game?",
    hostLead: "Every host is included. You can also let us choose.",
    date: "Event date",
    datePast: "That date has already passed. Pick a future date or leave it empty.",
    guests: "Roughly how many guests?",
    cta: "Review the order",
  },

  order: {
    title: "Everything is ready to order",
    meta: "{event} · Host: {host} · Material for {n} questions",
    metaPhotos: " · Photos: {n}",
    packageLegend: "Choose your package",
    /** One line per package; {questions}, {participants}, {edits}, {linkDays} come from PACKAGES in pricing.ts. */
    packageLines: [
      "Up to {questions} questions",
      "Up to {participants} players",
      "{edits} rounds of changes before the event",
      "The game link works for {linkDays} days",
    ],
    vipExtra: "Want your own host? We set it up with you by email.",
    includes: ["A personal game from your stories, with a host on the big screen", "Every guest plays from their phone"],
    priceLabel: "Total",
    email: "Which email should we send the game to?",
    consent: "The names and facts are correct, and I have permission to use the photos.",
    cta: "Continue to payment",
    sending: "Sending the order...",
    payNote: "You pay on a secure checkout by Paddle, our payment partner.",
    errRequired: "Enter a valid email and tick the confirmation.",
    errSend: "We could not send the order. Everything you filled in is saved, try again in a moment.",
    errPay: "The payment window did not open. Your order is saved, try again in a moment.",
    photosMissing: "Some photos were not kept by the browser. Go back and choose them again, or continue without them.",
  },

  /** Shown only while the checkout is not configured (no Paddle keys on this deploy). */
  pay: {
    title: "The order was saved",
    note: "This is where the Paddle checkout opens. It is not connected on this deploy yet, so this screen appears instead.",
    cta: "To the screen after payment",
  },

  thanks: {
    metaTitle: "Payment Received | Tadam!",
    title: "Yes! Your game is on its way",
    lead: "We received your payment and your order.",
    orderNo: "Order number",
    next: [
      { t: "A receipt by email", d: "Paddle sends it to you right away." },
      { t: "We build", d: "From the stories and photos you sent." },
      { t: "You review", d: "The game arrives by email, and you can ask for changes before the event." },
    ],
    ideasTitle: "Meanwhile, ideas for your event",
    ideasAll: "All articles",
    home: "Back to the site",
    contact: "Have a question? Email us",
  },
};
