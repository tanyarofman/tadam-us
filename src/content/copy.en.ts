/**
 * All the landing page copy in English, for English speakers in Israel (`/en/`).
 * A translation of copy.he.ts: same keys, same order, same story. Change the Hebrew first, then mirror it here.
 * Rules: plain, warm English, "you" for the parents and organizers, no em-dashes.
 */

export const COPY = {
  /** The brand name as written in this language (logo label, page titles, structured data). */
  brand: "Tadam!",
  closing: {
    title: "So, who gets a Tadam?",
    cta: "Let's create a game",
  },
  meta: {
    title: "Tadam! A live trivia game show for your event",
    description:
      "Your stories, photos and personal details become an interactive game",
    ogAlt: "Tadam! A personal game show for your event",
  },

  nav: {
    skip: "Skip to content",
    /** The link to the other language version of the same page. */
    langSwitch: "עברית",
    langSwitchLabel: "לגרסה בעברית",
  },

  hero: {
    headline: "The moment everyone will remember from your event.",
    /** The headline word that gets the magenta swoosh, and the word count before the line break (wide screens, 0 = none). */
    highlight: "remember",
    breakAfter: 0,
    sub: "Your stories, photos and personal details become a live trivia game show, with a host on the big screen.",
    ctaPrimary: "Let's get started",
    ctaSecondary: "Watch the demo video",
    loading: "Loading",
    nav: [
      { label: "How it works", href: "#scene-4" },
      { label: "Our hosts", href: "#hosts" },
      { label: "FAQ", href: "#faq" },
    ],
    navCta: "Let's get started",
    navLabel: "Main navigation",
    loopLabel: "A synced demo of the game on the big screen and on a phone",
    loopCaption: "Guests join from their phones, no app needed",
  },

  eventsStrip: {
    label: "Events that Tadam! is a great fit for",
    items: [
      "Birthdays",
      "Bar and bat mitzvahs",
      "Holiday toasts",
      "Company events",
      "Weddings",
      "Anniversaries",
      "Family events",
      "Bachelor and bachelorette parties",
      "Milestone birthdays",
      "Henna parties",
      "Class reunions",
      "Team-building days",
      "Farewell and retirement parties",
    ],
  },

  scene1: {
    headline: "Every event has that moment when everyone is waiting for something.",
    highlight: "waiting",
    photoAlt: "Guests at a family event sit around tables, eating and looking at their phones before the game starts",
    hallLabel: "Illustration: an event hall with tables, a DJ booth and colorful lights. In the corner, bored guests on their phones.",
  },

  scene3: {
    burst: "Tadam!",
    headline: "Then the lights go down, the screen comes to life, and the host takes the stage.",
    demo: {
      label: "A demo of a real game (in Hebrew): the big screen and the phone",
      play: "Play",
      pause: "Pause",
      unmute: "Turn sound on",
      mute: "Mute",
      fullscreen: "Full screen",
      replay: "Play again",
      hint: "Sound is off. Tap to listen.",
    },
  },

  scene4: {
    headline: "Here's how it works.",
    steps: [
      {
        title: "You talk to us.",
        text: "Tell us about the event and the guests of honor.",
      },
      {
        title: "You pick a host and a vibe.",
        text: "Tailor the game to your event.",
      },
      {
        title: "We build the game.",
        text: "Questions, photos and a host on the big screen.",
      },
    ],
    mock: {
      chatFrom: "Tadam!",
      chatText: "Hi! I'd love to hear about Tadam! for Noa's birthday 🎉",
      chatReply: "How fun! Tell us a bit about Noa and the event",
      hostTitle: "Your host",
      atmosphereTitle: "Your vibe",
      boardTitle: "Noa's game",
      tiles: ["Question", "Photo", "Story", "Joke", "Question", "Host"],
    },
  },

  scene5: {
    headline: "Scan, play, and everyone answers together.",
    highlight: "together",
  },

  scene6: {
    leaderboardTitle: "Leaderboard",
    drumroll: "And the winner is...",
    players: [
      { name: "Grandma Rachel", score: 2840, winner: true },
      { name: "Maya, the best friend", score: 2710 },
      { name: "Uncle Avi", score: 2390 },
      { name: "Roni from work", score: 2150 },
      { name: "Dad", score: 1980 },
    ],
    headline: "And in the end, everyone finds out who the real champions are",
  },

  scene7: {
    headline: "Want to see it for yourselves?",
    highlight: "yourselves",
    contact: "Create a game",
    cta: "Play the demo",
    buzzerLabel: "Press the buzzer to play the demo",
  },

  /**
   * Pricing section. No numbers here: prices live in src/config/pricing.ts,
   * and {placeholders} are filled by `fillPrices`.
   * While PRICING.showPrices is false the section is "what's included" (included*, extras*),
   * and title/sub/addonsTitle/note are not shown.
   */
  pricing: {
    includedTitle: "What's included?",
    includedSub: "Everything you need for a full game at your event.",
    /** The "what's included" tiles (shown while prices are hidden). icon: story | host | phone | trophy | build | gift */
    included: [
      { icon: "story", title: "A game made just for you", text: "Everything is created from the stories, details and photos you send us" },
      { icon: "host", title: "A host on the big screen", text: "Choose a character from our ready-made hosts or create one of your own" },
      { icon: "phone", title: "Every guest plays", text: "No app needed. Guests simply scan a code and play right from their phones" },
      { icon: "trophy", title: "Leaderboard and a winner", text: "The scores are on screen all game long and the real winner is revealed at the end" },
      { icon: "build", title: "We build, you enjoy", text: "After a short chat, we collect all the details and prepare everything ourselves" },
      { icon: "gift", title: "The game is yours to keep", text: "You can play the game again and again and share it with your guests" },
    ],
    extraBadge: "Add-on",
    title: "How much does it cost?",
    sub: "One clear price for a full game at your event. And if you want more, you can add it.",
    cardsLabel: "Price list",
    currencyLabel: "shekels",
    cards: {
      base: {
        name: "A personal game for your event",
        perks: [
          "Your stories and your questions",
          "A host of your choice from {readyMadeHosts} ready-made hosts",
          "A game that every guest plays",
        ],
        cta: "Create a game",
      },
      edit: {
        name: "Editing an existing game",
        text: "For each additional edit of a game that was already produced.",
        note: "Through the game's edit link",
      },
    },
    addonsTitle: "You can also add",
    addons: {
      contributorLink: {
        title: "A link for friends and kids too",
        text: "By default, the creation link goes only to you. As an add-on, friends and kids also get a link to add questions, stories and photos. You still approve every item.",
      },
      personalHost: {
        title: "A personal host for your event",
        text: "{readyMadeHosts} ready-made hosts are included in the price. Want a host created especially for you? Order one as an add-on.",
        /** The showcase panel (3 ready-made hosts + the personalized host pitch). */
        showcase: {
          titleLine1: "There's a host",
          titleLine2: "for every party.",
          sub: "Choose the face and the voice of your game",
          photosLabel: "Examples of hosts",
          readyAlts: [
            "Ready-made host: a classic host in a blue suit",
            "Ready-made host: a young, smiling host in a purple jacket",
            "Ready-made host: an animated character in a purple suit",
          ],
          personalText: "Want a character that's only yours? We'll create it from scratch, with no copyright worries.",
          customTitle: "(And you can create your own host too!)",
          customSub: "You can also create an event host based on the aunt from America, the CEO or a beloved character",
        },
      },
    },
    note: "Prices may change, and the final price is shown before payment.",
    /** Prepended to the FAQ list by Faq.astro. */
    faq: [
      {
        q: "How much does it cost?",
        a: "A personal game for an event costs {base}. A link for friends and kids, or a personal host, costs {contributorLink} each, and an additional edit of a game that was already produced costs {edit}.",
        pricesOnly: true,
      },
      {
        q: "Can friends and family add questions and photos too?",
        a: "Yes. You can collect stories, questions and photos from friends and family as well, and you decide what goes into the game. Tell us on Messenger and we'll find the easiest way for your event.",
      },
      {
        q: "Can we have a personal host instead of a ready-made one?",
        a: "Yes. {readyMadeHosts} ready-made hosts are included, and a host created especially for your event can be ordered as an add-on.",
      },
    ],
  },

  /** "Leave details" form (Netlify Forms, see LeadForm.astro). */
  lead: {
    title: "Sounds interesting? Let's talk",
    sub: "Leave your details and we'll get back to you with everything you need to know.",
    name: "Full name",
    namePlaceholder: "What's your name?",
    email: "Email address",
    emailPlaceholder: "you@example.com",
    phone: "Phone",
    phonePlaceholder: "050-1234567",
    eventType: "What's the event?",
    eventTypePlaceholder: "For example: a birthday or a company event",
    submit: "Send message",
    sending: "Sending...",
    success: "Thank you! We got your details and we'll be in touch soon.",
    error: "Something went wrong while sending. Try again, or write to us on Messenger.",
    errorMessenger: "Open Messenger",
    honeypot: "Do not fill in this field",
  },

  faq: {
    title: "Questions people ask us",
    items: [
      {
        q: "How do we get started?",
        a: "Send us a message on Messenger and tell us about the event. Then send us stories, photos and inside jokes, and we build the game from start to finish. You just show up and enjoy.",
      },
      {
        q: "Can we see an example before we start?",
        a: "Of course. Eyal's game gives you a peek at the host, the questions and the guests' experience (the game is in Hebrew). Open it on a computer and join from your phone with the code on the screen.",
        demoLinkText: "Eyal's game",
      },
      {
        q: "How long does the game take at the event?",
        a: "About 10 to 15 minutes. Long enough to get everyone excited, and short enough for the event to keep its pace.",
      },
      {
        q: "What do we need to play at the event?",
        a: "A projector or a big screen, an internet connection, and someone to pause everything for a few minutes: the DJ, the event's MC or you. Guests don't download anything: they scan the code on the screen, the game opens in the phone's browser, and they start playing.",
      },
      {
        q: "Who sees the photos and stories?",
        a: "Only you and us. You send the materials directly to us, and every question and photo goes through your approval before it reaches the screen. Your content is never shared, never used for advertising and never used to train AI models.",
      },
      {
        q: "Which events is it right for?",
        a: "Any event: birthdays, bar and bat mitzvahs, weddings, holiday toasts, company events and team-building days, bachelor and bachelorette parties and family events. We tailor the stories and the questions to the guests of honor and to the crowd.",
      },
    ],
  },

  footer: {
    contact: "Talk to us",
    contactMobile: "Contact",
    facebook: "Tadam! on Facebook",
    privacy: "Privacy policy",
    privacyMobile: "Privacy",
    blog: "Blog (in Hebrew)",
    linksLabel: "Links",
    copyright: "© Tadam!",
  },

  modal: {
    title: "Come see a demo",
    close: "Close",
    videoLabel: "The Tadam! demo: a recording of a real game for Eyal's birthday (in Hebrew)",
    caption: "A recording of a real game, in Hebrew: the host is on the big screen, and the guests answer from their phones.",
    cta: "Let's get started",
  },

  privacyPage: {
    title: "Privacy policy",
    body: "Your photos and stories stay yours. Only you and we see them, and every item goes through your approval before it reaches the screen.",
    back: "Back to the home page",
  },

} as const;
