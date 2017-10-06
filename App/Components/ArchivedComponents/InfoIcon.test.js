// external dependencies
import React from "react"

// internal dependencies
import InfoIcon from "./InfoIcon"

test("InfoIcon renders correctly, by default", function() {
  const tree = shallow(
    <InfoIcon width={16} height={16} />
  )

  expect(tree).toMatchSnapshot()
})

test("InfoIcon renders correctly, when modified", function() {
  const tree = shallow(
    <InfoIcon width={32} height={32} stroke="#fff" />
  )

  expect(tree).toMatchSnapshot()
})
