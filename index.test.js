import "react-native"
import React from "react"
import Lifekeyrn from "./App/Lifekeyrn"

jest.mock("react-native-camera")

it("renders correctly", function() {
  const tree = shallow(
    <Lifekeyrn />
  )

  expect(tree).toMatchSnapshot()
})
