/**
 * Copy and config for the intake prototype (/start).
 *
 * One flow for every event. What changes between events is only this file:
 *  - the 12 event tiles (same list as the landing marquee, `copy.he.ts` > eventsStrip),
 *  - 3 "shapes" (who the game is about: a person, a couple, a group) with their own wording and story prompts.
 *
 * Rules (CLAUDE.md): Hebrew only, plural "אתם", no em-dashes, no real people, no numbers for prices.
 * `{name}` is replaced with what the creator typed. Heuristics (`MATERIAL`) are starting points to tune with Ilan's generator.
 */

export type Shape = "person" | "couple" | "group";

export interface EventTile {
  id: string;
  label: string;
  shape: Shape;
  icon: string;
  /** How many questions the game aims for. Weddings and big groups get more. */
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
  /** Index of the correct sample answer (shown in green). */
  sampleCorrect: number;
  storiesTitle: string;
  storiesLead: string;
  prompts: Prompt[];
}

/** Company, tech and team toasts: workplace examples and prompts instead of the family-and-friends ones. No real brands. */
const COMPANY: Partial<ShapeConfig> = {
  nameLabel: "איך קוראים לחברה או לצוות?",
  namePlaceholder: "לדוגמה: צוות הפיתוח או חברת אלפא",
  nameHelp: "השם יופיע במשחק. אפשר שם של חברה, מחלקה או צוות.",
  extraLabel: "בערך כמה עובדים? (לא חובה)",
  extraPlaceholder: "לדוגמה: 80",
  sampleQuestion: "מה קורה בכל יום חמישי אצל {name}?",
  sampleAnswers: ["ישיבת צוות", "ארוחה משותפת", "עדכון גרסה", "הצבעה על פיצה"],
  sampleCorrect: 1,
  storiesLead: "כמו שמספרים לחבר, בכמה משפטים. אפשר לשלוח את הקישור לעמיתים שמכירים יותר ולבקש שיוסיפו. אפשר לדלג על מה שלא מתאים, ואפשר גם להוסיף שאלות ותשובות משלכם.",
  prompts: [
    { id: "c-milestone", label: "ההישג שמחגגים", hint: "השקה, סבב גיוס, יעד שנסגר, שנה שלמה ביחד", placeholder: "לדוגמה: סגרנו את הגרסה הראשונה אחרי שלושה חודשים של לילות ארוכים" },
    { id: "c-culture", label: "בדיחה או משפט שחוזרים בצוות", hint: "משהו שכל העובדים מכירים, מהפגישות ומהצ'אט", placeholder: "לדוגמה: 'זה עובד אצלי' אחרי כל באג" },
    { id: "c-who", label: "מי זה מי בצוות?", hint: "תפקידים, כינויים, ומי שתמיד עושה את אותו הדבר", placeholder: "לדוגמה: דנה תמיד מביאה עוגה לדמו, ואורי היחיד שזוכר איך המערכת עובדת" },
    { id: "c-history", label: "איך הכול התחיל?", hint: "הרגע הראשון של החברה או של הצוות, המשרד הראשון, הלקוח הראשון", placeholder: "לדוגמה: התחלנו בשלושה אנשים וחדר אחד, והלקוח הראשון הגיע מחבר" },
    { id: "c-ritual", label: "מסורת או טקס קבוע", hint: "ארוחת צהריים, האקתון, ישיבת בוקר, מצגת סוף שבוע", placeholder: "לדוגמה: כל יום חמישי אוכלים ביחד, ומי שמאחר קונה קפה לכולם" },
    { id: "c-legend", label: "תקלה או סיפור שאפשר לצחוק עליו היום", hint: "משהו שהפך לאגדה בארגון, בלי לפגוע באף אחד", placeholder: "לדוגמה: הדמו ללקוח שבו המערכת נפלה ברגע הכי לא נכון" },
  ],
};

export const EVENTS: EventTile[] = [
  { id: "birthday", label: "יום הולדת", shape: "person", icon: "🎂", target: 12 },
  { id: "round-birthday", label: "יום הולדת עגול", shape: "person", icon: "🎈", target: 12 },
  { id: "bar-bat", label: "בר או בת מצווה", shape: "person", icon: "✡️", target: 12 },
  { id: "farewell", label: "מסיבת פרידה או פרישה", shape: "person", icon: "👋", target: 12 },
  { id: "bachelor", label: "מסיבת רווקים או רווקות", shape: "person", icon: "🥂", target: 12 },
  { id: "wedding", label: "חתונה", shape: "couple", icon: "💍", target: 12 },
  { id: "henna", label: "חינה", shape: "couple", icon: "🪔", target: 12 },
  { id: "anniversary", label: "יום נישואין", shape: "couple", icon: "💞", target: 12 },
  { id: "family", label: "אירוע משפחתי", shape: "group", icon: "👨‍👩‍👧‍👦", target: 12 },
  { id: "reunion", label: "פגישת מחזור", shape: "group", icon: "🎓", target: 12 },
  { id: "teambuilding", label: "יום גיבוש", shape: "group", icon: "🤝", target: 12 },
  { id: "toast", label: "הרמת כוסית", shape: "group", icon: "🍾", target: 12, override: COMPANY },
];

