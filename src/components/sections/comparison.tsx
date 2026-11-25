import { uk } from "@/content/uk";

export function Comparison() {
  const t = uk.comparison;
  return (
    <section className="band">
      <div className="shell">
        <h2 className="h2 max-w-[47.5rem]">{t.title}</h2>

        {/* A real table on wide screens; each row becomes a card on phones. */}
        <table className="mt-7 w-full border-separate border-spacing-0 overflow-hidden text-left text-[0.96875rem] leading-normal max-md:block md:rounded-xl md:border md:border-border md:bg-card">
          <thead className="max-md:sr-only">
            <tr>
              <th scope="col" className="label w-[24%] border-b border-border px-5 py-4">
                {t.columns.criterion}
              </th>
              <th scope="col" className="label w-[36%] border-b border-border px-5 py-4">
                {t.columns.others}
              </th>
              <th
                scope="col"
                className="label w-[40%] border-b border-border bg-signal-soft px-5 py-4 !font-bold !text-signal"
              >
                {t.columns.us}
              </th>
            </tr>
          </thead>
          <tbody className="max-md:block max-md:space-y-4">
            {t.rows.map((row) => (
              <tr
                key={row.criterion}
                className="group align-top max-md:block max-md:overflow-hidden max-md:rounded-xl max-md:border max-md:border-border max-md:bg-card"
              >
                <th
                  scope="row"
                  className="px-5 py-[1.125rem] font-bold max-md:block max-md:border-b max-md:border-border md:border-b md:border-border md:group-last:border-b-0"
                >
                  {row.criterion}
                </th>
                <td className="px-5 py-[1.125rem] text-muted-foreground max-md:block max-md:pb-2 md:border-b md:border-border md:group-last:border-b-0">
                  <span className="label mb-1 block md:hidden">{t.columns.others}</span>
                  {row.others}
                </td>
                <td className="bg-signal-soft/45 px-5 py-[1.125rem] max-md:block md:border-b md:border-border md:group-last:border-b-0">
                  <span className="label mb-1 block !text-signal md:hidden">{t.columns.us}</span>
                  {row.us}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
