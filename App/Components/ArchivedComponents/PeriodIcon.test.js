// external dependencies
import React from "react"

// internal dependencies
import PeriodIcon from "./PeriodIcon"

test("PeriodIcon renders correctly, by default", function() {
  const tree = shallow(
    <PeriodIcon width={16} height={16} />
  )

  expect(tree).toMatchSnapshot()
})

test("PeriodIcon renders correctly, when modified", function() {
  const tree = shallow(
    <PeriodIcon width={32} height={32} stroke="#fff" />
  )

  expect(tree).toMatchSnapshot()
})
