import { uk } from "@/content/uk";

/**
 * The example pipeline from the first screen: five steps on one wire, with a
 * dot travelling down it. Purely decorative motion; the steps are a real list.
 */
export function PipelineDiagram() {
  const { caption, nodes } = uk.hero.diagram;
  return (
    <figure className="relative border border-border bg-card/80 p-5 sm:p-7">
      {/* drafting crop marks */}
      <span aria-hidden="true" className="absolute -top-px -left-px size-3 border-t-2 border-l-2 border-signal" />
      <span aria-hidden="true" className="absolute -right-px -bottom-px size-3 border-r-2 border-b-2 border-signal" />

      <figcaption className="label-mono leading-relaxed text-muted-foreground">
        <span className="text-signal">FIG. 01</span> · {caption}
      </figcaption>

      <div className="relative mt-6">
        {/* the wire */}
        <div aria-hidden="true" className="absolute top-5 bottom-5 left-[1.1875rem] w-px overflow-hidden bg-input">
          <div className="h-full animate-signal motion-reduce:hidden">
            <span className="block h-10 w-px bg-gradient-to-b from-transparent via-signal to-signal" />
          </div>
        </div>

        <ol className="relative space-y-3">
          {nodes.map((node, i) => (
            <li key={node.label} className="flex items-center gap-4">
              <span
                aria-hidden="true"
                style={{ animationDelay: `${i}s` }}
                className="relative grid size-10 shrink-0 animate-node-on place-items-center border border-signal bg-background font-mono text-xs text-signal motion-reduce:opacity-100"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1 border border-border bg-background/60 px-4 py-3">
                <p className="font-display text-[0.95rem] leading-tight font-medium">
                  {node.label}
                </p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  {node.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </figure>
  );
}
