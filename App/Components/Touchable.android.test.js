// external dependencies
import React from "react"

// internal dependencies
import Touchable from "./Touchable.android"

test("Touchable renders correctly, by default", function() {
  const tree = shallow(
    <Touchable />
  )

  expect(tree).toMatchSnapshot()
})
