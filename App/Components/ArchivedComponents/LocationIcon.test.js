// external dependencies
import React from "react"

// internal dependencies
import LocationIcon from "./LocationIcon"

test("LocationIcon renders correctly, by default", function() {
  const tree = shallow(
    <LocationIcon width={16} height={16} />
  )

  expect(tree).toMatchSnapshot()
})

test("LocationIcon renders correctly, when modified", function() {
  const tree = shallow(
    <LocationIcon width={32} height={32} stroke="#fff" />
  )

  expect(tree).toMatchSnapshot()
})
