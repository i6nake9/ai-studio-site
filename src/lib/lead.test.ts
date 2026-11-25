import { expect, test } from "vitest";

import { calculateRoi } from "./calculator";
import {
  botLink,
  buildLeadMessage,
  leadChannels,
  leadPayload,
  mailtoLink,
  normalizeLead,
  normalizeTelegramNick,
  prepareLead,
  submitLead,
  telegramLink,
  validateLead,
} from "./lead";

const plain = (s: string) => s.replace(/[  ]/g, " ");
const lead = { name: "Олена", business: "shop.ua", email: "olena@shop.ua", telegram: "@olena" };

test("normalizeLead trims, flattens line breaks and cuts to the field limit", () => {
  expect(
    normalizeLead({
      name: "  Олена\n Коваль ",
      business: "x".repeat(500),
      email: " Olena@Shop.ua\n",
      telegram: " @olena ",
    }),
  ).toEqual({
    name: "Олена Коваль",
    business: "x".repeat(200),
    email: "Olena@Shop.ua",
    telegram: "@olena",
  });
});

test("empty and whitespace-only fields are reported as required", () => {
  expect(validateLead({ name: " ", business: "", email: " ", telegram: "\n" })).toEqual({
    name: "required",
    business: "required",
    email: "required",
  });
});

test("Telegram is optional: a lead without it has no errors", () => {
  expect(validateLead({ ...lead, telegram: "" })).toEqual({});
});

test("an e-mail that cannot be an address is reported as invalid", () => {
  for (const email of ["olena", "olena@", "@shop.ua", "olena@shop", "ol ena@shop.ua", "olena@@shop.ua"]) {
    expect(validateLead({ ...lead, email }), email).toEqual({ email: "invalid" });
  }
  for (const email of ["olena@shop.ua", "o.koval+audit@mail.shop.com.ua"]) {
    expect(validateLead({ ...lead, email }), email).toEqual({});
  }
});

test("a filled lead has no errors", () => {
  expect(validateLead(lead)).toEqual({});
});

test("lead message without a calculation", () => {
  expect(buildLeadMessage(lead, "Nerutyna")).toBe(
    "Заявка на аудит з сайту Nerutyna\nІм'я: Олена\nСайт або ніша: shop.ua\nE-mail: olena@shop.ua\nTelegram: @olena",
  );
});

test("lead message has no Telegram line without a nick, and says when the newsletter was agreed to", () => {
  expect(buildLeadMessage({ ...lead, telegram: "" }, "Nerutyna")).toBe(
    "Заявка на аудит з сайту Nerutyna\nІм'я: Олена\nСайт або ніша: shop.ua\nE-mail: olena@shop.ua",
  );
  expect(buildLeadMessage(lead, "Nerutyna", undefined, true).split("\n").at(-1)).toBe("Розсилка: так");
  expect(buildLeadMessage(lead, "Nerutyna", undefined, false)).not.toMatch(/Розсилка/);
});

test("lead message carries the calculator numbers", () => {
  const input = {
    employees: 5,
    monthlyCost: 700,
    routinePercent: 40,
    currency: "USD" as const,
    uahPerUsd: 42,
  };
  const msg = buildLeadMessage(lead, "Nerutyna", {
    input,
    result: calculateRoi(input),
  });
  expect(plain(msg)).toContain(
    "Розрахунок: 5 співробітників, $700 на місяць, 40% рутини. Вивільняється 160 год на місяць, вартість вивільненого часу $8 400 на рік.",
  );
});

test("the word for employees follows Ukrainian plural rules", () => {
  const message = (employees: number) => {
    const input = {
      employees,
      monthlyCost: 700,
      routinePercent: 40,
      currency: "USD" as const,
      uahPerUsd: 42,
    };
    return buildLeadMessage(lead, "Nerutyna", {
      input,
      result: calculateRoi(input),
    });
  };
  expect(message(1)).toContain("1 співробітник,");
  expect(message(3)).toContain("3 співробітники,");
  expect(message(21)).toContain("21 співробітник,");
  expect(message(12)).toContain("12 співробітників,");
});

