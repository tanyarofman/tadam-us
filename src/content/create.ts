/**
 * Copy and config for the game creator at /create (the order wizard). English only.
 * Ported from the draft built in tanyarofman/tadam-il (branch claude/stoic-albattani-id4pku, docs/order-flow-handoff.md).
 *
 * WHAT TANYA CHANGES HERE (everything else is wording):
 *  - EVENTS: the event tiles (label, icon, which question set they use).
 *  - HOSTS: host names, one-line descriptions, photos (public/create/hosts/).
 *  - The question lists (BIRTHDAY, MITZVAH, WEDDING...): about 9 per event, wired to the events in EVENTS.
 *  - CREATE.more.extra: the closing "anything else?" question.
 * Placeholders for now (2026-11-26): the host names and the events.
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

/**
 * How the questions are written (Tanya, 2026-11-26):
 *  - About 10 screens per event: 9 questions for that kind of event, then "anything else?". One question per screen.
 *  - Easy facts first (names, favorites), stories later, so people get going before they need to think.
 *  - Each label is one plain question. The hint says what helps and gives permission to keep it short or skip.
 *  - Buyers often do not know an answer on the spot (a show's name, a funny story), so hints say they can skip
 *    and come back: the draft saves in the browser.
 *  - First names only, and only people who are happy to be in the game (buyers avoid naming friends).
 */
const p = (id: string, label: string, hint: string, placeholder: string): Prompt => ({ id, label, hint, placeholder });

/** Shared by several events. */
const NICKNAMES = (pre: string) =>
  p(`${pre}-nick`, "What do people call {name}?", "Nicknames at home, with friends or at work. Add who uses which one.", "For example: Mom calls him Benji, and his friends call him B");
const FAVORITES = (pre: string) =>
  p(`${pre}-favs`, "What are {name}'s favorite things right now?", "Pick two or three: a food, a show, a song, a game, a team. Not sure? Skip and come back.", "For example: mac and cheese, any racing show, and the same playlist on repeat");
const HABIT = (pre: string) =>
  p(`${pre}-habit`, "What does {name} always do or always say?", "A habit, a phrase, a routine. Small things make the best questions.", "For example: says \"five more minutes\" every morning, and always takes the window seat");
const FUNNY = (pre: string) =>
  p(`${pre}-funny`, "What funny story do people tell about {name}?", "A mishap, a trip, a moment everyone remembers. A few lines are enough.", "For example: on a road trip he insisted on navigating, and we ended up in the wrong state");
const SURPRISE = (pre: string, who = "the guests") =>
  p(`${pre}-surprise`, `What would surprise ${who} about {name}?`, "A hidden talent, an odd fear, an unexpected favorite.", "For example: he collects perfume bottles and can name every one");

/** Birthday (any age): also the default for a person. */
const BIRTHDAY: Prompt[] = [
  NICKNAMES("b"),
  FAVORITES("b"),
  p("b-hobby", "What does {name} love doing in their free time?", "A sport, a hobby, a collection. Add one detail only close people know.", "For example: plays soccer twice a week and keeps every trophy on one shelf"),
  p("b-people", "Who are the important people in {name}'s life?", "Family, a best friend, a pet. First names are enough, and only people who will be happy to be in the game.", "For example: his sister Maya (9), his brother Theo (5), and Toffee the hamster"),
  HABIT("b"),
  p("b-known", "What is {name} known for?", "What they are great at, or what everyone asks them for help with.", "For example: the family math genius, and the only one who can fix the TV"),
  FUNNY("b"),
  p("b-year", "What happened in {name}'s life this past year?", "Something new, a win, a change, a first time.", "For example: started a new school, joined a league, and learned to make pancakes"),
  SURPRISE("b"),
];

const MILESTONE: Prompt[] = [
  NICKNAMES("m"),
  p("m-roots", "Where did {name} grow up, and what were they like as a kid?", "A hometown, a childhood nickname, what they wanted to be.", "For example: grew up in Ohio, wanted to be an astronaut, and never took off her baseball cap"),
  p("m-work", "What does {name} do, and how did they get there?", "Their job or calling, and one turn along the way.", "For example: a nurse for 20 years, after starting out in law school"),
  p("m-people", "Who are the important people in {name}'s life?", "Partner, kids, grandkids, best friends. First names are enough.", "For example: her husband Mark, the twins Amy and Jo, and her best friend since college, Lin"),
  FAVORITES("m"),
  HABIT("m"),
  p("m-decade", "What were the big moments of the last ten years?", "A move, a wedding, a new baby, a trip, a big change. Pick two or three.", "For example: moved to Denver, became a grandmother, and ran her first half marathon"),
  FUNNY("m"),
  SURPRISE("m"),
];

