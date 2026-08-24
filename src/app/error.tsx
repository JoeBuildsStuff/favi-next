"use client"

import { useEffect } from "react"
import Link from "next/link"

import { Button, buttonVariants } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="bg-background text-foreground flex min-h-full flex-col items-center justify-center px-6 py-16">
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-lg font-semibold tracking-tight">
          Something went wrong
        </h1>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          We couldn&apos;t load the editor or this page. Try again, or go back
          home.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <Button type="button" onClick={() => reset()}>
            Try again
          </Button>
          <Link href="/" className={buttonVariants({ variant: "outline" })}>
            Home
          </Link>
        </div>
        <p className="text-muted-foreground mt-4 text-xs">
          <Link
            href="/docs"
            className="hover:text-foreground underline-offset-4 hover:underline"
          >
            Docs
          </Link>
          {" · "}
          <Link
            href="/for-agents"
            className="hover:text-foreground underline-offset-4 hover:underline"
          >
            For agents
          </Link>
        </p>
      </div>
    </div>
  )
}
