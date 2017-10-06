// external dependencies
import React from "react"

// internal dependencies
import HexagonDots from "./HexagonDots"

test("HexagonDots renders correctly, by default", function() {
  const tree = shallow(
    <HexagonDots current={0} />
  )

  expect(tree).toMatchSnapshot()
})

test("HexagonDots renders correctly, when modified", function() {
  const steps = [1, 2, 3, 4, 5]

  steps.forEach(function(step) {
    const tree = shallow(
      <HexagonDots current={step} />
    )

    expect(tree).toMatchSnapshot()
  })
})
