/**
 * All the site copy (English, for the US and Europe).
 * Rules: plain, warm American English, "you" for the organizers, no em-dashes.
 */

export const COPY = {
  /** The brand name as written in this language (logo label, page titles, structured data). */
  brand: "Tadam!",
  closing: {
    title: "So, who's Tadam worthy?",
    cta: "Create yours",
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
    sub: "Your stories, photos and inside jokes become a live trivia game show, with a host on the big screen and every guest playing from their phone.",
    ctaPrimary: "Create yours",
    ctaSecondary: "Watch the demo",
    loading: "Loading",
    nav: [
      { label: "Live Demos", href: "#demos" },
      { label: "How it Works", href: "#scene-4" },
      { label: "Our Hosts", href: "#hosts" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
    ],
    navCta: "Create yours",
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
    headline: "Create your game in minutes.",
    steps: [
      {
        title: "Tell us about your event.",
        text: "Type the stories, nicknames and inside jokes, and add a few photos.",
      },
      {
        title: "Pick a host and a vibe.",
        text: "Choose from our cast of ready-made hosts or create your own.",
      },
      {
        title: "Pay and play!",
        text: "Get your private game link by email within {deliveryHours} hours and edit the questions if needed.",
      },
    ],
    mock: {
      chatFrom: "Tadam! game creator",
      chatText: "Carol turns 50! She once drove to the wrong state for a wedding 😂",
      chatReply: "Love it! Add a photo and a few more stories",
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
    contact: "Create yours",
    cta: "Play the demo",
    buzzerLabel: "Press the buzzer to play the demo",
  },

  /**
   * Pricing section. No numbers here: prices live in src/config/pricing.ts, and {placeholders} are filled by `fillPrices`.
   * Paddle's website review needs the price visible without signing in.
   */
  pricing: {
    title: "One price, the whole show.",
    highlight: "whole show",
    perGame: "per game",
    oneTime: "One-time payment, no subscription",
    currencyLabel: "US dollars",
    sub: "Everything you need for a full game at your event.",
    packages: {
      basic: { host: "Pick a host from our cast of characters" },
      vip: { host: "Create your own custom host" },
    },
    cta: "Start Now",
  },

  demos: {
    title: "Pick an event below to play a live demo",
    highlight: "live demo",
    sub: "Fictional events. Real game-show fun. Jump in and try it for yourself.",
    cta: "Play demo",
    newTab: "opens in a new tab",
    items: [
      { title: "Monica and Chandler Wedding", event: "Wedding", image: "/demo/events/friends-wedding.webp", alt: "Monica and Chandler celebrating their wedding", href: "https://tadamevents.com/friends-demo" },
      { title: "Eleven's 18th Birthday", event: "Birthday", image: "/demo/events/eleven-birthday.webp", alt: "Eleven against a red stormy sky", href: "https://tadamevents.com/stranger-things-demo" },
      { title: "Homer's Retirement Party", event: "Retirement", image: "/demo/events/homer-retirement.webp", alt: "Homer Simpson sitting in a wheelchair", href: "https://tadamevents.com/the-simpsons-demo" },
    ],
  },

  testimonials: {
    title: "Here's what our customers had to say!",
    items: [
      { name: "Emily R.", image: "/testimonials/emily-upright.webp", event: "Dad's 60th birthday", quote: "Dad thought mom would easily win the game, so when she got the first question wrong, everyone laughed! The guests continued talking about the game all night long." },
      { name: "Marcus T.", image: "/testimonials/marcus.webp", event: "Wedding reception", quote: "Our two families had barely met. Ten minutes later, they were comparing answers and becoming best friends. It wasn't just fun, it was a bonding experience!" },
      { name: "Sophie L.", image: "/testimonials/sophie.webp", event: "Teammate's retirement party", quote: "We turned years of office stories into one very competitive game. Even our quietest teammate got involved. The custom host made the send-off feel completely ours." },
    ],
  },

  /** Ready-made hosts; VIP also allows a custom host with the person's permission. */
  hosts: {
    titleLine1: "There's a host for",
    titleLine2: "every party.",
    sub: "Pick the face and the voice of your game from our cast of hosts",
    photosLabel: "Examples of hosts",
    alts: [
      "Host: a classic host in a blue suit",
      "Host: a young, smiling host in a purple jacket",
      "Host: an animated character in a purple suit",
    ],
  },

  /**
   * FAQ. {placeholders} are filled by `fillPrices`. `link` turns its text inside the answer into a link
   * ("demo" opens the playable demo; anything else is a path on this site).
   */
  faq: {
    title: "Questions people ask us",
    items: [
      {
        q: "How much does it cost?",
        a: "The basic package starts at {base} and the VIP package costs {vip}. It's a one-time purchase, with no subscription. Outside the US you pay the equivalent in your currency, and taxes are calculated at checkout.",
      },
      {
        q: "How does it work?",
        a: "Tell us about your event and the guest of honor, then pick a host and we create the game. Your private game link arrives by email within {deliveryHours} hours, and you can edit the questions before you play. At the party, open the link on the big screen and guests join by scanning the code.",
      },
      {
        q: "Can we see an example first?",
        a: "Of course. Here are 3 demos of fictional events that let you play the games, answer questions and try the guests' experience. In the real game, participants join from their phones by scanning the QR code on the screen.",
        link: { text: "3 demos", href: "/#demos" },
      },
      {
        q: "How long does the game take?",
        a: "About 10 to 15 minutes. Long enough to get everyone excited, and short enough for the party to keep its pace.",
      },
      {
        q: "What do we need at the party?",
        a: "A TV or projector connected to a computer, an internet connection and a few minutes of everyone's attention. Guests scan the code on the screen and play in their phone's browser, with nothing to download.",
      },
      {
        q: "How soon do we get the game?",
        a: "Within {deliveryHours} hours of payment. Create it at least two days before the party to be safe.",
      },
      {
        q: "How long can we play it?",
        a: "Your private link works for {linkDays} days with Basic or {vipLinkDays} days with VIP, starting from delivery. After that, the game and everything you uploaded are deleted.",
      },
      {
        q: "Who sees our photos and stories?",
        a: "Only you and the guests you share the game link with. We use your content only to make your game, never sell it, never use it for advertising, and delete it after {linkDays} days with Basic or {vipLinkDays} days with VIP. See our privacy policy.",
        link: { text: "privacy policy", href: "/privacy" },
      },
      {
        q: "Can we get a refund?",
        a: "Yes. You can ask for a full refund within {refundDays} days of purchase, for any reason. See our refund policy.",
        link: { text: "refund policy", href: "/refunds" },
      },
      {
        q: "Can the host look or sound like someone we know?",
        a: "Yes. Choose from our cast of invented characters, or create a custom host from your own photos with VIP. To use a real person's face or voice, you must have their explicit permission first. For anyone under 18, get permission from their parent or legal guardian.",
      },
      {
        q: "What events is a trivia game good for?",
        a: "Any event where people know the guest of honor: birthdays and milestone birthdays, rehearsal dinners and weddings, bridal and couples showers, bachelorette parties, anniversaries, retirement parties, office holiday parties and team building, family reunions, bar and bat mitzvahs and sweet sixteens. The questions are built around your guest of honor and your crowd.",
      },
    ],
  },

  footer: {
    tagline: "A personal live trivia game show for your party.",
    gameLabel: "Tadam!",
    gameLinks: [
      { label: "Live Demos", href: "/#demos" },
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
    /** Reopens the cookie banner (src/components/ConsentBanner.astro). */
    cookieSettings: "Cookie settings",
    contactLabel: "Contact",
    /** "© 2026 Tanya Rofman." is built from legalPage in Footer.astro. Paddle requires the legal name and this line. */
    paddle: "Payments processed by Paddle.com.",
  },

  modal: {
    title: "Come see a demo",
    close: "Close",
    videoLabel: "The Tadam! demo: a recording of the game for Tom's 13th birthday",
    caption: "A recording of the game for Tom's 13th birthday: the host is on the big screen, and the guests answer from their phones.",
    cta: "Create yours",
  },

  /** The legal pages (/terms, /privacy, /refunds). Their text is in src/pages/*.astro, from the drafts in docs/paddle/. */
  legalPage: {
    back: "Back to the home page",
    /** Exactly as on the Paddle account: Paddle checks that the site and the account show the same legal name. */
    /** No country, street address or business number on this site (Tanya's decision, 2026-11-24): the US site has no connection to Israel. Contact is by email. */
    legalName: "Tanya Rofman",
    updated: "November 24, 2026",
    /** The privacy policy changed on its own date (Google Analytics added). */
    privacyUpdated: "November 25, 2026",
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
    filterLabel: "Filter articles by category",
    filterAll: "All",
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
    ctaContact: "Questions? Email us",
    faqTitle: "Frequently asked questions",
    related: "More from the blog",
  },

} as const;
