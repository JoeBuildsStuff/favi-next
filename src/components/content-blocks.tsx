import { nestBlocks, type ContentBlock, type NestedNode } from "@/lib/agent-pages"
import { cn } from "@/lib/utils"

function Heading({
  level,
  children,
}: {
  level: 1 | 2 | 3
  children: string
}) {
  if (level === 1) {
    return <h1>{children}</h1>
  }
  if (level === 2) {
    return <h2>{children}</h2>
  }
  return <h3>{children}</h3>
}

function Block({ block }: { block: ContentBlock }) {
  if (block.type === "h") {
    return <Heading level={block.level}>{block.text}</Heading>
  }
  if (block.type === "p") {
    return <p>{block.text}</p>
  }
  if (block.type === "pre") {
    return (
      <pre>
        <code>{block.text}</code>
      </pre>
    )
  }
  return (
    <ul>
      {block.items.map((item) => (
        <li key={item.href}>
          <a href={item.href}>{item.label}</a>
          {item.note ? (
            <span className="text-muted-foreground"> — {item.note}</span>
          ) : null}
        </li>
      ))}
    </ul>
  )
}

function NestedBlock({ node }: { node: NestedNode }) {
  if (node.type !== "section") {
    return <Block block={node} />
  }

  return (
    <section>
      <Heading level={node.heading.level}>{node.heading.text}</Heading>
      {node.children.map((child, index) => (
        <NestedBlock key={index} node={child} />
      ))}
    </section>
  )
}

/** Semantic H1/H2/H3 sections rendered inside the shared Typeset surface. */
export function ContentBlocks({
  blocks,
  className,
}: {
  blocks: ContentBlock[]
  className?: string
}) {
  return (
    <div className={cn("typeset typeset-docs max-w-[42em]", className)}>
      {nestBlocks(blocks).map((node, index) => (
        <NestedBlock key={index} node={node} />
      ))}
    </div>
  )
}
