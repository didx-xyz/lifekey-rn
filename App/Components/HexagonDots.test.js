// external dependencies
import React from "react"

// internal dependencies
import HexagonDots from "./HexagonDots"

test("HexagonDots renders correctly, by default", () => {
  const tree = shallow(
    <HexagonDots />
  )

  expect(tree).toMatchSnapshot()
})

test("HexagonDots renders correctly, when modified", () => {
  const tree = shallow(
    <HexagonDots current={2} />
  )

  expect(tree).toMatchSnapshot()
})
