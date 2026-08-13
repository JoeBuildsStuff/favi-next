const SYNONYM_GROUPS: readonly (readonly string[])[] = [
  ["image", "photo", "picture", "img", "pic"],
  ["trash", "delete", "bin", "remove", "garbage"],
  ["settings", "gear", "cog", "preferences", "options", "config"],
  ["home", "house", "homepage"],
  ["search", "find", "magnifier", "magnify", "lookup"],
  ["user", "person", "profile", "account", "avatar"],
  ["mail", "email", "envelope", "inbox"],
  ["lock", "secure", "security", "padlock"],
  ["unlock", "unlocked"],
  ["heart", "favorite", "favourite", "love", "like"],
  ["star", "bookmark", "rating"],
  ["menu", "hamburger", "bars", "nav"],
  ["close", "x", "cancel", "dismiss"],
  ["check", "tick", "done", "success", "ok"],
  ["warning", "alert", "caution"],
  ["info", "information", "about"],
  ["edit", "pencil", "pen", "write"],
  ["download", "save", "export"],
  ["upload", "import"],
  ["share", "send", "forward"],
  ["link", "chain", "url", "href"],
  ["folder", "directory"],
  ["file", "document", "doc"],
  ["calendar", "date", "schedule"],
  ["clock", "time", "watch"],
  ["phone", "call", "telephone", "mobile"],
  ["chat", "message", "comment", "bubble"],
  ["camera", "snapshot"],
  ["video", "film", "movie", "play"],
  ["music", "audio", "sound", "speaker"],
  ["bell", "notification", "notify", "alarm"],
  ["cart", "basket", "shopping", "bag"],
  ["globe", "world", "earth", "web", "internet"],
  ["map", "location", "pin", "marker", "place"],
  ["filter", "funnel", "refine"],
  ["sort", "order", "arrange"],
  ["copy", "duplicate", "clone"],
  ["cut", "scissors"],
  ["paste", "clipboard"],
  ["refresh", "reload", "sync", "update"],
  ["power", "shutdown", "off"],
  ["sun", "light", "day", "brightness"],
  ["moon", "dark", "night"],
  ["eye", "view", "visibility", "show", "visible"],
  ["hide", "hidden", "invisible", "conceal"],
  ["plus", "add", "create", "new"],
  ["minus", "subtract", "dash"],
  ["arrow", "chevron", "caret"],
]

const LOOKUP = new Map<string, readonly string[]>()
for (const group of SYNONYM_GROUPS) {
  for (const term of group) LOOKUP.set(term, group)
}

const TOKEN_RE = /[a-z0-9][a-z0-9_-]*/gi

export function tokenizeQuery(q: string): string[] {
  return [...q.matchAll(TOKEN_RE)].map((m) => m[0].toLowerCase())
}

export function expandToken(token: string): string[] {
  const group = LOOKUP.get(token.toLowerCase())
  if (!group) return [token.toLowerCase()]
  const key = token.toLowerCase()
  return [key, ...group.filter((t) => t !== key)]
}

export function expandQueryTokens(q: string): string[][] {
  const tokens = tokenizeQuery(q)
  return tokens.map(expandToken)
}
