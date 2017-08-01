// external dependencies
import React from "react"
import { Image } from "react-native"
import PropTypes from "prop-types"

const HexagonDots  = function(props) {
  let image = null

  switch (props.current) {
    case 0:
      image = require("../Images/1.1.gif")
      break
    case 1:
      image = require("../Images/2.1.gif")
      break
    case 2:
      image = require("../Images/3.1.gif")
      break
    case 3:
      image = require("../Images/4.1.gif")
      break
    default:
      image = require("../Images/5.1.gif")
      break
  }

  // switch (props.current) {
  //   case 0:
  //     image = require("../Images/1.gif")
  //     break
  //   case 1:
  //     image = require("../Images/2.gif")
  //     break
  //   case 2:
  //     image = require("../Images/3.gif")
  //     break
  //   case 3:
  //     image = require("../Images/4.gif")
  //     break
  //   default:
  //     image = require("../Images/5.gif")
  //     break
  // }

  return <Image style={{ height: props.height || 67, width: props.width || 67, resizeMode: "contain" }} source={image} />
}

HexagonDots.propTypes = {
  "current": PropTypes.oneOf([0, 1, 2, 3, 4, 5]).isRequired
}

export default HexagonDots
