export const SITE = {
  name: "Leonardo Posada",
  role: "Product Design & Creative Direction",
  title: "Leonardo Posada — Product Design & Creative Direction",
  description:
    "Founding Product Designer at Rappi & Yuno. UX/UI mentor and consultant.",
  email: "leonardop055@gmail.com",
  resumeUrl: "https://www.linkedin.com/in/leonardoposada/",
  socials: {
    linkedin: "https://www.linkedin.com/in/leonardoposada/",
    dribbble: "https://dribbble.com/leonardoposada",
    instagram: "https://www.instagram.com/leonardoposada/",
  },
} as const;

/**
 * A single image slot in the project media set. We number them `m01, m02, …`
 * so the whole team shares one convention for talking about a project's visuals
 * — "swap m05", "add m08", etc.
 *
 * Layout (template decides, data stays dumb):
 *   m01 · Hero · full-width 16:10, caption rendered. Also used by the home
 *        ProjectMedia row.
 *   m02 · Big detail between 02 Challenge and 03 Approach, caption rendered.
 *        Also used by the home ProjectMedia row (left half).
 *   m03 · Big detail after the Metrics block, caption NOT rendered. Also used
 *        by the home ProjectMedia row (right half).
 *   m04+ · Half-width grid cells below m03. The template auto-stretches the
 *        last cell to full-width when the grid count is odd.
 */
/** Static image slot (default kind). `size: "full"` stacks the image
 *  full-width above the half-width grid; omit (or "half") for the grid. */
export type ImageMask = {
  kind?: "image";
  src: string;
  alt?: string;
  caption?: string;
  size?: "full" | "half";
};

/** Autoplaying, looping, muted inline video slot. Rendered full-width.
 *  `poster` shows as a static frame when autoplay is blocked — iOS Low
 *  Power Mode suspends autoplay even for muted+playsinline videos. */
export type VideoMask = {
  kind: "video";
  src: string;
  caption?: string;
  poster?: string;
};

export type Mask = ImageMask | VideoMask;

export function isImageMask(m?: Mask): m is ImageMask {
  return !!m && m.kind !== "video";
}

export function isVideoMask(m?: Mask): m is VideoMask {
  return !!m && m.kind === "video";
}

export type ProjectMedia = {
  m01?: Mask;
  m02?: Mask;
  m03?: Mask;
  m04?: Mask;
  m05?: Mask;
  m06?: Mask;
  m07?: Mask;
  m08?: Mask;
  m09?: Mask;
};

export type ProjectMetric = {
  value: string;
  label: string;
};

export type ProjectCredit = {
  role: string;
  name: string;
};

export type ProjectCofounder = {
  name: string;
  linkedin: string;
  /** Optional avatar image path. Falls back to initials if omitted. */
  avatar?: string;
};

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  year: string;
  role: string;
  /** Short card copy used on the home list. */
  description: string;
  services: readonly string[];
  /** Scene-setting · what is this product, who is it for? */
  context: string;
  /** The specific problem the project set out to solve. */
  challenge: string;
  /** How I approached the work; the "why" behind decisions. */
  approach: string;
  /** Results · narrative + optional metric callouts. */
  outcome: {
    summary: string;
    metrics?: readonly ProjectMetric[];
  };
  /** Film-credits style list of collaborators. */
  credits?: readonly ProjectCredit[];
  /** Rendered as a dedicated row with avatar circles linking to LinkedIn. */
  cofounders?: readonly ProjectCofounder[];
  media?: ProjectMedia;
};

