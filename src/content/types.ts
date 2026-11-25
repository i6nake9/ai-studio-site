/**
 * Shape of all site texts for one language. To add a language, write another
 * object of this type next to `uk.ts`.
 */

interface TitledText {
  title: string;
  text: string;
}

interface SectionHead {
  eyebrow: string;
  title: string;
}

export interface Dictionary {
  meta: { title: string; description: string };

  /** The logo as text: the first part is drawn in the accent colour. */
  wordmark: { accent: string; rest: string };

  header: {
    /** `href` is a section of the home page, e.g. "#prices". */
    nav: { href: string; label: string }[];
    cta: string;
    navLabel: string;
    menu: string;
    telegram: string;
  };

  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    /** The to-do list on the first screen: routine tasks and who takes them. */
    checklist: {
      title: string;
      tag: string;
      items: { task: string; by: string }[];
      /** The one task that stays with people. */
      human: { task: string; by: string };
      note: string;
    };
  };

  /** Four short facts under the first screen that answer the first doubts. */
  trust: { label: string; items: TitledText[] };

  pains: SectionHead & { items: TitledText[] };

  solutions: SectionHead & {
    lead: string;
    includesLabel: string;
    integratesLabel: string;
    outcomeLabel: string;
    /** Badge on the first service: the one that can be demonstrated today. */
    showcaseBadge: string;
    items: {
      /** Address of the service page: /poslugy/<slug>/. Latin letters, digits, hyphens. */
      slug: string;
      title: string;
      /** Short name for menus and the footer. */
      short: string;
      /** Text of the link to the service page. */
      more: string;
      summary: string;
      includes: string[];
      integrations: string[];
      outcome: string;
      /** Texts of the separate page of this service. */
      page: {
        /** Title in the search result, up to 60 characters. */
        metaTitle: string;
        /** Description in the search result, 110–160 characters. */
        metaDescription: string;
        h1: string;
        intro: string;
        fits: string[];
        faq: { question: string; answer: string }[];
      };
    }[];
  };

  /** Headings shared by all service pages. */
  servicePage: {
    eyebrow: string;
    breadcrumbLabel: string;
    home: string;
    services: string;
    cta: string;
    pricesLink: string;
    includesTitle: string;
    fitsTitle: string;
    processTitle: string;
    pricesTitle: string;
    pricesLead: string;
    faqTitle: string;
    otherTitle: string;
  };

  calculator: SectionHead & {
    lead: string;
    employees: { label: string };
    cost: { label: string; hint: string };
    routine: { label: string; hint: string };
    currency: { label: string; usd: string; uah: string };
    results: {
      hours: string;
      hoursUnit: string;
      yearly: string;
      payback: string;
    };
    longPayback: string;
    howTitle: string;
    how: string[];
    estimateNote: string;
    cta: string;
  };

  scenarios: SectionHead & {
    note: string;
    nowLabel: string;
    whatLabel: string;
    givesLabel: string;
    items: { niche: string; now: string; what: string; gives: string }[];
    /** Short demo recordings; the strip is hidden while this is empty. */
    videos: { title: string; src: string }[];
  };

  ownProjects: {
    title: string;
    lead: string;
    /** Status label on each project card. */
    status: string;
    items: TitledText[];
  };

  /** The "who you talk to" block next to the own projects. */
  founder: {
    label: string;
    role: string;
    text: string;
    photoAlt: string;
    telegramCta: string;
    auditCta: string;
  };

  comparison: SectionHead & {
    columns: { criterion: string; others: string; us: string };
    rows: { criterion: string; others: string; us: string }[];
  };

  process: SectionHead & { steps: TitledText[] };

  prices: {
    title: string;
    items: { title: string; price: string; text: string; badge?: string }[];
  };

  faq: SectionHead & {
    lead: string;
    leadCta: string;
    items: { question: string; answer: string[]; list?: string[] }[];
  };

  lead: SectionHead & {
    text: string;
    /** What happens after the form is sent, three short steps. */
    steps: string[];
    fields: {
      name: { label: string; placeholder: string };
      business: { label: string; placeholder: string };
      email: { label: string; placeholder: string };
      contact: { label: string; placeholder: string };
    };
    required: string;
    /** Shown under the e-mail field when the address has a typo. */
    invalidEmail: string;
    submit: string;
    submitting: string;
    telegramDirect: string;
    privacyNote: string;
    privacyLink: string;
    dialogTitle: string;
    dialogText: string;
    dialogClose: string;
    roiAttached: string;
    sent: TitledText;
    /** Shown instead of the form while no contact channel is configured. */
    notReady: TitledText;
    fallback: {
      title: string;
      text: string;
      textNoTelegram: string;
      messageLabel: string;
      openTelegram: string;
      copy: string;
      copied: string;
      copyFailed: string;
      email: string;
      emailSubject: string;
      back: string;
    };
  };

  footer: {
    tagline: string;
    privacy: string;
    telegram: string;
    servicesTitle: string;
    studioTitle: string;
    contactsTitle: string;
    studioLinks: { href: string; label: string }[];
  };

  /** Bar fixed to the bottom of the screen on phones. */
  mobileBar: { label: string; audit: string; telegram: string };

  notFound: { title: string; text: string; back: string };

  privacy: {
    title: string;
    updated: string;
    sections: { title: string; text: string[] }[];
    back: string;
  };
}

/** A page about one concrete task, e.g. "TTN for Prom.ua orders with printing". */
export interface TaskPage {
  /** Address of the page: /poslugy/<slug>/. */
  slug: string;
  /** Slug of the direction (one of `solutions.items`) this task belongs to. */
  parent: string;
  /** Short name for links and breadcrumbs. */
  short: string;
  /** One sentence for cards that link to the page, up to 140 characters. */
  card: string;
  /** Title in the search result, up to 60 characters. */
  metaTitle: string;
  /** Description in the search result, 110–160 characters. */
  metaDescription: string;
  h1: string;
  intro: string;
  /** What goes wrong today, in the client's words. */
  pains: string[];
  /** How the automation works, step by step. */
  steps: { title: string; text: string }[];
  includes: string[];
  integrations: string[];
  outcome: string;
  fits: string[];
  faq: { question: string; answer: string }[];
}

/** A page for one type of business that links to the tasks relevant to it. */
export interface IndustryPage {
  /** Address of the page: /galuzi/<slug>/. */
  slug: string;
  short: string;
  card: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  pains: { title: string; text: string }[];
  /** Links to task or direction pages, each with a reason in this industry's words. */
  services: { slug: string; why: string }[];
  /** Which process to take as the pilot. */
  start: string;
  faq: { question: string; answer: string }[];
}