test("message built from untrimmed fields is normalized first", () => {
  const msg = buildLeadMessage(
    { ...lead, name: " Олена\n", business: "y".repeat(900) },
    "Nerutyna",
  );
  expect(msg.split("\n")).toHaveLength(5);
  expect(msg.length).toBeLessThan(400);
});

test("Telegram username is cleaned of @ and of the t.me prefix", () => {
  expect(normalizeTelegramNick("@Nerutyna_ai")).toBe("Nerutyna_ai");
  expect(normalizeTelegramNick("https://t.me/nerutyna")).toBe("nerutyna");
  expect(normalizeTelegramNick(" t.me/nerutyna/ ")).toBe("nerutyna");
});

test("empty or malformed Telegram username gives null", () => {
  expect(normalizeTelegramNick("")).toBeNull();
  expect(normalizeTelegramNick("ab")).toBeNull();
  expect(normalizeTelegramNick("bad nick!")).toBeNull();
  expect(normalizeTelegramNick("nick/../evil")).toBeNull();
});

test("no Telegram link without a valid username", () => {
  expect(telegramLink(null, "x")).toBeNull();
});

test("a bot link carries a label of where the person came from", () => {
  expect(botLink("Nerutyna_ai", "site")).toBe("https://t.me/Nerutyna_ai?start=site");
  expect(botLink("Nerutyna_ai", "bad label!")).toBe("https://t.me/Nerutyna_ai");
  expect(botLink(null, "site")).toBeNull();
});

test("Telegram link without text is the plain profile link", () => {
  expect(telegramLink("nerutyna")).toBe("https://t.me/nerutyna");
});

test("Telegram link keeps special characters of the text intact", () => {
  const text = "A&B #1?\nемодзі 🙂 100%";
  const link = telegramLink("nerutyna", text)!;
  expect(new URL(link).searchParams.get("text")).toBe(text);
  expect(link).not.toContain("\n");
});

test("no mailto link without an address", () => {
  expect(mailtoLink("", "s", "b")).toBeNull();
});

test("mailto link encodes subject and body", () => {
  expect(mailtoLink("a@b.ua", "Тема", "Рядок 1\nРядок 2")).toBe(
    "mailto:a@b.ua?subject=" +
      encodeURIComponent("Тема") +
      "&body=" +
      encodeURIComponent("Рядок 1\nРядок 2"),
  );
});

test("without an endpoint the lead goes to the fallback path", async () => {
  let called = false;
  const outcome = await submitLead("", {}, async () => {
    called = true;
    return new Response("");
  });
  expect(outcome).toEqual({ status: "fallback" });
  expect(called).toBe(false);
});

test("a 2xx answer from the endpoint means sent", async () => {
  let body = "";
  const outcome = await submitLead(
    "https://example.test/lead",
    { name: "Олена" },
    async (_url, init) => {
      body = String(init?.body);
      return new Response("", { status: 201 });
    },
  );
  expect(outcome).toEqual({ status: "sent", telegram: null });
  expect(JSON.parse(body)).toEqual({ name: "Олена" });
});

test("the server's link to continue in Telegram is passed on, anything else is dropped", async () => {
  const answer = (body: string) =>
    submitLead("https://example.test/lead", {}, async () => new Response(body, { status: 200 }));
  expect(await answer('{"ok":true,"telegram":"https://t.me/Studio_bot?start=l_aB-9_x"}')).toEqual({
    status: "sent",
    telegram: "https://t.me/Studio_bot?start=l_aB-9_x",
  });
  for (const body of [
    '{"ok":true,"telegram":"https://evil.example/?start=l_x"}',
    '{"ok":true,"telegram":"javascript:alert(1)"}',
    '{"ok":true,"telegram":5}',
    "not json",
  ]) {
    expect(await answer(body), body).toEqual({ status: "sent", telegram: null });
  }
});

test("a non-2xx answer falls back instead of claiming success", async () => {
  expect(
    await submitLead("https://example.test/lead", {}, async () =>
      new Response("", { status: 500 }),
    ),
  ).toEqual({ status: "fallback" });
});

test("a network error falls back without throwing", async () => {
  expect(
    await submitLead("https://example.test/lead", {}, async () => {
      throw new Error("offline");
    }),
  ).toEqual({ status: "fallback" });
});

