/** Brand marks + official-ish plate colors for preview mockups.
 * Paths are Tabler `brand-*` unless noted (shadcn from Hugeicons).
 */

export type BrandMarkId =
  | "vercel"
  | "supabase"
  | "shadcn"
  | "cloudflare"
  | "docker"
  | "react"
  | "nextjs"
  | "python"
  | "github"
  | "git"
  | "typescript"
  | "tailwind"
  | "pnpm"
  | "ubuntu"

export type BrandMark = {
  id: BrandMarkId
  label: string
  /** Plate background */
  bg: string
  /** Glyph color (currentColor) */
  fg: string
  /** Prefer filled path(s) when true; otherwise stroke. */
  filled: boolean
  /** Multiplier on glyph size inside the plate (higher = less padding). */
  glyphScale?: number
  paths: string[]
}

/**
 * Stack brands shown in home-screen / bookmark mockups (display order).
 * Colors match common brand guidelines for tiny favicon-style plates.
 */
export const BRAND_MARKS: BrandMark[] = [
  {
    id: "vercel",
    label: "Vercel",
    bg: "#000000",
    fg: "#ffffff",
    filled: true,
    paths: [
      "M11.143 3.486a1 1 0 0 1 1.714 0l9 15a1 1 0 0 1 -.857 1.514h-18a1 1 0 0 1 -.857 -1.514z",
    ],
  },
  {
    id: "supabase",
    label: "Supabase",
    bg: "#1c1c1c",
    fg: "#3ecf8e",
    filled: true,
    paths: ["M4 14h8v7l8 -11h-8v-7l-8 11"],
  },
  {
    id: "shadcn",
    label: "shadcn",
    bg: "#000000",
    fg: "#ffffff",
    filled: false,
    // Hugeicons `shadcn` (not in Tabler)
    paths: ["M18 12L12 18", "M18 4L4 18"],
  },
  {
    id: "cloudflare",
    label: "Cloudflare",
    bg: "#f38020",
    fg: "#ffffff",
    filled: false,
    glyphScale: 1.28,
    paths: [
      "M13.031 7.007c2.469 -.007 3.295 1.293 3.969 2.993c4 0 4.994 3.825 5 6h-20c-.001 -1.64 1.36 -2.954 3 -3c0 -1.5 1 -3 3 -3c.66 -1.942 2.562 -2.986 5.031 -2.993",
      "M12 13h6",
      "M17 10l-2.5 6",
    ],
  },
  {
    id: "docker",
    label: "Docker",
    bg: "#2496ed",
    fg: "#ffffff",
    filled: false,
    glyphScale: 1.28,
    paths: [
      "M22 12.54c-1.804 -.345 -2.701 -1.08 -3.523 -2.94c-.487 .696 -1.102 1.568 -.92 2.4c.028 .238 -.32 1 -.557 1h-14c0 5.208 3.164 7 6.196 7c4.124 .022 7.828 -1.376 9.854 -5c1.146 -.101 2.296 -1.505 2.95 -2.46",
      "M5 10h3v3h-3l0 -3",
      "M8 10h3v3h-3l0 -3",
      "M11 10h3v3h-3l0 -3",
      "M8 7h3v3h-3l0 -3",
      "M11 7h3v3h-3l0 -3",
      "M11 4h3v3h-3l0 -3",
      "M4.571 18c1.5 0 2.047 -.074 2.958 -.78",
      "M10 16l0 .01",
    ],
  },
  {
    id: "react",
    label: "React",
    bg: "#20232a",
    fg: "#61dafb",
    filled: false,
    paths: [
      "M6.306 8.711c-2.602 .723 -4.306 1.926 -4.306 3.289c0 2.21 4.477 4 10 4c.773 0 1.526 -.035 2.248 -.102",
      "M17.692 15.289c2.603 -.722 4.308 -1.926 4.308 -3.289c0 -2.21 -4.477 -4 -10 -4c-.773 0 -1.526 .035 -2.25 .102",
      "M6.305 15.287c-.676 2.615 -.485 4.693 .695 5.373c1.913 1.105 5.703 -1.877 8.464 -6.66c.387 -.67 .733 -1.339 1.036 -2",
      "M17.694 8.716c.677 -2.616 .487 -4.696 -.694 -5.376c-1.913 -1.105 -5.703 1.877 -8.464 6.66c-.387 .67 -.733 1.34 -1.037 2",
      "M12 5.424c-1.925 -1.892 -3.82 -2.766 -5 -2.084c-1.913 1.104 -1.226 5.877 1.536 10.66c.386 .67 .793 1.304 1.212 1.896",
      "M12 18.574c1.926 1.893 3.821 2.768 5 2.086c1.913 -1.104 1.226 -5.877 -1.536 -10.66c-.375 -.65 -.78 -1.283 -1.212 -1.897",
      "M11.5 12.866a1 1 0 1 0 1 -1.732a1 1 0 0 0 -1 1.732",
    ],
  },
  {
    id: "nextjs",
    label: "Next.js",
    bg: "#000000",
    fg: "#ffffff",
    filled: false,
    paths: [
      "M9 15v-6l7.745 10.65a9 9 0 1 1 2.255 -1.993",
      "M15 12v-3",
    ],
  },
  {
    id: "python",
    label: "Python",
    bg: "#3776ab",
    fg: "#ffd43b",
    filled: false,
    paths: [
      "M12 9h-7a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h3",
      "M12 15h7a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-3",
      "M8 9v-4a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v5a2 2 0 0 1 -2 2h-4a2 2 0 0 0 -2 2v5a2 2 0 0 0 2 2h4a2 2 0 0 0 2 -2v-4",
      "M11 6l0 .01",
      "M13 18l0 .01",
    ],
  },
  {
    id: "github",
    label: "GitHub",
    bg: "#181717",
    fg: "#ffffff",
    filled: true,
    paths: [
      "M5.315 2.1c.791 -.113 1.9 .145 3.333 .966l.272 .161l.16 .1l.397 -.083a13.3 13.3 0 0 1 4.59 -.08l.456 .08l.396 .083l.161 -.1c1.385 -.84 2.487 -1.17 3.322 -1.148l.164 .008l.147 .017l.076 .014l.05 .011l.144 .047a1 1 0 0 1 .53 .514a5.2 5.2 0 0 1 .397 2.91l-.047 .267l-.046 .196l.123 .163c.574 .795 .93 1.728 1.03 2.707l.023 .295l.007 .272c0 3.855 -1.659 5.883 -4.644 6.68l-.245 .061l-.132 .029l.014 .161l.008 .157l.004 .365l-.002 .213l-.003 3.834a1 1 0 0 1 -.883 .993l-.117 .007h-6a1 1 0 0 1 -.993 -.883l-.007 -.117v-.734c-1.818 .26 -3.03 -.424 -4.11 -1.878l-.535 -.766c-.28 -.396 -.455 -.579 -.589 -.644l-.048 -.019a1 1 0 0 1 .564 -1.918c.642 .188 1.074 .568 1.57 1.239l.538 .769c.76 1.079 1.36 1.459 2.609 1.191l.001 -.678l-.018 -.168a5.03 5.03 0 0 1 -.021 -.824l.017 -.185l.019 -.12l-.108 -.024c-2.976 -.71 -4.703 -2.573 -4.875 -6.139l-.01 -.31l-.004 -.292a5.6 5.6 0 0 1 .908 -3.051l.152 -.222l.122 -.163l-.045 -.196a5.2 5.2 0 0 1 .145 -2.642l.1 -.282l.106 -.253a1 1 0 0 1 .529 -.514l.144 -.047l.154 -.03z",
    ],
  },
  {
    id: "git",
    label: "Git",
    bg: "#f05032",
    fg: "#ffffff",
    filled: false,
    glyphScale: 1.28,
    paths: [
      "M15 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0",
      "M11 8a1 1 0 1 0 2 0a1 1 0 1 0 -2 0",
      "M11 16a1 1 0 1 0 2 0a1 1 0 1 0 -2 0",
      "M12 15v-6",
      "M15 11l-2 -2",
      "M11 7l-1.9 -1.9",
      "M13.446 2.6l7.955 7.954a2.045 2.045 0 0 1 0 2.892l-7.955 7.955a2.045 2.045 0 0 1 -2.892 0l-7.955 -7.955a2.045 2.045 0 0 1 0 -2.892l7.955 -7.955a2.045 2.045 0 0 1 2.892 0",
    ],
  },
  {
    id: "typescript",
    label: "TypeScript",
    bg: "#3178c6",
    fg: "#ffffff",
    filled: false,
    paths: [
      "M15 17.5c.32 .32 .754 .5 1.207 .5h.543c.69 0 1.25 -.56 1.25 -1.25v-.25a1.5 1.5 0 0 0 -1.5 -1.5a1.5 1.5 0 0 1 -1.5 -1.5v-.25c0 -.69 .56 -1.25 1.25 -1.25h.543c.453 0 .887 .18 1.207 .5",
      "M9 12h4",
      "M11 12v6",
      "M21 19v-14a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2 -2",
    ],
  },
  {
    id: "tailwind",
    label: "Tailwind",
    bg: "#0b1120",
    fg: "#38bdf8",
    filled: true,
    paths: [
      "M11.667 6c-2.49 0 -4.044 1.222 -4.667 3.667c.933 -1.223 2.023 -1.68 3.267 -1.375c.71 .174 1.217 .68 1.778 1.24c.916 .912 2 1.968 4.288 1.968c2.49 0 4.044 -1.222 4.667 -3.667c-.933 1.223 -2.023 1.68 -3.267 1.375c-.71 -.174 -1.217 -.68 -1.778 -1.24c-.916 -.912 -1.975 -1.968 -4.288 -1.968m-4 6.5c-2.49 0 -4.044 1.222 -4.667 3.667c.933 -1.223 2.023 -1.68 3.267 -1.375c.71 .174 1.217 .68 1.778 1.24c.916 .912 1.975 1.968 4.288 1.968c2.49 0 4.044 -1.222 4.667 -3.667c-.933 1.223 -2.023 1.68 -3.267 1.375c-.71 -.174 -1.217 -.68 -1.778 -1.24c-.916 -.912 -1.975 -1.968 -4.288 -1.968",
    ],
  },
  {
    id: "pnpm",
    label: "pnpm",
    bg: "#f69220",
    fg: "#ffffff",
    filled: false,
    paths: [
      "M3 17h4v4h-4l0 -4",
      "M10 17h4v4h-4l0 -4",
      "M17 17h4v4h-4l0 -4",
      "M17 10h4v4h-4l0 -4",
      "M17 3h4v4h-4l0 -4",
      "M10 10h4v4h-4l0 -4",
      "M10 3h4v4h-4l0 -4",
      "M3 3h4v4h-4l0 -4",
    ],
  },
  {
    id: "ubuntu",
    label: "Ubuntu",
    bg: "#e95420",
    fg: "#ffffff",
    filled: false,
    paths: [
      "M10 5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0",
      "M17.723 7.41a7.992 7.992 0 0 0 -3.74 -2.162m-3.971 0a7.993 7.993 0 0 0 -3.789 2.216m-1.881 3.215a8 8 0 0 0 -.342 2.32c0 .738 .1 1.453 .287 2.132m1.96 3.428a7.993 7.993 0 0 0 3.759 2.19m4 0a7.993 7.993 0 0 0 3.747 -2.186m1.962 -3.43a8.008 8.008 0 0 0 .287 -2.131c0 -.764 -.107 -1.503 -.307 -2.203",
      "M3 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0",
      "M17 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0",
    ],
  },
]

/** Compact bookmark row — first few marks that read well at ~12px. */
export const BOOKMARK_BRANDS: BrandMarkId[] = [
  "vercel",
  "supabase",
  "shadcn",
  "cloudflare",
  "docker",
]

/** Crowded tab strip — home-screen brands through React (user mark sits among these). */
export const CROWDED_TAB_BRANDS: BrandMarkId[] = BRAND_MARKS.slice(
  0,
  BRAND_MARKS.findIndex((b) => b.id === "react") + 1
).map((b) => b.id)
