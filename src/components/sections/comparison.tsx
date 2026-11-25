import { SectionHead } from "@/components/section-head";
import { uk } from "@/content/uk";

export function Comparison() {
  const t = uk.comparison;
  return (
    <section className="border-t border-border py-20 sm:py-28">
      <div className="shell">
        <SectionHead index="05" eyebrow={t.eyebrow} title={t.title} />

        {/* A real table on wide screens; each row becomes a card on phones. */}
        <table className="mt-12 w-full border-collapse text-left text-[0.95rem] max-md:block">
          <thead className="max-md:sr-only">
            <tr className="border-y border-border">
              <th scope="col" className="label-mono w-[26%] py-4 pr-6 font-normal text-muted-foreground">
                {t.columns.criterion}
              </th>
              <th scope="col" className="label-mono w-[37%] py-4 pr-6 font-normal text-muted-foreground">
                {t.columns.others}
              </th>
              <th scope="col" className="label-mono w-[37%] py-4 font-normal text-signal">
                {t.columns.us}
              </th>
            </tr>
          </thead>
          <tbody className="max-md:block max-md:space-y-4">
            {t.rows.map((row) => (
              <tr
                key={row.criterion}
                className="border-b border-border align-top max-md:block max-md:border max-md:bg-card/50"
              >
                <th
                  scope="row"
                  className="py-6 pr-6 font-display text-base leading-snug font-medium max-md:block max-md:border-b max-md:border-border max-md:px-5 max-md:py-4"
                >
                  {row.criterion}
                </th>
                <td className="py-6 pr-6 text-muted-foreground max-md:block max-md:px-5 max-md:pt-4 max-md:pb-0">
                  <span className="label-mono mb-2 block text-muted-foreground/80 md:hidden">
                    {t.columns.others}
                  </span>
                  {row.others}
                </td>
                <td className="py-6 max-md:block max-md:px-5 max-md:py-4">
                  <span className="label-mono mb-2 block text-signal md:hidden">
                    {t.columns.us}
                  </span>
                  <span className="md:block md:border-l-2 md:border-signal md:pl-4">
                    {row.us}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
