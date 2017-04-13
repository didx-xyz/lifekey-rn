// external dependencies
import React from "react"
import Svg, { Path, Text } from "react-native-svg"
import PropTypes from "prop-types"

const HexagonIcon = (props) => {
  const dynamicPath = {
    "fill": props.fill
  }

  const dynamicText = {
    "fill": props.textColor,
    "x": props.textX,
    "y": props.textY,
    "fontSize": props.textSize
  }

  return (
    <Svg width={props.width} height={props.height} version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 110 110" xmlSpace="preserve">
      <Path {...dynamicPath} d="M48.9,103.3L16.2,84.4c-3.8-2.2-6.1-6.2-6.1-10.6V36c0-4.4,2.3-8.4,6.1-10.6L48.9,6.5
      	c3.8-2.2,8.4-2.2,12.2,0l32.7,18.9c3.8,2.2,6.1,6.2,6.1,10.6v37.8c0,4.4-2.3,8.4-6.1,10.6l-32.7,18.9
      	C57.3,105.4,52.7,105.4,48.9,103.3z"/>
      {props.text &&
        <Text {...dynamicText}>
          {props.text}
        </Text>
      }
    </Svg>
  )
}

HexagonIcon.defaultProps = {
  "fill": "#1a7bff",
  "textColor": "#fff",
  "textSize": 16,
  "textX": 0,
  "textY": 0
}

HexagonIcon.propTypes = {
  "width": PropTypes.number.isRequired,
  "height": PropTypes.number.isRequired,
  "fill": PropTypes.string,
  "textColor": PropTypes.string,
  "textSize": PropTypes.number,
  "textX": PropTypes.number,
  "textY": PropTypes.number,
  "text": PropTypes.string
}

export default HexagonIcon