export const SHAPES: Record<Shape, ShapeConfig> = {
  person: {
    nameLabel: "איך קוראים לחוגג.ת?",
    namePlaceholder: "לדוגמה: נועה",
    nameHelp: "השם יופיע במשחק, אז כדאי לכתוב אותו כמו שקוראים לו באירוע.",
    extraLabel: "עוד מילה אחת עליו.ה (לא חובה)",
    extraPlaceholder: "גיל, כיתה או תפקיד",
    title: "כמה אתם מכירים את {name}?",
    sampleQuestion: "מה האוכל האהוב על {name}?",
    sampleAnswers: ["פיצה", "סושי", "שווארמה", "גלידה"],
    sampleCorrect: 0,
    storiesTitle: "ספרו לנו על {name}",
    storiesLead: "כמו שמספרים לחבר, בכמה משפטים. אפשר לדלג על מה שלא מתאים, ואפשר גם להוסיף שאלות ותשובות משלכם.",
    prompts: [
      { id: "loves", label: "מה {name} אוהב.ת?", hint: "אוכל, שיר, סדרה, תחביב, משחק", placeholder: "לדוגמה: פיצה עם תירס, שיר אחד שמשמיעים בלופ, כדורסל" },
      { id: "sayings", label: "כינויים ומשפטים שאומרים כל הזמן", hint: "מה כולם מכירים? איך קוראים לו.ה בבית?", placeholder: "לדוגמה: כולם קוראים לה 'נונה', והמשפט שלה הוא 'עוד שנייה'" },
      { id: "habit", label: "הרגל מצחיק שכולם מכירים", hint: "משהו קטן ואישי שמעלה חיוך", placeholder: "לדוגמה: מסדר את הנעליים לפי צבעים" },
      { id: "story", label: "סיפור אחד שמספרים עליו.ה", hint: "במשפחה, בכיתה או בין חברים. כמה שורות מספיקות.", placeholder: "לדוגמה: פעם בטיול הוא החליט לנווט ואנחנו הגענו לחניון אחר" },
      { id: "people", label: "מי האנשים הכי קרובים?", hint: "שמות וקשר: אחים, חברים, סבא וסבתא", placeholder: "לדוגמה: אחיה הקטן יואב, החברה הכי טובה מאיה, סבתא רחל" },
      { id: "inside", label: "בדיחה פנימית", hint: "משהו שרק מי שהיה שם יבין. נהפוך אותו לשאלה שכולם מחכים לה.", placeholder: "לדוגמה: מה קרה בשבת עם הפנקייק?" },
    ],
  },
  couple: {
    nameLabel: "איך קוראים לשניים?",
    namePlaceholder: "לדוגמה: דנה ואורי",
    nameHelp: "שני השמות, כמו שהאורחים מכירים אותם.",
    extraLabel: "כמה זמן ביחד? (לא חובה)",
    extraPlaceholder: "לדוגמה: 7 שנים",
    title: "כמה אתם מכירים את {name}?",
    sampleQuestion: "איפה {name} נפגשו לראשונה?",
    sampleAnswers: ["בצבא", "בעבודה", "דרך חברים", "באוניברסיטה"],
    sampleCorrect: 2,
    storiesTitle: "ספרו לנו על {name}",
    storiesLead: "כמו שמספרים לחבר, בכמה משפטים. אפשר לדלג על מה שלא מתאים, ואפשר גם להוסיף שאלות ותשובות משלכם.",
    prompts: [
      { id: "met", label: "איך הם הכירו?", hint: "איפה, מתי ומי היה שם", placeholder: "לדוגמה: במסיבה של חברים משותפים, והוא שפך עליה קפה" },
      { id: "proposal", label: "איך זה קרה? הצעה, החלטה או רגע מיוחד", hint: "מי הציע, איפה ומה אמרו", placeholder: "לדוגמה: על הגג, עם עוגה שהוא אפה בעצמו" },
      { id: "quirks", label: "מי מהם מי? ההרגלים של כל אחד", hint: "מי מאחר, מי מסדר, מי מבשל", placeholder: "לדוגמה: היא תמיד מאחרת, והוא תמיד מגיע עשר דקות לפני" },
      { id: "trip", label: "טיול או זיכרון משותף", hint: "מקום, אירוע או הרפתקה שהם מספרים עליה", placeholder: "לדוגמה: הטיול באיטליה שבו איבדנו את המפתחות" },
      { id: "taste", label: "שיר, סדרה או אוכל משותף", hint: "מה שהם תמיד בוחרים ביחד", placeholder: "לדוגמה: השיר של הריקוד הראשון, סדרה שראו שלוש פעמים" },
      { id: "inside", label: "בדיחה פנימית של השניים", hint: "משהו שרק מי שמכיר אותם יבין", placeholder: "לדוגמה: מה אומרים כשמישהו מפספס את הפנייה" },
    ],
  },
  group: {
    nameLabel: "איך קוראים לקבוצה?",
    namePlaceholder: "לדוגמה: משפחת כהן, מחזור ב' או צוות המכירות",
    nameHelp: "השם יופיע במשחק, אז כדאי שכולם יזהו אותו.",
    extraLabel: "בערך כמה אנשים? (לא חובה)",
    extraPlaceholder: "לדוגמה: 40",
    title: "כמה אתם יודעים על {name}?",
    sampleQuestion: "מה {name} עושים הכי טוב ביחד?",
    sampleAnswers: ["מתארגנים", "אוכלים", "מתווכחים", "צוחקים"],
    sampleCorrect: 3,
    storiesTitle: "ספרו לנו על {name}",
    storiesLead: "כמו שמספרים לחבר, בכמה משפטים. אפשר לשלוח את הקישור למי שמכיר יותר ולבקש שיוסיף. אפשר לדלג על מה שלא מתאים, ואפשר גם להוסיף שאלות ותשובות משלכם.",
    prompts: [
      { id: "memory", label: "זיכרון משותף שכולם מספרים", hint: "אירוע, טיול או יום שנשאר בראש", placeholder: "לדוגמה: היום שבו האוטובוס נתקע ושרנו שעה ברחוב" },
      { id: "running", label: "בדיחה קבועה או משפט שחוזר", hint: "משהו שמספיק להתחיל אותו כדי שכולם יצחקו", placeholder: "לדוגמה: 'זה לא באחריותי' אחרי כל תקלה" },
      { id: "who", label: "מי זה מי?", hint: "תפקידים, כינויים ומי שתמיד עושה את אותו הדבר", placeholder: "לדוגמה: רועי תמיד מביא את העוגה, ליאן תמיד מאחרת" },
      { id: "history", label: "איך הכול התחיל?", hint: "ההיסטוריה של הקבוצה בכמה שורות", placeholder: "לדוגמה: התחלנו בכיתה ז' באותו שולחן אחרון" },
      { id: "tradition", label: "מסורת או טקס קבוע", hint: "משהו שעושים כל פעם שנפגשים", placeholder: "לדוגמה: תמיד מתחילים בצילום קבוצתי מביך" },
      { id: "place", label: "מקום, מוצר או נושא שמזוהה איתכם", hint: "משהו שכל מי שבקבוצה מכיר", placeholder: "לדוגמה: הפיצרייה ליד המשרד" },
    ],
  },
};

