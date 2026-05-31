# **Description**

This PR replaces the starter home page with a full marketing landing page for Medusa — a visual query builder product. The page introduces the product value proposition, showcases key features, includes an interactive query demo with live SQL/MongoDB/GraphQL previews, and routes users toward the builder via a primary CTA.

**Branch:** `feat/landing-page` → `main`  
**Scope:** 26 files changed, ~2,133 additions

# **Changes Proposed**

## **What were you told to do?**

Build and implement the Medusa landing page — hero, feature sections, interactive demo, resources, FAQ, footer, and supporting layout/styling — as the new home page experience.

## **What did you do?**

### App shell

- Replaced the placeholder `app/page.tsx` with the new `LandingPage` composition.
- Added site metadata (title and description) to `app/layout.tsx`.
- Extended `app/globals.css` with landing-specific utilities: marquee animations, hero glow, network graphic styles, dashboard mock perspective, section dividers, scroll-reveal transitions, footer brand hover effect, and shared layout tokens (`.landing-container`, `.landing-section`, etc.).

### Landing page structure (`components/landing/`)

| Section      | Component                                                                                           | Highlights                                                                                         |
| ------------ | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Header       | `landing-header.tsx`                                                                                | Fixed nav with scroll state, mobile sheet menu, theme toggle, GitHub link                          |
| Hero         | `hero-section.tsx`                                                                                  | Headline, install command copy, network background graphic, dashboard mock                         |
| Social proof | `logo-marquee.tsx`                                                                                  | Dual-direction infinite logo marquee                                                               |
| Features     | `feature-sections.tsx`, `feature-showcase.tsx`, `feature-illustrations.tsx`, `features-section.tsx` | Preview & execution feature blocks with icons and scroll-triggered reveals                         |
| Demo         | `query-demo.tsx`                                                                                    | Interactive schema switcher (Agents, Cities, Incidents) with tabbed SQL / MongoDB / GraphQL output |
| Resources    | `resources-section.tsx`, `schemas-section.tsx`, `stats-section.tsx`                                 | Tabbed resource cards, schema overview, animated stats                                             |
| FAQ          | `faq-section.tsx`                                                                                   | Expand/collapse accordion-style FAQ                                                                |
| CTA          | `cta-section.tsx`                                                                                   | “Get started” → `/builder`, documentation link                                                     |
| Footer       | `landing-footer.tsx`, `footer-brand-mark.tsx`                                                       | Links, interactive “MEDUSA” brand mark with cursor-following gradient                              |

### Shared utilities

- `scroll-reveal.tsx` — intersection-based entrance animations for sections.
- `section-divider.tsx` — consistent horizontal dividers between sections.
- `theme-toggle.tsx` — light/dark mode toggle in the header.
- `hooks/use-in-view.ts` — reusable Intersection Observer hook (fires once at 15% visibility).

### Commits on this branch

1. `feat: landing page and layout setting`
2. `feat: hero page design and implementation`
3. `feat: setting up landing page layouts`
4. `feat: landing page layout`
5. `feat: cta section and faq, leading up to the builder side of things`
6. `feat: footer brand and hook`

## Types of changes

- [ ] Bug fix (non-breaking change which fixes an issue)
- [x] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)
- [ ] Chore (changes that do not relate to a fix or feature and don't modify src or test files)

# **Check List**

- [x] My code follows the code style of this project.
- [x] This PR does not contain plagiarized content.
- [x] The title and description of the PR are clear and explain the approach.
- [ ] I am making a pull request against the **dev branch** (left side).
- [x] My commit message style matches our requested structure.
- [ ] My code additions will not fail code linting checks or unit tests.
- [x] I am only making changes to files I was requested to.

> **Lint note:** `pnpm lint` currently reports 3 pre-existing `react-hooks/set-state-in-effect` errors in `components/landing/theme-toggle.tsx`, `components/ui/carousel.tsx`, and `hooks/use-mobile.ts`. None are introduced by the landing page components directly, but they should be addressed before merge if CI enforces lint.

---

# Images

<!-- Add Screenshots of: -->

- The live component worked on
- Linting check (run pnpm lint)

## Suggested PR title

```
feat: add Medusa marketing landing page
```

## Test plan

- [ ] Run `pnpm dev` and verify `/` renders the full landing page
- [ ] Confirm header nav anchors scroll to `#features`, `#resources`, `#demo`, and `#faq`
- [ ] Test mobile nav sheet and responsive layout at sm / md / lg breakpoints
- [ ] Toggle light/dark theme and verify hero glow, marquees, and footer brand mark
- [ ] Interact with the query demo — switch schemas and SQL / MongoDB / GraphQL tabs
- [ ] Expand/collapse FAQ items
- [ ] Click “Get started” and confirm navigation to `/builder`
- [ ] Run `pnpm build` — production build passes
- [ ] Run `pnpm lint` — resolve or track remaining lint errors
