// external dependencies
import React from "react"
import { Image } from "react-native"

const HexagonDots  = function(props) {
  let image = null

  switch (props.current) {
    case 0:
      image = require("../Images/blue_dots_1.png")
      break
    case 1:
      image = require("../Images/blue_dots_2.png")
      break
    case 2:
      image = require("../Images/blue_dots_3.png")
      break
    case 3:
      image = require("../Images/blue_dots_4.png")
      break
    default:
      image = require("../Images/blue_dots_5.png")
      break
  }

  return <Image style={{ height: 67, resizeMode: "contain" }} source={image} />
}

HexagonDots.propTypes = {
  "current": React.PropTypes.oneOf([0, 1, 2, 3, 4]).isRequired
}

export default HexagonDots
