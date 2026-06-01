import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it } from "vitest"

import { ConditionGroup } from "@/components/query-builder/condition-group"
import { QueryBuilderDndProvider } from "@/components/query-builder/query-builder-dnd-provider"
import { buildGroup, buildRootWithRules } from "@/__tests__/utils/builders"
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

  it("renders empty state on the root group", () => {
    renderGroup()

    expect(screen.getByText(/no conditions in this group/i)).toBeInTheDocument()
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

  it("adds a rule when a nested group footer button is clicked", async () => {
    const user = userEvent.setup()
    const nested = buildGroup([])
    const tree = buildRootWithRules([])
    tree.conditions = [nested]

    renderGroup(tree)

    await user.click(screen.getByRole("button", { name: /add condition/i }))

    const updated = useQueryStore
      .getState()
      .tree.conditions.find(
        (condition) => condition.id === nested.id && "conditions" in condition
      )
    expect(
      updated && "conditions" in updated ? updated.conditions : []
    ).toHaveLength(1)
  })
})
