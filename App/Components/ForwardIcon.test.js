// external dependencies
import React from "react"

// internal dependencies
import ForwardIcon from "./ForwardIcon"

test("ForwardIcon renders correctly, by default", function() {
  const tree = shallow(
    <ForwardIcon width={16} height={16} />
  )

  expect(tree).toMatchSnapshot()
})

test("ForwardIcon renders correctly, when modified", function() {
  const tree = shallow(
    <ForwardIcon width={32} height={32} stroke="#fff" />
  )

  expect(tree).toMatchSnapshot()
})
