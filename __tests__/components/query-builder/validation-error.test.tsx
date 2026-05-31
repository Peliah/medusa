import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ValidationError } from "@/components/query-builder/validation-error"

describe("ValidationError", () => {
  it("renders nothing visible when message is null", () => {
    render(<ValidationError message={null} />)
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })

  it("shows an alert when a message is provided", () => {
    render(<ValidationError message="Select a field" />)
    expect(screen.getByRole("alert")).toHaveTextContent("Select a field")
  })
})
