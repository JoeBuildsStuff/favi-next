/** @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type { ReactNode } from "react"
import { describe, expect, it, vi } from "vitest"

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string
    children: ReactNode
    className?: string
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}))

import ErrorPage from "./error"

describe("app error boundary", () => {
  it("offers a retry action and recovery links", async () => {
    const user = userEvent.setup()
    const reset = vi.fn()
    render(
      <ErrorPage
        error={Object.assign(new Error("boom"), { digest: "abc" })}
        reset={reset}
      />
    )

    expect(
      screen.getByRole("heading", { name: /something went wrong/i })
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/")
    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute(
      "href",
      "/docs"
    )
    expect(screen.getByRole("link", { name: "For agents" })).toHaveAttribute(
      "href",
      "/for-agents"
    )

    await user.click(screen.getByRole("button", { name: "Try again" }))
    expect(reset).toHaveBeenCalledOnce()
  })
})
