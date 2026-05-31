import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it } from "vitest"

import { ConditionRule } from "@/components/query-builder/condition-rule"
import { buildRootWithRules, buildRule } from "@/__tests__/utils/builders"
import { resetAllStores } from "@/__tests__/utils/store"
import { isRule } from "@/lib/query-engine/tree-utils"
import { agentsSchema } from "@/lib/schemas/agents"
import { useQueryStore } from "@/store/query-store"
import { useUIStore } from "@/store/ui-store"

describe("ConditionRule", () => {
  beforeEach(() => {
    resetAllStores()
  })

  it("renders field, operator, and value controls", () => {
    const rule = buildRule({
      field: "status",
      operator: "eq",
      value: "active",
    })

    render(<ConditionRule rule={rule} fields={agentsSchema.fields} />)

    expect(screen.getAllByRole("combobox").length).toBeGreaterThanOrEqual(2)
    expect(screen.getByLabelText("Operator")).toBeInTheDocument()
  })

  it("shows validation feedback for incomplete rules", () => {
    const rule = buildRule({
      field: "codename",
      operator: null,
      value: null,
    })

    render(<ConditionRule rule={rule} fields={agentsSchema.fields} />)

    expect(screen.getByRole("alert")).toHaveTextContent("Select an operator")
  })

  it("focuses the rule when the row is clicked", async () => {
    const user = userEvent.setup()
    const rule = buildRule({
      field: "status",
      operator: "eq",
      value: "active",
    })

    render(<ConditionRule rule={rule} fields={agentsSchema.fields} />)

    await user.click(screen.getByLabelText("Drag rule to reorder"))

    expect(useUIStore.getState().focusedConditionId).toBe(rule.id)
  })

  it("removes the rule through the query store", async () => {
    const user = userEvent.setup()
    const tree = buildRootWithRules([
      { field: "status", operator: "eq", value: "active" },
    ])
    const rule = tree.conditions[0]
    if (!isRule(rule)) throw new Error("expected rule")

    useQueryStore.setState({
      tree,
      rootId: tree.id,
      schemaId: "agents",
      past: [],
      future: [],
    })

    render(<ConditionRule rule={rule} fields={agentsSchema.fields} />)

    await user.click(screen.getByRole("button", { name: /remove rule/i }))

    expect(useQueryStore.getState().tree.conditions).toHaveLength(0)
  })
})
