/** Ukrainian letters in the national latin transliteration, simplified for addresses. */
const LETTERS: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", ґ: "g", д: "d", е: "e", є: "ye", ж: "zh", з: "z",
  и: "y", і: "i", ї: "yi", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p",
  р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "shch",
  ь: "", ю: "yu", я: "ya",
};
const LIMIT = 60;

/** "Що таке ШІ-агент" → "shcho-take-shi-agent": an id for a heading, used in "#…" links. */
export function anchorId(heading: string): string {
  const latin = Array.from(heading.toLowerCase().replace(/['’ʼ`]/g, ""))
    .map((ch) => LETTERS[ch] ?? ch)
    .join("");
  const id = latin.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  if (id.length <= LIMIT) return id;
  const cut = id.slice(0, LIMIT + 1);
  return cut.slice(0, cut.lastIndexOf("-"));
}