const MITZVAH: Prompt[] = [
  NICKNAMES("y"),
  p("y-family", "Who is in {name}'s family?", "Parents, siblings with their ages, grandparents, pets. First names are enough.", "For example: Dad Adam, his sister Maya (9), his brother Theo (5), and Toffee the hamster"),
  FAVORITES("y"),
  p("y-hobby", "What does {name} do after school?", "Sports, a hobby, a game, a collection. Add one detail only close people know.", "For example: plays in a soccer league, and goes bowling with friends on Fridays"),
  p("y-words", "Which three words describe {name}?", "Add a short example for one of them.", "For example: sensitive, responsible, funny. He always checks that everyone got home"),
  p("y-together", "What does {name} love doing with family?", "Something they do with a parent, a sibling or a grandparent.", "For example: watches every Formula 1 race with Mom, and boxes with his little brother in the living room"),
  HABIT("y"),
  FUNNY("y"),
  p("y-prep", "What is special about this day for {name}?", "The Torah portion, a project, how they prepared, what they are excited about. Optional.", "For example: practiced the portion every night with Grandpa on video calls"),
];

const FAREWELL: Prompt[] = [
  p("f-role", "What does {name} do, and for how long?", "The role, the team, the years. And how they started, if you know.", "For example: head of finance for 18 years, and started as an intern"),
  p("f-known", "What is {name} known for at work?", "What they are the best at, or what everyone comes to them for.", "For example: the only person who understands the old billing system"),
  p("f-habit", "What does {name} always do or say at work?", "A desk ritual, a line in every meeting, a mug nobody else may touch.", "For example: starts every meeting with \"quick question\", and it is never quick"),
  p("f-people", "Who does {name} work closest with?", "First names and what they do together. Only people who will be happy to be in the game.", "For example: lunch every day with Dana and Mike from sales"),
  p("f-moments", "Which work moments does everyone remember?", "A big project, a crisis they saved, a celebration.", "For example: the night before the big launch, when she ordered pizza for 40 people"),
  p("f-funny", "Which mishap can everyone laugh about today?", "Something that became a legend at work, without hurting anyone.", "For example: the client video call where his cat walked across the keyboard"),
  p("f-outside", "What does {name} love outside work?", "Family, a hobby, a team, a place they keep going back to.", "For example: gardening, the grandkids, and every baseball game on TV"),
  p("f-next", "What's next for {name}?", "A new job, a trip, a hobby they have waited for. Skip it if it is a secret.", "For example: a sailing trip, and finally learning Spanish"),
  SURPRISE("f", "colleagues"),
];

const BACHELOR: Prompt[] = [
  NICKNAMES("h"),
  p("h-partner", "Who is {name} marrying, and how did they meet?", "The partner's first name and the short version of the story.", "For example: Sam. They met in line for concert tickets that were already sold out"),
  p("h-proposal", "How did the proposal happen?", "Who asked, where, and one detail that went wrong or right.", "For example: on a hike, and the ring almost fell off the trail"),
  p("h-crew", "Who is coming to the party, and how does {name} know them?", "School, college, work, family. First names are enough.", "For example: college roommates Kate and Jo, and Lisa from the first job"),
  FAVORITES("h"),
  HABIT("h"),
  p("h-legend", "What is {name}'s most legendary night out?", "Keep it to something {name} will laugh about in front of everyone.", "For example: the karaoke night that ended with a standing ovation from strangers"),
  FUNNY("h"),
  p("h-future", "What is {name} looking forward to after the wedding?", "Plans, a dream trip, who will do the cooking.", "For example: getting a dog, and Sam doing all the cooking"),
];

