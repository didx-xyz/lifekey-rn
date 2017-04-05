// external dependencies
import React from "react"
import Svg, { Path, Polyline } from "react-native-svg"

const VerifiedIcon = (props) => {
  const dynamic = {
    "stroke": props.stroke
  }

  return (
    <Svg width={props.width} height={props.height} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22.2 26.84401">
      <Path {...styles.cls1} {...dynamic} d="M14.1,2,3.5,5.6v11c0,8.5,10.6,11.2,10.6,11.2s10.6-2.7,10.6-11.2V5.6Z" translate="-3 -1.47195"/>
      <Polyline {...styles.cls1} {...dynamic} points="4.9,12.828 8.9,16.828 17.3,8.328"/>
    </Svg>
  )
}

VerifiedIcon.defaultProps = {
  "stroke": "#000"
}

VerifiedIcon.propTypes = {
  "width": React.PropTypes.number.isRequired,
  "height": React.PropTypes.number.isRequired,
  "stroke": React.PropTypes.string
}

const styles = {
  "cls1": {
    "fill": "none",
    "strokeMiterlimit": 10
  }
}

export default VerifiedIcon
