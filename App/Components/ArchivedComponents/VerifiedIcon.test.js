// external dependencies
import React from "react"

// internal dependencies
import VerifiedIcon from "./VerifiedIcon"

test("VerifiedIcon renders correctly, by default", function() {
  const tree = shallow(
    <VerifiedIcon width={16} height={16} />
  )

  expect(tree).toMatchSnapshot()
})

test("VerifiedIcon renders correctly, when modified", function() {
  const tree = shallow(
    <VerifiedIcon width={32} height={32} stroke="#fff" />
  )

  expect(tree).toMatchSnapshot()
})
