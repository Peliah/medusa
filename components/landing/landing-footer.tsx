"use client"

import Link from "next/link"
import { GithubLogoIcon } from "@phosphor-icons/react"

import {
  GITHUB_README_URL,
  GITHUB_REPO_URL,
  LANDING_SECTIONS,
} from "@/components/landing/constants"
import { FooterBrandMark } from "@/components/landing/footer-brand-mark"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type FooterLink = {
  href: string
  label: string
  external?: boolean
}

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Product",
    links: [
      { href: "/builder", label: "Query builder" },
      { href: LANDING_SECTIONS.features, label: "Features" },
      { href: LANDING_SECTIONS.resources, label: "Resources" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: LANDING_SECTIONS.resources, label: "Templates" },
      {
        href: GITHUB_README_URL,
        label: "README",
        external: true,
      },
    ],
  },
  {
    title: "Developers",
    links: [
      {
        href: GITHUB_REPO_URL,
        label: "GitHub",
        external: true,
      },
    ],
  },
]

function FooterLinkItem({ link }: { link: FooterLink }) {
  const className =
    "text-sm text-muted-foreground transition-colors hover:text-foreground"

  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {link.label}
      </a>
    )
  }

  return (
    <Link href={link.href} className={className}>
      {link.label}
    </Link>
  )
}

export function LandingFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-border pt-16 pb-28">
      <FooterBrandMark />

      <div className="landing-container relative z-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <FooterLinkItem link={link} />
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
              Get updates on MEDUSA releases.
            </p>
            <form
              className="mt-3 flex gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
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

          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="GitHub repository"
          >
            <GithubLogoIcon className="size-5" />
          </a>

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} MEDUSA · Query anything. Visually.
          </p>
        </div>
      </div>
    </footer>
  )
}
