import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it } from "vitest"

import { ConditionGroup } from "@/components/query-builder/condition-group"
import { QueryBuilderDndProvider } from "@/components/query-builder/query-builder-dnd-provider"
import { buildRootWithRules } from "@/__tests__/utils/builders"
import { resetAllStores } from "@/__tests__/utils/store"
import { useQueryStore } from "@/store/query-store"

function renderGroup(tree = buildRootWithRules([])) {
  useQueryStore.setState({
    tree,
    rootId: tree.id,
    schemaId: "agents",
    past: [],
    future: [],
  })

  return render(
    <QueryBuilderDndProvider>
      <ConditionGroup group={tree} isRoot depth={0} />
    </QueryBuilderDndProvider>
  )
}

describe("ConditionGroup", () => {
  beforeEach(() => {
    resetAllStores()
  })

  it("renders empty state actions on the root group", () => {
    renderGroup()

    expect(
      screen.getByText("No conditions yet. Add a rule or nested group.")
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /add rule/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /add group/i })
    ).toBeInTheDocument()
  })

  it("renders nested rules recursively", () => {
    const tree = buildRootWithRules([
      { field: "status", operator: "eq", value: "active" },
      { field: "codename", operator: "contains", value: "night" },
    ])

    renderGroup(tree)

    expect(screen.getByText("Root group")).toBeInTheDocument()
    expect(screen.getAllByRole("combobox").length).toBeGreaterThan(0)
  })

  it("adds a rule when the footer button is clicked", async () => {
    const user = userEvent.setup()
    renderGroup()

    await user.click(screen.getByRole("button", { name: /add rule/i }))

    expect(useQueryStore.getState().tree.conditions).toHaveLength(1)
  })
})
