// external dependencies
import React from "react"

// internal dependencies
import MarketingIcon from "./MarketingIcon"

test("MarketingIcon renders correctly, by default", function() {
  const tree = shallow(
    <MarketingIcon width={16} height={16} />
  )

  expect(tree).toMatchSnapshot()
})

test("MarketingIcon renders correctly, when modified", function() {
  const tree = shallow(
    <MarketingIcon width={32} height={32} stroke="#fff" />
  )

  expect(tree).toMatchSnapshot()
})