/** How much written material counts as one question (starting heuristic, tune with the generator). */
export const MATERIAL = {
  /** An answer shorter than this does not count as answered. */
  minChars: 2,
  /** Characters of story that make one question. */
  charsPerQuestion: 60,
  /** One prompt cannot feed more than this many questions, so one long story is not enough alone. */
  maxPerPrompt: 3,
  /** A photo with a caption is worth this many questions. */
  perPhoto: 1,
  maxPhotos: 5,
  /** The "continue" button unlocks at this many answered prompts. */
  minPrompts: 3,
};

/** Ilan's ready hosts (names, lines and photos copied from his /create step 2). Photos: public/intake/hosts. */
export const HOSTS = [
  { id: "auto", name: "תבחרו בשבילי", line: "נתאים מנחה לאירוע", image: "" },
  { id: "ido", name: "עידו", line: "המנחה הקלאסי, באולפן הכחול", image: "/intake/hosts/ido.webp" },
  { id: "cartoon", name: "גולי", line: "דמות מצוירת עם המון אופי", image: "/intake/hosts/cartoon.webp" },
  { id: "noa", name: "נועה", line: "צעירה, קלילה ובקצב שלכם", image: "/intake/hosts/noa.webp" },
  { id: "lian", name: "ליאן", line: "סטייל של יוצרת תוכן, באולפן הכתום", image: "/intake/hosts/lian.webp" },
  { id: "football", name: "רועי", line: "אנרגיה של גמר, באולפן הירוק", image: "/intake/hosts/football.webp" },
  { id: "menachem", name: "מנחם", line: "חיוך חם, באולפן הבורדו", image: "/intake/hosts/menachem.webp" },
];