export const PROJECTS: readonly Project[] = [
  {
    slug: "yuno",
    name: "Yuno",
    tagline: "Payment orchestration platform for emerging markets.",
    year: "2022 — present",
    role: "Founding Designer & UX Team Lead",
    description:
      "Yuno stands as one of the leading Payment Orchestrators in the global market, driven by rapid international expansion.",
    services: ["Art Direction", "Design System", "UX/UI Design"],
    context:
      "Yuno launched in 2022 as a payment orchestration layer helping global merchants scale across Latin America. From day one, the goal was to abstract the complexity of integrating dozens of local processors behind a single API and a single dashboard.",
    challenge:
      "Merchants expanding into Latin America face a fragmented payments landscape: 50+ processors, 20+ payment methods per country, constant regulatory shifts, and no unified reporting. Our product had to feel as polished as Stripe while handling the real-world chaos of emerging markets.",
    approach:
      "I built the design organization from scratch and standardized on a token-driven design system that scaled across every product surface — checkout, dashboard, admin tools, docs, marketing. Weekly design reviews, pair-design with engineering, and a strict component-first discipline let a small design team ship at the pace of a much bigger one.",
    outcome: {
      summary:
        "Yuno grew from a seed-stage startup to a late-stage company with enterprise merchants across 15+ countries in under three years. Every product surface shipped under one coherent design language.",
      metrics: [
        { value: "7+", label: "product surfaces" },
        { value: "15+", label: "markets live" },
        { value: "4", label: "designers managed" },
        { value: "100%", label: "token coverage" },
      ],
    },
    credits: [
      { role: "Design & direction", name: "Leonardo Posada" },
      { role: "Engineering", name: "Yuno core engineering" },
    ],
    cofounders: [
      {
        name: "Juan Pablo Ortega",
        linkedin: "https://www.linkedin.com/in/juanpabloom/",
      },
      {
        name: "Julián Núñez",
        linkedin: "https://www.linkedin.com/in/juliannunezb/",
      },
    ],
    media: {
      m01: {
        src: "/work/yuno/hero.webp",
        caption:
          "Operations dashboard · the control center merchants use to monitor payment performance in real time.",
      },
      m02: {
        src: "/work/yuno/detail-1.webp",
        caption:
          "Checkout surface · unified API hides provider complexity behind a single payment UI.",
      },
      m03: { src: "/work/yuno/detail-2.webp" },
      m04: { src: "/work/yuno/detail-1.webp" },
      m05: { src: "/work/yuno/detail-2.webp" },
      m06: { src: "/work/yuno/detail-2.webp" },
      m07: { src: "/work/yuno/detail-1.webp" },
    },
  },
  {
    slug: "rappi",
    name: "Rappi",
    tagline: "The first superapp of Latin America.",
    year: "2014 — 2021",
    role: "Founding Designer & UX Team Lead",
    description:
      "Rappi is a Latin-American tech company and the first SuperApp in the region. Today, Rappi operates in 400 cities across nine Latin American countries, with over 100 million downloads, more than 350,000 delivery partners, and 500,000 affiliated businesses.",
    services: ["Art Direction", "Design System", "UX/UI Design"],
    context:
      "Rappi started in 2015 as an on-demand delivery service in Bogotá and grew into the dominant superapp across Latin America. I joined as one of the first designers and built the design practice that scaled with the company from pre-seed to Series F.",
    challenge:
      "Shipping a superapp means designing for users who open the same app to order food, buy groceries, send money, book a doctor, hail a ride, and pay bills — with no cognitive overhead. Every added vertical risked compromising the simplicity that made Rappi feel magical in the first place.",
    approach:
      "I established the design system and a shared component library (Rappi Design System) that unified more than 20 verticals across 9 countries. The playbook: start with user outcomes, not features — earn the fifth tab, don't just add it.",
    outcome: {
      summary:
        "Rappi became the first unicorn in Colombia, raised more than $2B in funding, and today reaches hundreds of millions of users across the region.",
      metrics: [
        { value: "9", label: "countries" },
        { value: "20+", label: "verticals" },
        { value: "400+", label: "cities" },
        { value: "100M+", label: "downloads" },
      ],
    },
    credits: [
      { role: "Design & direction", name: "Leonardo Posada" },
      { role: "Design system", name: "Rappi design team" },
    ],
    cofounders: [
      {
        name: "Simón Borrero",
        linkedin: "https://co.linkedin.com/in/simonborrero",
      },
      {
        name: "Sebastián Mejía",
        linkedin: "https://br.linkedin.com/in/sebastianmejia",
      },
      {
        name: "Felipe Villamarín",
        linkedin: "https://www.linkedin.com/in/felipe-villamarin-85518161/",
      },
    ],
    media: {
      m01: {
        src: "/work/rappi/hero.webp",
        caption: "RappiRestaurants · the vertical that started it all.",
      },
      m02: {
        src: "/work/rappi/detail-1.webp",
        caption:
          "Rappi Design System · unified component library across 20+ verticals.",
      },
      m03: { src: "/work/rappi/detail-2.webp" },
      m04: { src: "/work/rappi/detail-1.webp" },
      m05: { src: "/work/rappi/detail-2.webp" },
      m06: { src: "/work/rappi/detail-2.webp" },
      m07: { src: "/work/rappi/detail-1.webp" },
    },
  },
  {
    slug: "kontigo",
    name: "Kontigo",
    tagline: "Stablecoin-native neobank for Latin America.",
    year: "2024 — present",
    role: "Founding Designer & UX Team Lead",
    description:
      "Kontigo is a fast-growing blockchain-based stablecoin neobank (YC S24) that lets users access modern financial tools such as self-custodial wallets, high-yield stablecoin savings, crypto debit cards, credit lines, and global payments, without traditional banking barriers.",
    services: ["Art Direction", "Design System", "UX/UI Design"],
    context:
      "Kontigo is a YC S24 startup building a stablecoin-native neobank for Latin Americans — letting anyone access self-custodial wallets, dollar savings, crypto debit cards, and global payments without a traditional bank account.",
    challenge:
      "Most crypto products are built for crypto natives. Kontigo's bet is the opposite: a product that looks and feels like a modern neobank, with the complexity of blockchain hidden entirely. The design challenge was to earn user trust while using the same primitives (wallets, keys, stablecoins) that scare most mainstream users.",
    approach:
      "Working with the founding team at Y Combinator, I shaped the brand identity and the entire product end-to-end — from onboarding to card activation to savings to money movement. Every surface uses the same vocabulary a local bank would use (dollars, saldo, enviar), even when the plumbing beneath is USDC on-chain.",
    outcome: {
      summary:
        "Kontigo launched out of Y Combinator Summer 2024 and is onboarding thousands of users across Venezuela, Colombia, and Argentina in its first year.",
      metrics: [
        { value: "YC S24", label: "cohort" },
        { value: "3", label: "countries at launch" },
        { value: "4", label: "product surfaces" },
        { value: "0 → 1", label: "end-to-end product" },
      ],
    },
    credits: [
      { role: "Design & direction", name: "Leonardo Posada" },
      { role: "Engineering", name: "Kontigo engineering" },
    ],
    cofounders: [
      {
        name: "Jesús Castillo",
        linkedin: "https://www.linkedin.com/in/jesus-castillo-81a58b186/",
      },
      {
        name: "Gino Guatavita",
        linkedin: "https://www.linkedin.com/in/gino-guatavita-7269139b/",
      },
    ],
    media: {
      m01: {
        src: "/work/kontigo/hero.webp",
        caption: "Card activation · stablecoin-funded Visa debit card.",
      },
      m02: {
        src: "/work/kontigo/detail-1.webp",
        caption:
          "Home · dollar savings and spending with blockchain under the hood.",
      },
      m03: {
        kind: "video",
        src: "/work/kontigo/cards-video-v6.mp4",
        poster: "/work/kontigo/cards-static-v5.webp",
      },
      m04: { src: "/work/kontigo/detail-1.webp" },
      m05: { src: "/work/kontigo/detail-2.webp" },
      m06: { src: "/work/kontigo/detail-2.webp" },
    },
  },
] as const;
