// external dependencies
import "react-native"
import React from "react"

// internal dependencies
import Lifekeyrn from "./App/Lifekeyrn"
import MockStorage from "./App/Components/MockStorage";

jest.mock("react-native-camera")

const cache = {}
const AsyncStorage = new MockStorage(cache)

jest.setMock("AsyncStorage", AsyncStorage)

test("renders correctly", function() {
  const tree = shallow(
    <Lifekeyrn />
  )

  expect(tree).toMatchSnapshot()
})