export const INTAKE = {
  meta: {
    title: "בונים משחק | טדאם!",
    description: "מזמינים משחק טריוויה אישי לאירוע: מספרים, מזמינים ומשלמים.",
  },

  save: "נשמר אוטומטית",
  restart: "להתחיל מחדש",
  back: "חזרה",
  next: "המשך",
  stepWord: "שלב",
  of: "מתוך",

  start: {
    title: "בונים את המשחק של האירוע שלכם",
    lead: "מספרים לנו על האירוע בעשר דקות, ואנחנו בונים מזה שעשועון טריוויה אישי.",
    priceNote: "למשחק שלם. משלמים רק בסוף.",
    cta: "בואו נתחיל",
  },

  event: {
    title: "מה חוגגים?",
  },

  who: {
    titleLabel: "שם המשחק",
    titleEdit: "לשנות את שם המשחק",
    screenNote: "ככה המשחק ייפתח על המסך הגדול",
    required: "כתבו שם כדי להמשיך",
  },

  stories: {
    answered: "נענתה",
    save: "שמירה",
    modeFree: "סיפור חופשי",
    modeChoice: "ארבע אפשרויות",
    choiceQuestion: "השאלה",
    choiceHelp: "כתבו ארבע תשובות וסמנו איזו מהן נכונה. האורחים יבחרו אחת.",
    savedMsg: "נשמר",
    photoNeed: "כתבו שאלה ותשובה כדי לשמור",
    photoSaved: "נשמרה",
    skip: "דלגו",
    counter: "{n} מתוך {total} שאלות",
    meterLabel: "יש לנו חומר ל",
    meterHelp: "ככל שתספרו יותר, המשחק אישי יותר.",
    needMore: "כדי לבנות משחק צריך לפחות 3 תשובות. חסרות עוד {n}.",
    backToQuestions: "חזרה לשאלות",
    ready: "מספיק כדי להתחיל",
    typeHere: "כתבו כאן",
    mic: "אפשר גם להקליט",
    micStop: "סיום הקלטה",
    recording: "מקליטים עכשיו, אפשר לדבר",
    heard: "מה ששמענו:",
    micDenied: "כדי להקליט צריך לאפשר גישה למיקרופון. אם פתחתם מוואטסאפ או מאינסטגרם, נסו לפתוח בכרום או בספארי.",
    micEmpty: "לא שמענו כלום, נסו שוב.",
    micUnsupported: "ההקלטה לא נתמכת בדפדפן הזה. אפשר לכתוב.",
    photosTitle: "תמונות עם שאלה",
    photosHelp: "כל תמונה הופכת לשאלה. כתבו שאלה על התמונה, ואז תשובה חופשית או ארבע אפשרויות עם אחת נכונה.",
    photosPlaceholder: "לדוגמה: איפה צולמה התמונה?",
    photosAdd: "הוסיפו תמונה",
    photosCaption: "השאלה על התמונה",
    photosRemove: "הסרה",
    photosConsent: "מעלים רק תמונות שיש לכם רשות להשתמש בהן. אפשר לבקש מחיקה בכל שלב.",
    photosLimit: "אפשר עד 5 תמונות",
    photosAgain: "בחרו שוב את התמונה",
    helpTitle: "למה שואלים?",
    help: "כל תשובה הופכת לשאלה אחת או יותר, מהמילים שלכם. אנחנו לא ממציאים עובדות, ולכן על מה שלא כתבתם לא נשאל.",
    share: "מישהו אחר מכיר יותר טוב?",
    shareHelp: "שלחו את הקישור להורה השני או לחבר, והם ימשיכו מאותה נקודה.",
    shareBtn: "שליחה בוואטסאפ",
    shareText: "הנה הטיוטה של המשחק לאירוע. אפשר להוסיף סיפורים: ",
  },

  more: {
    title: "יש לנו כבר חומר ל-{n} שאלות על {name}",
    titleFew: "כמעט שם. עוד קצת על {name}",
    lead: "רוצים להוסיף עוד משהו? לא חובה, אפשר פשוט להמשיך.",
    ownHint: "שאלה שרק אתם יודעים לשאול",
    photosHint: "כל תמונה הופכת לשאלה במשחק",
    shareHint: "שלחו להם את הקישור והם יוסיפו",
    count: "שאלה {i} מתוך {n}",
    skip: "דלגו",
  },

  details: {
    whenTitle: "מתי האירוע?",
    whenLead: "לא חובה. זה עוזר לנו לתכנן את הזמנים.",
    hostTitle: "מי מנחה את המשחק?",
    hostLead: "כולם כלולים במחיר. אפשר גם לתת לנו לבחור.",
    date: "תאריך האירוע",
    guests: "כמה אורחים בערך?",
    cta: "לסיכום ההזמנה",
  },

  order: {
    title: "הכול מוכן להזמנה",
    meta: "{event} · מנחה: {host} · חומר ל-{n} שאלות",
    metaPhotos: " · תמונות: {n}",
    priceLabel: "לתשלום",
    includes: ["משחק אישי מהסיפורים שלכם, עם מנחה על המסך הגדול", "כל האורחים משחקים מהטלפון", "עד 2 סבבי תיקונים לפני האירוע"],
    email: "לאיזה מייל לשלוח את המשחק?",
    consent: "השמות והעובדות שכתבנו נכונים, ויש לנו רשות להשתמש בתמונות.",
    cta: "לתשלום",
    sending: "שולחים את ההזמנה...",
    payNote: "התשלום בדף מאובטח. כתבו שם את אותו מייל, כדי שנחבר את התשלום להזמנה.",
    errRequired: "כתבו מייל תקין וסמנו את האישור.",
    errSend: "לא הצלחנו לשלוח את ההזמנה. מה שמילאתם נשמר, נסו שוב בעוד רגע.",
    photosMissing: "חלק מהתמונות לא נשמרו בדפדפן. חזרו ובחרו אותן שוב, או המשיכו בלעדיהן.",
  },

  pay: {
    title: "ההזמנה נשלחה",
    note: "כאן הלקוח עובר לדף התשלום. הקישור של מורנינג עדיין לא מחובר, ולכן המסך הזה מופיע במקומו.",
    cta: "למסך שאחרי התשלום",
  },

  thanks: {
    metaTitle: "התשלום התקבל | טדאם!",
    title: "יש! המשחק שלכם בדרך",
    lead: "התשלום התקבל וההזמנה אצלנו.",
    orderNo: "מספר הזמנה",
    next: [
      { t: "קבלה במייל", d: "נשלחת אליכם אוטומטית עכשיו." },
      { t: "אנחנו בונים", d: "מהסיפורים ומהתמונות ששלחתם." },
      { t: "אתם בודקים", d: "המשחק מגיע במייל, עם עד 2 סבבי תיקונים." },
    ],
    ideasTitle: "בינתיים, רעיונות לאירוע הבא",
    ideasAll: "לכל הכתבות",
    home: "חזרה לאתר",
    contact: "יש שאלה? כתבו לנו",
  },

  stage5: {
    hostTitle: "מי מנחה את המשחק?",
    hostHelp: "המנחים כלליים ולא דמויות מוכרות. הקול נבחר לפי המנחה.",
    ownAdd: "הוסיפו שאלה משלכם",
    ownTitle: "שאלה משלכם",
    ownSection: "יש לכם שאלה משלכם?",
    ownSectionHelp: "אפשר להוסיף כמה שאלות שרוצים, כמו שאתם מכירים אותם. כל שאלה היא תשובה חופשית או בחירה מארבע אפשרויות.",
    ownHelp: "כתבו ארבע תשובות וסמנו איזו מהן נכונה.",
    ownType: "סוג השאלה",
    ownTypeFree: "תשובה חופשית",
    ownTypeChoice: "ארבע אפשרויות",
    ownFreeAnswer: "התשובה הנכונה",
    ownFreeHelp: "האורחים יכתבו את התשובה בעצמם.",
    ownRemove: "הסרה",
    ownQuestion: "השאלה",
    ownAnswer: "תשובה",
    ownCorrect: "זו התשובה הנכונה",
    ownCorrectShort: "נכונה",
    ownSave: "הוספה לרשימה",
    ownCancel: "ביטול",
    ownNeed: "כתבו את השאלה והתשובה הנכונה",
    ownNeedChoice: "כתבו שאלה וארבע תשובות, וסמנו את הנכונה",
  },
};

export function fill(text: string, vars: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}
