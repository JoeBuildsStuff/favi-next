import type { ContentBlock } from "../types"

export function blocksToPlainText(blocks: ContentBlock[]): string {
  return blocks
    .map((block) => {
      if (block.type === "ul") {
        return block.items
          .map((item) => `${item.label} ${item.note ?? ""} ${item.href}`)
          .join(" ")
      }
      if (block.type === "pre") return block.text
      return block.text
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
}
