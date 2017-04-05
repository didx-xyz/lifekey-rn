// external dependencies
import React from "react"

// internal dependencies
import BackButton from "./BackButton.android"

test("BackButton renders correctly, by default", function() {
  const tree = shallow(
    <BackButton />
  )

  expect(tree).toMatchSnapshot()
})

test("BackButton renders correctly, when modified", function() {
  const tree = shallow(
    <BackButton onPress={() => alert("hi")} />
  )

  expect(tree).toMatchSnapshot()
})
