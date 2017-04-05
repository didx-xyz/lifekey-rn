// external dependencies
import React from "react"

// internal dependencies
import HelpIcon from "./HelpIcon"

test("HelpIcon renders correctly, by default", () => {
  const tree = shallow(
    <HelpIcon width={16} height={16} />
  )

  expect(tree).toMatchSnapshot()
})

test("HelpIcon renders correctly, when modified", () => {
  const tree = shallow(
    <HelpIcon width={32} height={32} stroke="#fff" />
  )

  expect(tree).toMatchSnapshot()
})
