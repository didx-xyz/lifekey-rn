// external dependencies
import React from "react"
import { Image } from "react-native"
import PropTypes from "prop-types"

const HexagonDots  = function(props) {
  let image = null

  // switch (props.current) {
  //   case 0:
  //     image = require("../Images/dots-01.png")
  //     break
  //   case 1:
  //     image = require("../Images/dots-02.png")
  //     break
  //   case 2:
  //     image = require("../Images/dots-03.png")
  //     break
  //   case 3:
  //     image = require("../Images/dots-04.png")
  //     break
  //   default:
  //     image = require("../Images/dots-05.png")
  //     break
  // }

  switch (props.current) {
    case 0:
      image = require("../Images/1.gif")
      break
    case 1:
      image = require("../Images/2.gif")
      break
    case 2:
      image = require("../Images/3.gif")
      break
    case 3:
      image = require("../Images/4.gif")
      break
    default:
      image = require("../Images/5.gif")
      break
  }

  return <Image style={{ height: props.height || 67, width: props.width || 67, resizeMode: "contain" }} source={image} />
}

HexagonDots.propTypes = {
  "current": PropTypes.oneOf([0, 1, 2, 3, 4, 5]).isRequired
}

export default HexagonDots