const SHOWER: Prompt[] = [
  p("s-occasion", "What are we celebrating for {name}?", "The wedding or the baby, and roughly when.", "For example: a baby girl, due in March"),
  p("s-partner", "Who is {name}'s partner, and how did they meet?", "First name and the short version of the story.", "For example: Chris. They met at a friend's barbecue and argued about the music"),
  p("s-family", "Who is in {name}'s family?", "Parents, siblings, the people closest to them. First names are enough.", "For example: her mom Ruth, her big brother Dan, and her best friend Mia"),
  FAVORITES("s"),
  HABIT("s"),
  p("s-kid", "What was {name} like as a kid?", "A childhood nickname, a favorite toy, a dream job.", "For example: \"Bunny\", never let go of her stuffed giraffe, and wanted to be a vet"),
  FUNNY("s"),
  p("s-plans", "What plans can you share?", "Baby names on the list, the nursery, the honeymoon, the wedding theme. Only what they are happy to share.", "For example: the nursery is jungle themed, and the honeymoon is in Portugal"),
  SURPRISE("s"),
];

const WEDDING: Prompt[] = [
  p("w-met", "How did they meet?", "Where, when, and who was there.", "For example: at a friend's party, and he spilled coffee on her"),
  p("w-date", "What was their first date?", "Where they went, who was late, what happened.", "For example: mini golf, and she won by twelve points"),
  p("w-proposal", "How did the proposal happen?", "Who asked, where, and what was said.", "For example: on the roof, with a cake he baked himself"),
  p("w-quirks", "Who is who? Each one's habits", "Who is late, who tidies up, who cooks.", "For example: she is always late, and he always arrives ten minutes early"),
  p("w-people", "Who are the important people on each side?", "Parents, siblings, best friends. First names are enough.", "For example: her sister and maid of honor Lily, his best man and childhood friend Josh"),
  p("w-taste", "What song, show or food do they share?", "What they always pick together.", "For example: the first dance song, and a show they watched three times"),
  p("w-trip", "Which trip or memory do they keep telling?", "A place, an event, an adventure.", "For example: the trip to Italy where they lost the car keys"),
  p("w-inside", "What is their inside joke?", "Something only people who know them will get. We turn it into the question everyone waits for.", "For example: what they say when someone misses the exit"),
  p("w-day", "What will make the wedding day special?", "The venue, a theme, a tradition, a detail they planned together.", "For example: a barn wedding, and the cake is from the bakery of their first date"),
];

const ANNIVERSARY: Prompt[] = [
  p("a-met", "How long have {name} been together, and how did they meet?", "The years and the short version of the story.", "For example: 25 years. They met on a bus to a summer job"),
  p("a-wedding", "What do they remember from their wedding day?", "The place, the song, what went wrong.", "For example: it rained, and the band played their song twice by mistake"),
  p("a-home", "Where have they lived together?", "Cities, houses, the first apartment.", "For example: a tiny apartment in Chicago, then the house on Maple Street"),
  p("a-family", "Who is in their family today?", "Kids, grandkids, pets. First names are enough.", "For example: three kids, two grandkids, and Biscuit the dog"),
  p("a-quirks", "Who is who? Each one's habits", "Who drives, who cooks, who is always on time.", "For example: he cooks, she drives, and both claim to have the better sense of direction"),
  p("a-taste", "What song, show or food do they share?", "What they always pick together.", "For example: Friday pizza, and the same old movie every holiday"),
  p("a-trip", "Which trip or memory do they keep telling?", "A place, an event, an adventure.", "For example: the road trip where the car broke down and a farmer drove them to town"),
  p("a-tradition", "What is their tradition as a couple?", "Something they do every year, week or morning.", "For example: coffee on the porch every morning, rain or shine"),
  p("a-secret", "What is the secret of their relationship, in their words?", "A line they always say, or what their kids say about them.", "For example: \"never go to bed angry, go to bed hungry\""),
];

const FAMILY: Prompt[] = [
  p("g-who", "Who is in the family?", "The branches, the oldest and the youngest. First names are enough.", "For example: Grandma Rose, her four kids, and eleven grandkids from 2 to 24"),
  p("g-roots", "Where does the family come from?", "A hometown, the old family house, how the grandparents met.", "For example: a farm in Iowa, and Grandpa proposed at the county fair"),
  p("g-tradition", "What does the family always do when you get together?", "A ritual, a game, a toast, a seat nobody else takes.", "For example: the annual touch football game after lunch"),
  p("g-food", "What food is the family famous for?", "A recipe, who makes it, and who always takes the last piece.", "For example: Aunt Sue's lasagna, and Uncle Bob always takes the corner piece"),
  p("g-roles", "Who is who in the family?", "The planner, the joker, the one who is always late.", "For example: Mom plans everything, Jake is always late, and Grandpa tells the same joke"),
  p("g-memory", "Which family memory does everyone tell?", "A trip, a holiday, a day that went wrong in a good way.", "For example: the camping trip where the tent blew away"),
  p("g-joke", "What running joke keeps coming back?", "Something you only need to start for everyone to laugh.", "For example: \"who ate the pie?\" every Thanksgiving"),
  p("g-records", "Who holds the family records?", "Most grandkids, longest trip, oldest car, most pets.", "For example: Aunt Meg has five dogs, and Grandpa still drives his 1985 truck"),
  p("g-news", "What's new in the family this year?", "A new baby, a wedding, a move, a graduation.", "For example: two weddings, one new baby, and Sam started college"),
];

