import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { LogicToggle } from "@/components/query-builder/logic-toggle"

describe("LogicToggle", () => {
  it("renders AND/OR radios and calls onChange", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<LogicToggle groupId="group-1" value="AND" onChange={onChange} />)

    expect(screen.getByRole("radio", { name: "AND" })).toHaveAttribute(
      "aria-checked",
      "true"
    )

    await user.click(screen.getByRole("radio", { name: "OR" }))
    expect(onChange).toHaveBeenCalledWith("OR")
  })
})
