import type { ContentBlock, NestedNode } from "../types"

/** Nest heading blocks into a tree by level (H1 → H2 → H3) for outline checks. */
export function nestBlocks(blocks: ContentBlock[]): NestedNode[] {
  const root: NestedNode[] = []
  const stack: { level: number; children: NestedNode[] }[] = [
    { level: 0, children: root },
  ]

  for (const block of blocks) {
    if (block.type === "h") {
      while (stack.length > 1 && stack[stack.length - 1]!.level >= block.level) {
        stack.pop()
      }
      const children: NestedNode[] = []
      stack[stack.length - 1]!.children.push({
        type: "section",
        heading: block,
        children,
      })
      stack.push({ level: block.level, children })
    } else {
      stack[stack.length - 1]!.children.push(block)
    }
  }

  return root
}