const REUNION: Prompt[] = [
  p("r-class", "Which school and which class year?", "And how many years it has been.", "For example: Lincoln High, class of 2006, twenty years ago"),
  p("r-places", "Where did everyone hang out?", "A table, a diner, a spot behind the gym.", "For example: the back table in the cafeteria, and the diner on Main Street"),
  p("r-teachers", "Which teachers does everyone remember?", "Names or nicknames, and what they always said.", "For example: Mr. Hall, who said \"settle down\" before anyone made a sound"),
  p("r-events", "What were the big events of those years?", "A trip, a big game, prom, a school play.", "For example: the senior trip to Washington, and the year the team made the finals"),
  p("r-who", "Who was who in the class?", "The class clown, the couple, the one who never came to class. Only what people will laugh about.", "For example: Tom was the class clown, and Jen and Mike were the couple everyone knew"),
  p("r-trends", "What was popular back then?", "Songs, shows, clothes, phones, slang.", "For example: flip phones, skinny jeans, and one song at every party"),
  p("r-memory", "Which story is still told today?", "A legend from those years that everyone will recognize.", "For example: the day the fire alarm went off during the math final"),
  p("r-joke", "What running joke keeps coming back?", "A line or a name you only need to say for everyone to laugh.", "For example: \"the cafeteria pizza\""),
  p("r-now", "What has happened since?", "Weddings, kids, moves, surprising careers. Only what people are happy to share.", "For example: three classmates live abroad, and Kevin is now a chef"),
];

const TEAM: Prompt[] = [
  p("t-what", "What does the team do, in a sentence or two?", "So the host can introduce the team.", "For example: we build the mobile app, and support everyone who uses it"),
  p("t-history", "How did the team start?", "The first project, the first office, the first hire.", "For example: three people in one room, and the first customer came through a friend"),
  p("t-who", "Who is who on the team?", "Roles, nicknames, the person who always does the same thing.", "For example: Dana always brings cake to the demo, and Ben is the only one who remembers how the system works"),
  p("t-win", "Which win is the team proudest of?", "A launch, a big deal, a target you hit.", "For example: shipping the new app in eight weeks"),
  p("t-culture", "What line does the team keep repeating?", "From meetings or the chat.", "For example: \"it works on my machine\" after every bug"),
  p("t-ritual", "What is the team's tradition?", "Lunch, a weekly demo, the morning stand-up.", "For example: every Thursday we eat together, and whoever is late buys coffee"),
  p("t-daily", "What does everyone talk about every day?", "A tool, an acronym, the coffee machine, the group chat.", "For example: the broken coffee machine, and whether it is a \"quick\" meeting"),
  p("t-legend", "Which mishap can everyone laugh about today?", "Something that became a legend, without hurting anyone.", "For example: the demo where the system went down at the worst moment"),
  p("t-next", "What is the next big goal?", "A launch, a target, a move.", "For example: double the users by the summer"),
];

