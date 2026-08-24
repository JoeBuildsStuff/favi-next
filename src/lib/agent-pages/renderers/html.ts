import type { ContentBlock } from "../types"

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function htmlFromBlock(block: ContentBlock): string {
  if (block.type === "h") {
    return `<h${block.level}>${escapeHtml(block.text)}</h${block.level}>`
  }
  if (block.type === "p") {
    return `<p>${escapeHtml(block.text)}</p>`
  }
  if (block.type === "pre") {
    return `<pre><code>${escapeHtml(block.text)}</code></pre>`
  }
  const items = block.items
    .map((item) => {
      const note = item.note ? ` — ${escapeHtml(item.note)}` : ""
      return `<li><a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>${note}</li>`
    })
    .join("")
  return `<ul>${items}</ul>`
}

export function blocksToHtml(blocks: ContentBlock[]): string {
  return `<article>\n${blocks.map(htmlFromBlock).join("\n")}\n</article>`
}
