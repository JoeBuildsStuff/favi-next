import type { ContentBlock } from "@/lib/agent-pages"

function Heading({
  level,
  children,
}: {
  level: 1 | 2 | 3
  children: string
}) {
  if (level === 1) {
    return <h1 className="text-3xl font-semibold tracking-tight">{children}</h1>
  }
  if (level === 2) {
    return (
      <h2 className="mt-8 text-xl font-semibold tracking-tight">{children}</h2>
    )
  }
  return <h3 className="mt-6 text-lg font-semibold tracking-tight">{children}</h3>
}

export function ContentBlocks({
  blocks,
  className,
}: {
  blocks: ContentBlock[]
  className?: string
}) {
  return (
    <div className={className}>
      {blocks.map((block, index) => {
        if (block.type === "h") {
          return (
            <Heading key={index} level={block.level}>
              {block.text}
            </Heading>
          )
        }
        if (block.type === "p") {
          return (
            <p key={index} className="text-muted-foreground mt-3 text-sm leading-6">
              {block.text}
            </p>
          )
        }
        if (block.type === "pre") {
          return (
            <pre
              key={index}
              className="bg-muted mt-3 overflow-x-auto rounded-md p-3 text-xs leading-5"
            >
              <code>{block.text}</code>
            </pre>
          )
        }
        return (
          <ul key={index} className="mt-3 list-disc space-y-2 pl-5 text-sm">
            {block.items.map((item) => (
              <li key={item.href}>
                <a className="underline underline-offset-4" href={item.href}>
                  {item.label}
                </a>
                {item.note ? (
                  <span className="text-muted-foreground"> — {item.note}</span>
                ) : null}
              </li>
            ))}
          </ul>
        )
      })}
    </div>
  )
}
