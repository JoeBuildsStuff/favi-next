export type ContentLink = { href: string; label: string; note?: string }

export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h"; level: 1 | 2 | 3; text: string }
  | { type: "ul"; items: ContentLink[] }
  | { type: "pre"; text: string }

export type AgentPage = {
  status: 200 | 404
  title: string
  blocks: ContentBlock[]
}

export type NestedNode =
  | Exclude<ContentBlock, { type: "h" }>
  | {
      type: "section"
      heading: Extract<ContentBlock, { type: "h" }>
      children: NestedNode[]
    }
