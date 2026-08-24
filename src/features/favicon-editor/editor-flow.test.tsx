/** @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type { ReactNode } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import type { IconItem, Library } from "@/lib/api"
import { parseFaviconConfigFromRecord } from "@/features/favicon-editor/model/parse-search-params"
import { DEFAULT_FAVICON_SETTINGS } from "@/lib/favicon-settings"

vi.mock("next/dynamic", () => ({
  default: () =>
    function PreviewGalleryStub() {
      return <div data-testid="preview-gallery" />
    },
}))

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

vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "light", setTheme: vi.fn() }),
}))

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api")
  return {
    ...actual,
    fetchIcon: vi.fn(),
    fetchIcons: vi.fn(),
    fetchLibraries: vi.fn(),
    exportFaviconZip: vi.fn(),
  }
})

import {
  exportFaviconZip,
  fetchIcon,
  fetchIcons,
  fetchLibraries,
} from "@/lib/api"
import { FaviconSelectionProvider } from "@/context/favicon-selection"
import { EditorShell } from "@/features/favicon-editor/editor-shell"

const star: IconItem = {
  id: 42,
  name: "star",
  style: "outline",
  tags: "favorite",
  library: "lucide",
  library_name: "Lucide",
  license: "MIT",
  svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"></svg>',
}

const house: IconItem = {
  ...star,
  id: 7,
  name: "house",
  tags: "home",
}

const libraries: Library[] = [
  {
    slug: "lucide",
    name: "Lucide",
    license: "MIT",
    attribution_note: "",
    icon_count: 1,
    styles: ["outline"],
  },
]

function renderEditor(
  record: Record<string, string | string[] | undefined> = {}
) {
  const initialConfig = parseFaviconConfigFromRecord(record)
  return render(
    <FaviconSelectionProvider initialConfig={initialConfig}>
      <EditorShell />
    </FaviconSelectionProvider>
  )
}

describe("favicon editor flows", () => {
  beforeEach(() => {
    vi.mocked(fetchIcon).mockReset()
    vi.mocked(fetchIcons).mockReset()
    vi.mocked(fetchLibraries).mockReset()
    vi.mocked(exportFaviconZip).mockReset()
    vi.mocked(fetchIcon).mockResolvedValue(star)
    vi.mocked(fetchIcons).mockResolvedValue({
      total: 1,
      icons: [house],
      limit: 72,
      offset: 0,
    })
    vi.mocked(fetchLibraries).mockResolvedValue({ libraries })
    vi.mocked(exportFaviconZip).mockResolvedValue(new Blob(["zip"]))
  })

  it("hydrates a query-string deep link from the server-parsed config", async () => {
    renderEditor({
      library: "lucide",
      name: "star",
      style: "outline",
      site: "Acme",
    })

    await waitFor(() => {
      expect(fetchIcon).toHaveBeenCalledWith("lucide", "star", "outline")
    })
    expect(await screen.findAllByText("star")).not.toHaveLength(0)
    expect(screen.getAllByDisplayValue("Acme").length).toBeGreaterThan(0)
  })

  it("searches the catalog and selects an icon", async () => {
    const user = userEvent.setup()
    renderEditor()

    const search = (await screen.findAllByPlaceholderText(/search icons/i))[0]!
    await user.clear(search)
    await user.type(search, "house")

    await waitFor(() => {
      expect(fetchIcons).toHaveBeenCalledWith(
        expect.objectContaining({ q: "house" })
      )
    })

    const pick = (await screen.findAllByRole("button", { name: /^house$/i }))[0]!
    await user.click(pick)

    expect(await screen.findAllByText("house")).not.toHaveLength(0)
  })

  it("switches to letters and builds an initials export", async () => {
    const user = userEvent.setup()
    renderEditor()
    await screen.findAllByText("star")

    await user.click(screen.getAllByRole("button", { name: /^letters$/i })[0]!)
    const letters = (await screen.findAllByLabelText(/^letters$/i))[0]!
    await user.clear(letters)
    await user.type(letters, "JT")

    expect(letters).toHaveValue("JT")
    expect(
      screen.getAllByRole("button", { name: /download favicon zip/i })[0]
    ).toBeEnabled()
  })

  it("opens the mobile icon and settings sheets", async () => {
    const user = userEvent.setup()
    renderEditor()

    await user.click(screen.getAllByRole("button", { name: "Open icons" })[0]!)
    expect(
      await screen.findByRole("heading", { name: "Icons" })
    ).toBeInTheDocument()
    await user.keyboard("{Escape}")

    await user.click(
      screen.getAllByRole("button", { name: "Open settings" })[0]!
    )
    expect(
      await screen.findByRole("heading", { name: "Settings" })
    ).toBeInTheDocument()
  })

  it("surfaces a failed deep-linked icon lookup", async () => {
    vi.mocked(fetchIcon).mockRejectedValueOnce(new Error("missing"))
    renderEditor({
      library: "lucide",
      name: "missing",
      style: "outline",
    })

    expect(
      (await screen.findAllByText(/couldn.t load lucide\/missing \(outline\)/i))
        .length
    ).toBeGreaterThan(0)
  })

  it("surfaces a failed export", async () => {
    const user = userEvent.setup()
    vi.mocked(exportFaviconZip).mockRejectedValueOnce(new Error("zip failed"))
    renderEditor()
    await screen.findAllByText("star")

    const download = screen.getAllByRole("button", {
      name: /download favicon zip/i,
    })[0]!
    expect(download).toBeEnabled()
    await user.click(download)

    await waitFor(() => {
      expect(exportFaviconZip).toHaveBeenCalled()
    })
    expect((await screen.findAllByText("zip failed")).length).toBeGreaterThan(0)
  })

  it("keeps default settings serializable for the provider", () => {
    const config = parseFaviconConfigFromRecord({})
    expect(config.settings).toEqual(DEFAULT_FAVICON_SETTINGS)
    expect(JSON.parse(JSON.stringify(config))).toEqual(config)
  })
})
