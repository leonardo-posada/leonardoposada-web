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

export type ProjectMedia = {
  hero?: string;
  detail1?: string;
  detail2?: string;
};

export type Project = {
  slug: string;
  name: string;
  year: string;
  role: string;
  description: string;
  services: readonly string[];
  media?: ProjectMedia;
};

export const PROJECTS: readonly Project[] = [
  {
    slug: "yuno",
    name: "Yuno",
    year: "2022",
    role: "Founding Designer & UX Team Lead",
    description:
      "Yuno stands as one of the leading Payment Orchestrators in the global market, driven by rapid international expansion.",
    services: ["Art Direction", "Design System", "UX/UI Design"],
  },
  {
    slug: "rappi",
    name: "Rappi",
    year: "2014",
    role: "Founding Designer & UX Team Lead",
    description:
      "Rappi is a Latin-American tech company and the first SuperApp in the region. Today, Rappi operates in 400 cities across nine Latin American countries, with over 100 million downloads, more than 350,000 delivery partners, and 500,000 affiliated businesses.",
    services: ["Art Direction", "Design System", "UX/UI Design"],
  },
  {
    slug: "kontigo",
    name: "Kontigo",
    year: "2024",
    role: "Founding Designer & UX Team Lead",
    description:
      "Kontigo is a fast-growing blockchain-based stablecoin neobank (YC S24) that lets users access modern financial tools such as self-custodial wallets, high-yield stablecoin savings, crypto debit cards, credit lines, and global payments, without traditional banking barriers.",
    services: ["Art Direction", "Design System", "UX/UI Design"],
  },
] as const;