/** Company and team events: workplace prompts instead of the family-and-friends ones. No real brands. */
const COMPANY: Partial<ShapeConfig> = {
  nameLabel: "What is the company or team called?",
  namePlaceholder: "For example: the product team, or Acme",
  nameHelp: "The name appears in the game. It can be a company, a department or a team.",
  extraLabel: "The occasion (optional)",
  extraPlaceholder: "For example: the end-of-year party",
  sampleQuestion: "What happens every Thursday at {name}?",
  sampleAnswers: ["Team meeting", "Lunch together", "A release", "A vote on pizza"],
  sampleCorrect: 1,
  prompts: [
    p("c-milestone", "What is the company celebrating?", "A launch, a big deal, a target you hit, a year together.", "For example: we shipped the first version after three months of late nights"),
    p("c-year", "What happened at the company this year?", "New people, a new office, a new product.", "For example: we hired 20 people and moved to the fifth floor"),
    p("c-who", "Who is who at the company?", "Roles, nicknames, the person who always does the same thing.", "For example: Dana always brings cake to the demo, and Ben is the only one who remembers how the system works"),
    p("c-history", "How did it all start?", "The first office, the first customer, the first hire.", "For example: three people in a garage, and the first customer came through a friend"),
    p("c-culture", "What line does everyone at work keep repeating?", "From meetings or the chat.", "For example: \"it works on my machine\" after every bug"),
    p("c-office", "What does everyone know about the office?", "The coffee, a plant, the name of a meeting room.", "For example: the plant named Kevin, and the meeting room nobody can book"),
    p("c-ritual", "What is the company's tradition?", "Lunch, a hackathon, the Friday demo.", "For example: every Thursday we eat together, and whoever is late buys coffee"),
    p("c-legend", "Which mishap can everyone laugh about today?", "Something that became a legend, without hurting anyone.", "For example: the customer demo where the system went down at the worst moment"),
    p("c-next", "What's ahead for next year?", "A goal, a launch, a move.", "For example: our first office abroad"),
  ],
};

/** The event tiles (placeholder list; Tanya will revise it). Each event has its own questions. */
export const EVENTS: EventTile[] = [
  { id: "birthday", label: "Birthday", shape: "person", icon: "🎂", target: 12 },
  { id: "round-birthday", label: "Milestone birthday", shape: "person", icon: "🎈", target: 12, override: { prompts: MILESTONE } },
  { id: "bar-bat", label: "Bar or bat mitzvah", shape: "person", icon: "✡️", target: 12, override: { prompts: MITZVAH } },
  { id: "farewell", label: "Farewell or retirement", shape: "person", icon: "👋", target: 12, override: { prompts: FAREWELL } },
  { id: "bachelor", label: "Bachelor or bachelorette party", shape: "person", icon: "🥂", target: 12, override: { prompts: BACHELOR } },
  { id: "shower", label: "Bridal or baby shower", shape: "person", icon: "🎁", target: 12, override: { prompts: SHOWER } },
  { id: "wedding", label: "Wedding", shape: "couple", icon: "💍", target: 12 },
  { id: "anniversary", label: "Anniversary", shape: "couple", icon: "💞", target: 12, override: { prompts: ANNIVERSARY } },
  { id: "family", label: "Family gathering", shape: "group", icon: "👨‍👩‍👧‍👦", target: 12 },
  { id: "reunion", label: "Class reunion", shape: "group", icon: "🎓", target: 12, override: { prompts: REUNION } },
  { id: "teambuilding", label: "Team day", shape: "group", icon: "🤝", target: 12, override: { prompts: TEAM } },
  { id: "toast", label: "Office party", shape: "group", icon: "🍾", target: 12, override: COMPANY },
];

const LEAD = "One question at a time. Short answers are fine. Not sure? Skip it: everything saves, so you can come back later.";

/** The wording for a person, a couple and a group; the questions are the default event's (birthday, wedding, family). */
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
    storiesLead: LEAD,
    prompts: BIRTHDAY,
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
    storiesLead: LEAD,
    prompts: WEDDING,
  },
  group: {
    nameLabel: "What is the group called?",
    namePlaceholder: "For example: the Miller family, the class of 2010, or the sales team",
    nameHelp: "The name appears in the game, so make it one everybody recognizes.",
    extraLabel: "The occasion (optional)",
    extraPlaceholder: "For example: Thanksgiving, or our 20-year reunion",
    title: "How much do you know about {name}?",
    sampleQuestion: "What does {name} do best together?",
    sampleAnswers: ["Organize", "Eat", "Argue", "Laugh"],
    sampleCorrect: 3,
    storiesTitle: "Tell us about {name}",
    storiesLead: LEAD,
    prompts: FAMILY,
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
    photoConverting: "Preparing your photo...",
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
    hostTitle: "Who hosts the game?",
    hostLead: "Every host is included. You can also let us choose.",
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
    lead: "Your receipt is in your inbox. We'll email you the game, and you can ask for changes before the event.",
    /** The tracker under the headline: the first step is done. */
    steps: ["Paid", "We build", "You review"],
    stepsLabel: "Order progress",
    orderNo: "Order",
    ideas: "Ideas for your event",
    home: "Back to the site",
    contact: "Questions? Email us",
  },
};
