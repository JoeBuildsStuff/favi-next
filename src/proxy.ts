import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import {
  appendVaryAccept,
  isNextDataRequest,
  negotiate,
} from "@/lib/accept"
import { blocksToMarkdown, getAgentPage, markdownHeaders } from "@/lib/agent-pages"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const decision = negotiate({
    method: request.method,
    pathname,
    accept: request.headers.get("accept"),
    isRsc: isNextDataRequest(request.headers, request.nextUrl),
  })

  if (decision === "skip") {
    return NextResponse.next()
  }

  if (decision === "markdown") {
    const page = getAgentPage(pathname)
    const response = new NextResponse(blocksToMarkdown(page.blocks), {
      status: page.status,
      headers: markdownHeaders(),
    })
    appendVaryAccept(response.headers)
    return response
  }

  if (decision === "406") {
    return new NextResponse(
      "Not Acceptable\n\nAvailable: text/html, text/markdown\n",
      {
        status: 406,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          Vary: "Accept, Accept-Encoding",
        },
      }
    )
  }

  const response = NextResponse.next()
  appendVaryAccept(response.headers)
  if (
    pathname === "/" ||
    pathname === "/for-agents" ||
    pathname === "/docs" ||
    pathname === "/developers" ||
    pathname === "/getfavi"
  ) {
    const sibling = pathname === "/" ? "/index.md" : `${pathname}.md`
    response.headers.append(
      "Link",
      `<${sibling}>; rel="alternate"; type="text/markdown"`
    )
  }
  return response
}

export const config = {
  matcher: ["/((?!api/|_next/|_vercel/).*)"],
}
