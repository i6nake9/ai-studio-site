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

  header: {
    nav: { href: string; label: string }[];
    cta: string;
    homeLabel: string;
    navLabel: string;
  };

  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    diagram: { caption: string; nodes: { label: string; detail: string }[] };
  };

  pains: SectionHead & { items: TitledText[] };

  solutions: SectionHead & {
    lead: string;
    includesLabel: string;
    integratesLabel: string;
    outcomeLabel: string;
    items: {
      title: string;
      summary: string;
      includes: string[];
      integrations: string[];
      outcome: string;
    }[];
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

  comparison: SectionHead & {
    columns: { criterion: string; others: string; us: string };
    rows: { criterion: string; others: string; us: string }[];
  };

  process: SectionHead & { steps: TitledText[] };

  faq: SectionHead & {
    items: { question: string; answer: string[]; list?: string[] }[];
  };

  lead: SectionHead & {
    text: string;
    fields: {
      name: { label: string; placeholder: string };
      business: { label: string; placeholder: string };
      contact: { label: string; placeholder: string };
    };
    required: string;
    submit: string;
    submitting: string;
    telegramDirect: string;
    privacyNote: string;
    privacyLink: string;
    dialogTitle: string;
    dialogText: string;
    roiAttached: string;
    sent: TitledText;
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

  footer: { tagline: string; privacy: string; telegram: string };

  privacy: {
    title: string;
    updated: string;
    sections: { title: string; text: string[] }[];
    back: string;
  };
}
