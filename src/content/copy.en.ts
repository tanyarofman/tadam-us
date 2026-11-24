/**
 * All the site copy (English, for the US and Europe). The Israeli Hebrew site is a separate repository (tadam-il).
 * Rules: plain, warm American English, "you" for the organizers, no em-dashes.
 */

export const COPY = {
  /** The brand name as written in this language (logo label, page titles, structured data). */
  brand: "Tadam!",
  closing: {
    title: "So, who's Tadam worthy?",
    cta: "Let's create a game",
  },
  meta: {
    title: "Tadam! Personalized Trivia Game Show for Parties and Events",
    description:
      "A live trivia game show built from your guests' stories. Your host on the big screen, everyone plays from their phone. For birthdays, weddings and teams.",
    ogAlt: "Tadam! A personal game show for your event",
  },

  nav: {
    skip: "Skip to content",
  },

  hero: {
    headline: "The moment everyone will remember.",
    /** The headline word that gets the magenta swoosh, and the word count before the line break (wide screens, 0 = none). */
    highlight: "remember",
    breakAfter: 0,
    sub: "Your stories, photos and personal details become a live trivia game show, with a host on the big screen.",
    ctaPrimary: "Let's get started",
    ctaSecondary: "Watch the demo",
    loading: "Loading",
    nav: [
      { label: "How it Works", href: "#scene-4" },
      { label: "Our Hosts", href: "#hosts" },
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
      "Milestone Birthdays",
      "Rehearsal Dinners",
      "Bridal Showers",
      "Retirement Parties",
      "Office Holiday Parties",
      "Anniversaries",
      "Weddings",
      "Bachelorette Parties",
      "Bar and Bat Mitzvahs",
      "Team Building",
      "Family Reunions",
      "Sweet Sixteen",
    ],
  },

  scene1: {
    headline: "Every event has a moment when everyone is waiting for something.",
    highlight: "waiting",
    photoAlt: "Guests at an American Sweet Sixteen dinner sit around tables, eating and checking their phones before the game starts",
    hallLabel: "Illustration: an event hall with tables, a DJ booth and colorful lights. In the corner, bored guests on their phones.",
  },

  scene3: {
    burst: "Tadam!",
    headline: "Then the lights dim, the screen wakes up, and the host takes the stage.",
    demo: {
      label: "A demo game for Tom's 13th birthday: the big screen and the phone",
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
        title: "Talk to us.",
        text: "Tell us about the event and the guest of honor.",
      },
      {
        title: "Pick a host and a vibe.",
        text: "Tailor the game to your event.",
      },
      {
        title: "We build the game.",
        text: "Questions, photos and a host on the big screen.",
      },
    ],
    mock: {
      chatFrom: "Tadam!",
      chatText: "Hi! I'd love to hear about Tadam! for Carol's birthday 🎉",
      chatReply: "How fun! Tell us a bit about Carol and the event",
      hostTitle: "Your host",
      atmosphereTitle: "Your vibe",
      boardTitle: "Carol's game",
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
      { name: "Uncle Joe", score: 2390 },
      { name: "Michel from work", score: 2150 },
      { name: "Dad", score: 1980 },
    ],
    headline: "In the end, everyone finds out who the real champions are",
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
    /** TODO (Tanya): prices are hidden (PRICING.showPrices) until set in USD. */
    currencyLabel: "dollars",
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
          titleLine1: "There's a host for",
          titleLine2: "every party.",
          sub: "Choose the face and the voice of your game",
          photosLabel: "Examples of hosts",
          readyAlts: [
            "Ready-made host: a classic host in a blue suit",
            "Ready-made host: a young, smiling host in a purple jacket",
            "Ready-made host: an animated character in a purple suit",
          ],
          personalText: "Want a character that's only yours? We'll create it from scratch, with no copyright worries.",
          customTitle: "(you can create your own host too!)",
          customSub: "You can also create an event host based on your favorite aunt, the CEO or a beloved character",
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
    phonePlaceholder: "(201) 555-0123",
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
        a: "Of course. Tom's game gives you a peek at the host, the questions and the guests' experience. Open it on a computer and join from your phone with the code on the screen.",
        demoLinkText: "Tom's game",
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
        q: "What events is a trivia game good for?",
        a: "Any event where people know the guest of honor: birthdays and milestone birthdays, rehearsal dinners and weddings, bridal and couples showers, bachelorette parties, anniversaries, retirement parties, office holiday parties and team building, family reunions, bar and bat mitzvahs and sweet sixteens. We tailor the stories and the questions to the guest of honor and to the crowd.",
      },
    ],
  },

  footer: {
    tagline: "A personal live trivia game show for your party.",
    gameLabel: "Tadam!",
    gameLinks: [
      { label: "How it works", href: "/#scene-4" },
      { label: "Our hosts", href: "/#hosts" },
      { label: "Pricing", href: "/#pricing" },
      { label: "FAQ", href: "/#faq" },
      { label: "Blog", href: "/blog/" },
    ],
    legalLabel: "Legal",
    legalLinks: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Refund Policy", href: "/refunds" },
    ],
    contactLabel: "Contact",
    /** "© 2026 Tanya Rofman, Israel." is built from legalPage in Footer.astro. Paddle requires the legal name and this line. */
    paddle: "Payments processed by Paddle.com.",
  },

  modal: {
    title: "Come see a demo",
    close: "Close",
    videoLabel: "The Tadam! demo: a recording of the game for Tom's 13th birthday",
    caption: "A recording of the game for Tom's 13th birthday: the host is on the big screen, and the guests answer from their phones.",
    cta: "Let's get started",
  },

  /** The legal pages (/terms, /privacy, /refunds). Their text is in src/pages/*.astro, from the drafts in docs/paddle/. */
  legalPage: {
    back: "Back to the home page",
    /** Exactly as on the Paddle account: Paddle checks that the site and the account show the same legal name. */
    legalName: "Tanya Rofman",
    country: "Israel",
    /** Published on the legal pages (controller identity under the GDPR). The business number never goes on the site. */
    address: "Ein Gedi 2/2, Tel Aviv 6203602, Israel",
    updated: "November 24, 2026",
  },

  /** Blog pages (index, article frame). The articles themselves are Markdown in src/content/blog-en/. */
  blog: {
    name: "Blog",
    headerBlog: "Blog",
    headerDemo: "Demo",
    headerHome: "Tadam! home page",
    headerNav: "Navigation",
    indexTitle: "The Tadam! blog | Event ideas, activities and quizzes",
    indexDescription:
      "Ideas for birthdays, weddings and showers, team events and holidays. Games that bring all the guests together, and trivia ready to play.",
    indexName: "The Tadam! blog",
    indexLead: "Ideas for events everyone remembers: birthdays, weddings and showers, team events and holidays.",
    crumbs: "Breadcrumbs",
    updated: "Updated",
    answerAria: "The short answer",
    answerLabel: "In short",
    toc: "In this article",
    /** The category whose articles get the team call to action instead of the family one. */
    teamCategory: "Companies and teams",
    ctaTeam: {
      title: "Want this moment to be about your team?",
      text: "Tadam! is a live trivia game built from your employees' stories. Everyone scans a code from the screen and answers from their phone, including people joining from home, and whoever knows the team best wins. No app, about 15 minutes.",
    },
    ctaFamily: {
      title: "Want this moment to be about your guest of honor?",
      text: "Tadam! is a live trivia game built from the stories of family and friends. Everyone scans a code from the screen and answers from their phone, and whoever knows them best wins. No app, about 15 minutes.",
    },
    ctaDemo: "Come see a demo",
    ctaContact: "Talk to us on Messenger",
    faqTitle: "Frequently asked questions",
    related: "More from the blog",
  },

} as const;
