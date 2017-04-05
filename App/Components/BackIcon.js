import React from "react"
import Svg, { Polyline } from "react-native-svg"

const BackIcon = (props) => {
  const dynamic = {
    "stroke": props.stroke || "#000"
  }

  return (
    <Svg width={props.width} height={props.height} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9.4 17.7">
      <Polyline {...styles.cls1} {...dynamic} points="8.9,0.5 0.5,9 8.7,17.2"/>
    </Svg>
  )
}

const styles = {
  "cls1": {
    "fill": "none",
    "stroke": "#000",
    "strokeLinecap": "round",
    "strokeLinejoin": "round"
  }
}

export default BackIcon
