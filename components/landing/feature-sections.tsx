import {
  ExecutionIllustration,
  PreviewIllustration,
} from "@/components/landing/feature-illustrations"
import { FeatureShowcase } from "@/components/landing/feature-showcase"

export function PreviewFeatureSection() {
  return (
    <FeatureShowcase
      eyebrow="Query preview platform"
      title="Preview and validate"
      subtitle="Tune conditions. Improve recall. Tweak until your filters achieve the precision you need — without leaving the builder."
      subheading="Live output — Track query shape across formats in real time"
      links={[
        "Generate SQL, MongoDB, and GraphQL from the same visual tree",
        "Validate operator compatibility and required values before execution",
        "Surface inline errors for empty groups and incompatible field types",
        "Score query complexity as conditions and nesting depth grow",
      ]}
      secondaryHeading="Built-in validation — Block invalid queries before they run"
      illustration={<PreviewIllustration />}
    />
  )
}

export function ExecutionFeatureSection() {
  return (
    <FeatureShowcase
      eyebrow="Execution simulator"
      title="Execute and inspect"
      subtitle="Filter seeded mock datasets client-side. Inspect matches, sort columns, and paginate results — no backend required."
      subheading="Flexible execution — Run queries against Agents, Cities, or Incidents"
      links={[
        "Recursive filter engine evaluates nested AND/OR logic accurately",
        "Simulated loading state with match count and empty-state handling",
        "Sort and paginate results with type-aware cell rendering",
        "Export matched records as CSV for quick inspection",
      ]}
      secondaryHeading="Deterministic datasets — Same query, same results every run"
      illustration={<ExecutionIllustration />}
      reversed
    />
  )
}
