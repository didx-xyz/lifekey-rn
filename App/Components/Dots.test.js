// external dependencies
import React from "react"

// internal dependencies
import Dots from "./Dots"

test("Dots renders correctly, by default", function() {
  const tree = shallow(
    <Dots />
  )

  expect(tree).toMatchSnapshot()
})

test("Dots renders correctly, when modified", function() {
  const tree = shallow(
    <Dots
      width={200}
      height={50}
      max={3}
      current={1}
      radius={6}
      space={2}
      strokeWidth={3}
      strokeColor="#000"
      fullFill="#000"
      emptyFill="#000"
    />
  )

  expect(tree).toMatchSnapshot()
})
