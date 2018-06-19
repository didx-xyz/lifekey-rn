// external dependencies
import React from "react"

// internal dependencies
import HexagonIcon from "./HexagonIcon"

test("HexagonIcon renders correctly, by default", function() {
  const tree = shallow(
    <HexagonIcon width={16} height={16} />
  )

  expect(tree).toMatchSnapshot()
})

test("HexagonIcon renders correctly, when modified", function() {
  const tree = shallow(
    <HexagonIcon
      width={32}
      height={32}
      fill="#fff"
      textSize={14}
      textX={5}
      textY={5}
      text="Connect"
    />
  )

  expect(tree).toMatchSnapshot()
})