test("an endpoint that never answers falls back after the timeout", async () => {
  const never: typeof fetch = (_url, init) =>
    new Promise((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => reject(new Error("aborted")));
    });
  expect(await submitLead("https://example.test/lead", {}, never, 20)).toEqual({
    status: "fallback",
  });
});

test("prepareLead reports every empty field and builds no message", () => {
  expect(prepareLead({ name: " ", business: "", email: "x", telegram: "\n" }, "", "Nerutyna")).toEqual({
    status: "invalid",
    errors: { name: "required", business: "required", email: "invalid" },
  });
});

test("a lead whose bot trap is filled is kept but marked, so it is never posted and never reported as sent", () => {
  expect(prepareLead(lead, "http://spam.example", "Nerutyna")).toEqual({
    status: "ready",
    lead,
    message: buildLeadMessage(lead, "Nerutyna"),
    trapped: true,
  });
  const normal = prepareLead(lead, "", "Nerutyna");
  expect(normal.status === "ready" && normal.trapped).toBe(false);
});

test("prepareLead returns the cleaned fields and the message, with the calculation", () => {
  const input = {
    employees: 5,
    monthlyCost: 700,
    routinePercent: 40,
    currency: "USD" as const,
    uahPerUsd: 45,
  };
  const roi = { input, result: calculateRoi(input) };
  const ready = prepareLead({ ...lead, name: "  Олена " }, "", "Nerutyna", roi);
  expect(ready.status).toBe("ready");
  if (ready.status !== "ready") return;
  expect(ready.lead.name).toBe("Олена");
  expect(ready.message).toBe(buildLeadMessage(lead, "Nerutyna", roi));
  expect(ready.message).toMatch(/Розрахунок: 5 співробітників/);
});

test("leadChannels: with no nick, e-mail or endpoint a lead has nowhere to go", () => {
  expect(leadChannels({ telegram: "", email: " ", leadEndpoint: "" })).toEqual({
    telegram: false,
    email: false,
    endpoint: false,
    any: false,
  });
});

test("leadChannels: a malformed nick does not count, a valid one does", () => {
  expect(leadChannels({ telegram: "ab", email: "", leadEndpoint: "" }).any).toBe(false);
  expect(leadChannels({ telegram: "@nerutyna", email: "", leadEndpoint: "" })).toMatchObject({
    telegram: true,
    any: true,
  });
});

test("leadChannels: an e-mail or an endpoint alone is enough", () => {
  expect(leadChannels({ telegram: "", email: "hi@example.test", leadEndpoint: "" }).any).toBe(true);
  expect(leadChannels({ telegram: "", email: "", leadEndpoint: "https://example.test/lead" }).any).toBe(true);
});

test("the lead message calls the yearly figure the value of freed time, not a saving", () => {
  const input = { employees: 5, monthlyCost: 700, routinePercent: 40, currency: "USD" as const, uahPerUsd: 45 };
  const message = buildLeadMessage(lead, "Nerutyna", { input, result: calculateRoi(input) });
  expect(message).toMatch(/вартість вивільненого часу/);
  expect(message).not.toMatch(/економія/i);
});

test("what goes to the server: cleaned fields, the consent with its wording, the page and the calculation line", () => {
  const input = { employees: 5, monthlyCost: 700, routinePercent: 40, currency: "USD" as const, uahPerUsd: 45 };
  const roi = { input, result: calculateRoi(input) };
  const payload = leadPayload({ ...lead, name: " Олена " }, {
    newsletter: true,
    consentText: "Надсилайте мені матеріали",
    page: "/poslugy/ttn-prom-avtomatychnyi-druk/",
    roi,
  });
  expect(payload).toMatchObject({
    name: "Олена",
    business: "shop.ua",
    email: "olena@shop.ua",
    telegram: "@olena",
    newsletter: true,
    consentText: "Надсилайте мені матеріали",
    page: "/poslugy/ttn-prom-avtomatychnyi-druk/",
  });
  expect(payload.roi).toMatch(/^Розрахунок: 5 співробітників/);
});

test("without consent the wording is not sent, and without a calculation the line is empty", () => {
  expect(leadPayload(lead, { newsletter: false, consentText: "Надсилайте", page: "/" })).toMatchObject({
    newsletter: false,
    consentText: "",
    roi: "",
  });
});
