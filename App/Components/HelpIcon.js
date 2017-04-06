// external dependencies
import React from "react"
import Svg, { Circle, Path } from "react-native-svg"

const HelpIcon = (props) => {
  const dynamic = {
    "stroke": props.stroke
  }

  return (
    <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.2 24.2">
      <Circle {...styles.cls1} {...dynamic} cx="12.1" cy="12.1" r="11.6"/>
      <Path {...styles.cls1} {...dynamic} d="M13.4,17.8a5.13621,5.13621,0,0,1,.2-1.6,4.39806,4.39806,0,0,1,1-1.2c.6-.7,1.1-1.2,1.4-1.6a2.86125,2.86125,0,0,0,.4-1.7,2.19854,2.19854,0,0,0-.6-1.7,2.35224,2.35224,0,0,0-1.7-.6,2.52325,2.52325,0,0,0-1.7.6,2.11126,2.11126,0,0,0-.6,1.6h-1v-.1a3.01254,3.01254,0,0,1,.9-2.3,3.188,3.188,0,0,1,2.4-.8,3.48564,3.48564,0,0,1,2.5.9,3.24364,3.24364,0,0,1,.9,2.4,3.697,3.697,0,0,1-.6,2.1,7.28015,7.28015,0,0,1-1.7,1.9,1.84874,1.84874,0,0,0-.7.9,4.12079,4.12079,0,0,0-.1,1.2Zm1.2,3.6H13.4V20h1.2Z" translate="-2 -2.8"/>
    </Svg>
  )
}

HelpIcon.defaultProps = {
  "stroke": "#000"
}

HelpIcon.propTypes = {
  "width": React.PropTypes.number.isRequired,
  "height": React.PropTypes.number.isRequired,
  "stroke": React.PropTypes.string
}

const styles = {
  "cls1": {
    "fill": "none",
    "stroke": "#000",
    "strokeMiterlimit": 10
  }
}

export default HelpIcon
