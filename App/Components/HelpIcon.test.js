// external dependencies
import React from "react"

// internal dependencies
import BackIcon from "./BackIcon"

test("BackIcon renders correctly, by default", () => {
  const tree = shallow(
    <BackIcon width={16} height={16} />
  )

  expect(tree).toMatchSnapshot()
})

test("BackIcon renders correctly, when modified", () => {
  const tree = shallow(
    <BackIcon width={32} height={32} stroke="#fff" />
  )

  expect(tree).toMatchSnapshot()
})
