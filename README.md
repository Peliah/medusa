# Medusa

**Query anything. Visually.**

Medusa is a visual query builder for constructing nested filter trees against schema-driven datasets. Build conditions in the UI, preview SQL / MongoDB / GraphQL output live, and run queries against mock data with sortable, paginated results.

**Live demo:** _Add your Vercel production URL after the first deploy_  
**Demo video:** [Watch on YouTube](https://youtu.be/U5YjQ-Jzgxw)

[![Medusa demo video](https://img.youtube.com/vi/U5YjQ-Jzgxw/maxresdefault.jpg)](https://youtu.be/U5YjQ-Jzgxw)

| Route      | Description                                  |
| ---------- | -------------------------------------------- |
| `/`        | Marketing landing page with interactive demo |
| `/builder` | Full query builder application               |

## Tech stack

- **Next.js 16** (App Router) + **React 19**
- **TypeScript**, **Tailwind CSS 4**, **shadcn/ui**
- **Zustand** + **Immer** for client state
- **Framer Motion**, **@dnd-kit** for UI interactions
- **Vitest** + **Testing Library** for unit and component tests

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) for the landing page, or [http://localhost:3000/builder](http://localhost:3000/builder) for the builder.

### Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `pnpm dev`        | Start development server |
| `pnpm build`      | Production build         |
| `pnpm start`      | Serve production build   |
| `pnpm lint`       | ESLint                   |
| `pnpm typecheck`  | TypeScript check         |
| `pnpm test`       | Run Vitest suite         |
| `pnpm test:watch` | Vitest in watch mode     |

## Architecture

```
app/
  page.tsx              Landing page
  builder/page.tsx      Builder route
components/
  landing/              Marketing sections
  layout/               App shell, header, sidebar, results drawer
  query-builder/        Recursive condition tree UI
  preview/              SQL / Mongo / GraphQL preview panel
  results/              Execution results table
  sidebar/              History, presets, schema controls
hooks/                  Keyboard shortcuts, responsive helpers
lib/
  query-engine/         Tree types, generators, validator, evaluator
  schemas/              Agents, Cities, Incidents field definitions
  data/                 Mock datasets for execution
store/
  query-store.ts        Query tree + undo/redo
  ui-store.ts           Preview format, modals, drawer state
  history-store.ts      Run history + saved presets
  execution-store.ts    Mock query execution lifecycle
```

### Data flow

1. The user edits a recursive **condition tree** in `query-store` (rules and nested AND/OR groups).
2. **Generators** (`lib/query-engine/generators/`) derive SQL, MongoDB, and GraphQL from the tree and active schema.
3. The **validator** blocks execution until every rule has a field, operator, and value where required.
4. The **evaluator** filters mock records client-side when the user runs a query.
5. **History** and **presets** persist in `localStorage` via `history-store`.

### Design decisions

- **Client-only execution** — mock data and evaluation run in the browser so the builder stays fast and deployable as a static Next.js app without a backend.
- **Schema-driven inputs** — field type (string, number, boolean, enum, date) drives operator lists and input components, keeping the rule UI consistent across Agents, Cities, and Incidents.
- **Immer patches + history stacks** — undo/redo and sidebar history snapshots clone the tree without a server round-trip.
- **Separated UI state** — preview tab, modals, and drawer visibility live in `ui-store` so the query tree stays focused on domain logic.

## Testing

CI runs on every pull request and push to `main`:

1. Typecheck
2. Lint
3. Vitest (`82` tests across query engine, stores, components, and hooks)
4. Production build

```bash
pnpm test
```

## Deployment

Medusa deploys to **Vercel** via GitHub Actions (`.github/workflows/cd.yml`):

- **CI runs first** — typecheck, lint, test, build (`.github/workflows/ci.yml`)
- **CD runs only if CI succeeds** — triggered by the completed CI workflow
- **Production** — after CI passes on push to `main`
- **Preview** — after CI passes on pull requests targeting `main`

### One-time setup

1. [Import the repo](https://vercel.com/new) in Vercel (or create a project manually).
2. Create a [Vercel access token](https://vercel.com/account/tokens).
3. Link the project locally to read IDs (no global install needed):

   ```bash
   pnpm dlx vercel@latest link
   cat .vercel/project.json
   ```

   `vercel link` is interactive — log in, pick your team, then select or create the Medusa project.

   **Without the CLI:** open your project in the [Vercel dashboard](https://vercel.com) → **Settings → General** for **Project ID**, and **Team Settings → General** for **Team ID** (`VERCEL_ORG_ID`).

4. Add these GitHub repository secrets:

   | Secret              | Source                                |
   | ------------------- | ------------------------------------- |
   | `VERCEL_TOKEN`      | Vercel account tokens                 |
   | `VERCEL_ORG_ID`     | `orgId` in `.vercel/project.json`     |
   | `VERCEL_PROJECT_ID` | `projectId` in `.vercel/project.json` |

5. Merge the CD workflow to `main` and confirm the **CD** workflow succeeds.
6. Update the **Live demo** link at the top of this README with your production URL.

Alternatively, connect the GitHub repo directly in the Vercel dashboard for automatic deploys without Actions — the workflow above is for explicit CD in the repository.

## License

Private — Stage 8 Frontend Wizards submission.
