// external dependencies
import React from "react"

// internal dependencies
import BackButton from "./BackButton.ios"

test("BackButton renders correctly, by default", function() {
  const tree = shallow(
    <BackButton />
  )

  expect(tree).toMatchSnapshot()
})
