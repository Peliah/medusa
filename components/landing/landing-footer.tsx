"use client"

import Link from "next/link"
import {
  GithubLogoIcon,
  TwitterLogoIcon,
} from "@phosphor-icons/react"

import { FooterBrandMark } from "@/components/landing/footer-brand-mark"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const columns = [
  {
    title: "Product",
    links: [
      { href: "/builder", label: "Query builder" },
      { href: "#features", label: "Preview engine" },
      { href: "#features", label: "Execution" },
      { href: "#resources", label: "Schemas" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "#resources", label: "Templates" },
      { href: "#faq", label: "FAQ" },
      { href: "#", label: "Architecture" },
      { href: "#", label: "Changelog" },
    ],
  },
  {
    title: "Developers",
    links: [
      { href: "#", label: "Docs" },
      { href: "#", label: "GitHub" },
      { href: "#", label: "Contributing" },
      { href: "#", label: "Testing" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "#", label: "About" },
      { href: "#", label: "HNG Stage 8" },
      { href: "#", label: "Contact" },
    ],
  },
]

export function LandingFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-border pt-16 pb-28">
      <FooterBrandMark />

      <div className="landing-container relative z-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="sm:col-span-2 lg:col-span-1">
            <p className="text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
              Newsletter
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Get updates on TOBi releases.
            </p>
            <form className="mt-3 flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="email"
                placeholder="you@company.com"
                className="h-9 text-sm"
                aria-label="Email address"
              />
              <Button type="submit" size="sm" variant="secondary">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <div className="flex items-center gap-2 text-sm">
            <span className="size-2 rounded-full bg-chart-2" aria-hidden />
            <span className="text-muted-foreground">Fully operational</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="GitHub"
            >
              <GithubLogoIcon className="size-5" />
            </Link>
            <Link
              href="#"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Twitter"
            >
              <TwitterLogoIcon className="size-5" />
            </Link>
          </div>

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} TOBi · Query anything. Visually.
          </p>
        </div>
      </div>
    </footer>
  )
}
