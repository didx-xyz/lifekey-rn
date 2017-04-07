// external dependencies
import React from "react"
import TouchableNativeFeedback from "react-native"

// internal dependencies
import Touchable from "./Touchable.android"

let fn = test.skip

if (TouchableNativeFeedback && TouchableNativeFeedback.Ripple) {
  fn = test
}

fn("Touchable renders correctly, by default", function() {
  const tree = shallow(
    <Touchable />
  )

  expect(tree).toMatchSnapshot()
})
