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
  { id: "toast", label: "הרמת כוסית", shape: "group", icon: "🍾", target: 12 },
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
    storiesLead: "כמו שמספרים לחבר. כל תשובה הופכת לשאלה אחת או יותר. אפשר לדלג על מה שלא מתאים.",
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
    storiesLead: "כמו שמספרים לחבר. כל תשובה הופכת לשאלה אחת או יותר. אפשר לדלג על מה שלא מתאים.",
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
    storiesLead: "כמו שמספרים לחבר. אפשר גם לשלוח את הקישור למי שמכיר יותר ולבקש שיוסיף. אפשר לדלג על מה שלא מתאים.",
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
  minChars: 20,
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

export const HOSTS = [
  { id: "auto", name: "תבחרו בשבילי", line: "נתאים מנחה לאירוע" },
  { id: "ido", name: "עידו", line: "קלאסי, כמו בגמר" },
  { id: "noa", name: "נועה", line: "חמה וקלילה" },
  { id: "lian", name: "ליאן", line: "אנרגטית ומצחיקה" },
  { id: "roi", name: "רועי", line: "רגוע ובטוח בעצמו" },
  { id: "menachem", name: "מנחם", line: "ותיק ומנוסה" },
];

export const INTAKE = {
  meta: {
    title: "בונים משחק | טדאם!",
    description: "אב טיפוס של תהליך הבקשה למשחק. לא לפרסום.",
  },

  prototypeBadge: "אב טיפוס: ככה ייראה התהליך",
  save: "נשמר אוטומטית",
  restart: "להתחיל מחדש",
  back: "חזרה",
  next: "המשך",
  stepWord: "שלב",
  of: "מתוך",
  stages: ["אירוע", "על מי", "סיפורים", "פרטים", "המשחק"],

  start: {
    eyebrow: "בלי הרשמה ובלי כרטיס אשראי",
    title: "בונים את המשחק של האירוע שלכם",
    lead: "מספרים לנו על האירוע בעשר דקות בערך. אנחנו בונים מזה משחק טריוויה אישי.",
    bullets: [
      "אפשר לעצור ולחזור בדיוק מאיפה שהפסקתם. הכול נשמר.",
      "האורחים משחקים מהטלפון בסריקת קוד אחד, בלי אפליקציה ובלי חשבון.",
      "שום דבר לא עולה למסך בלי האישור שלכם.",
    ],
    cta: "בואו נתחיל",
  },

  event: {
    title: "איזה אירוע חוגגים?",
    lead: "נקודת ההתחלה. נתאים לפי זה את השאלות שנשאל אתכם.",
  },

  who: {
    title: "על מי המשחק?",
    titleLabel: "שם המשחק",
    titleHelp: "הכנו שם. אפשר לשנות אותו עכשיו או בהמשך.",
    sampleBadge: "דוגמה בלבד",
    sampleNote: "ככה ייראו השאלות, בתשובות אמיתיות מהסיפורים שלכם. התשובה הנכונה בירוק.",
    required: "כתבו שם כדי להמשיך",
  },

  stories: {
    answered: "נענתה",
    skip: "דלגו",
    counter: "{n} מתוך {total} שאלות",
    meterLabel: "יש לנו חומר ל",
    meterHelp: "ככל שתספרו יותר, המשחק אישי יותר.",
    needMore: "ענו על עוד {n} שאלות כדי להמשיך",
    ready: "מספיק כדי להתחיל",
    typeHere: "כתבו כאן",
    mic: "אפשר גם להקליט",
    micStop: "סיום הקלטה",
    recording: "מקליטים עכשיו, אפשר לדבר",
    heard: "מה ששמענו:",
    micDenied: "כדי להקליט צריך לאפשר גישה למיקרופון. אם פתחתם מוואטסאפ או מאינסטגרם, נסו לפתוח בכרום או בספארי.",
    micEmpty: "לא שמענו כלום, נסו שוב.",
    micUnsupported: "ההקלטה לא נתמכת בדפדפן הזה. אפשר לכתוב.",
    photosTitle: "תמונות עם כיתוב",
    photosHelp: "תמונה עם כיתוב טוב הופכת לשאלה. לדוגמה: 'הטיול בצפון, 2019. מי צילם?'",
    photosAdd: "הוסיפו תמונה",
    photosCaption: "כיתוב לתמונה",
    photosRemove: "הסרה",
    photosConsent: "מעלים רק תמונות שיש לכם רשות להשתמש בהן. אפשר לבקש מחיקה בכל שלב.",
    photosLimit: "אפשר עד 5 תמונות",
    help: "למה שואלים? כל תשובה הופכת לשאלה במשחק, ושום דבר לא מומצא. אם לא כתבתם, לא נשאל על זה.",
    share: "מישהו אחר מכיר יותר טוב?",
    shareHelp: "שלחו את הקישור להורה השני או לחבר, והם ימשיכו מאותה נקודה.",
    shareBtn: "שליחה בוואטסאפ",
    shareText: "הנה הטיוטה של המשחק לאירוע. אפשר להוסיף סיפורים: ",
  },

  details: {
    title: "כמה פרטים על האירוע",
    lead: "לא חובה, ואפשר לדלג. זה עוזר לנו לתכנן את הזמנים.",
    skip: "דלגו, נמשיך",
    date: "תאריך האירוע",
    dateHelp: "כדאי להתחיל כמה ימים לפני האירוע, כדי שיהיה זמן לבדוק את המסך והסאונד.",
    guests: "כמה אורחים בערך?",
    screen: "על מה יוצג המשחק?",
    screens: ["מחשב מחובר למסך", "מקרן", "עדיין לא יודעים"],
    contact: "לאן לשלוח את הקישור?",
    contactHelp: "וואטסאפ או מייל. רק כדי לשלוח לכם את הקישור למשחק ולטיוטה.",
    contactPlaceholder: "מספר טלפון או כתובת מייל",
    cta: "יוצרים את המשחק",
  },

  stage5: {
    note: "המסך הזה הוא הדמיה. בפועל היצירה לוקחת כמה דקות והמסך הבא מגיע מהמשחק האמיתי.",
    generating: "בונים את המשחק של {name}",
    stages: ["קוראים את הסיפורים", "כותבים שאלות מכל סיפור", "מוסיפים תשובות ותמונות", "מכינים את המנחה"],
    waitHint: "בינתיים בחרו מי יהיה המנחה.",
    hostTitle: "מי מנחה את המשחק?",
    hostHelp: "המנחים כלליים ולא דמויות מוכרות. הקול נבחר לפי המנחה.",
    reviewTitle: "בודקים ומאשרים",
    reviewLead: "עוברים על כל שאלה. שום דבר לא עולה למסך בלי האישור שלכם.",
    questionOf: "שאלה {i} מתוך {n}",
    own: "שאלה משלכם",
    ownAdd: "הוסיפו שאלה משלכם",
    ownTitle: "שאלה משלכם",
    ownHelp: "כתבו שאלה, ארבע תשובות, וסמנו איזו מהן נכונה.",
    ownQuestion: "השאלה",
    ownAnswer: "תשובה",
    ownCorrect: "זו התשובה הנכונה",
    ownSave: "הוספה לרשימה",
    ownCancel: "ביטול",
    ownNeed: "כתבו שאלה וארבע תשובות, וסמנו את הנכונה",
    ownMark: "שאלה שלכם",
    ownEdited: "ממתינה לאישור",
    source: "נבנתה מהסיפור שלכם",
    placeholderQuestion: "כאן תופיע השאלה עם ארבע תשובות, ותוכלו לערוך או לבקש ניסוח אחר.",
    approve: "מאשרים",
    approved: "אושרה",
    rewrite: "ניסוח אחר",
    checklist: [
      "השמות כתובים נכון",
      "העובדות נכונות",
      "יש לנו רשות להשתמש בתמונות",
    ],
    shareReview: "שלחו להורה השני לבדיקה",
    toOrder: "לאישור והזמנה",
    orderTitle: "הזמנה",
    orderSummary: "סיכום",
    orderPrice: "המחיר יופיע כאן לפני התשלום, ולא נבקש כרטיס אשראי לפני שאישרתם.",
    orderEta: "אחרי ההזמנה נשלח לכם מייל כשהמשחק מוכן.",
    orderDate: "האירוע ב{date}. כדאי להזמין כמה ימים לפני.",
    orderCta: "הזמנת המשחק",
    launchTitle: "המשחק של {name} מוכן",
    launchLead: "האורחים סורקים את הקוד או מזינים את הקוד הקצר. בלי אפליקציה ובלי חשבון.",
    codeLabel: "קוד קצר",
    copyLink: "העתקת קישור",
    copied: "הועתק",
    testTitle: "בדיקת מערכת לפני האירוע",
    test: ["הסאונד עובד והמסך מחובר", "האינטרנט יציב באולם", "סרקנו את הקוד מטלפון"],
    editNote: "הקישור הפרטי שלכם הוא מפתח העריכה. אל תשלחו אותו לאורחים, הם מקבלים את קוד ההצטרפות.",
    devTitle: "מה נשלח לטדאם (למפתחים)",
    devJson: "הבריף במבנה JSON",
    devText: "אותו בריף כטקסט לשלב 1 של האפליקציה",
    devCopy: "העתקה",
  },
};

export function fill(text: string, vars: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}
