// external dependencies
import React from "react"
import Svg, { Line, Polygon } from "react-native-svg"

const MarketingIcon = (props) => {
  const dynamic = {
    "stroke": props.stroke
  }

  return (
    <Svg width={props.width} height={props.height} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23.4 21.4">
      <Line {...styles.cls1} {...dynamic} x1="22.9" y1="7.4" x2="0.5" y2="7.4"/>
      <Polygon {...styles.cls1} {...dynamic} points="11.7,20.9 0.5,7.4 5.5,0.5 17.9,0.5 22.9,7.4 11.7,20.9"/>
      <Polygon {...styles.cls1} {...dynamic} points="7.4,7.4 11.7,0.5 16,7.4 11.7,20.9 7.4,7.4"/>
      <Line {...styles.cls1} {...dynamic} x1="5.5" y1="0.5" x2="7.4" y2="7.4"/>
      <Line {...styles.cls1} {...dynamic} x1="17.9" y1="0.5" x2="16" y2="7.4"/>
    </Svg>
  )
}

MarketingIcon.defaultProps = {
  "stroke": "#000"
}

MarketingIcon.propTypes = {
  "width": React.PropTypes.number.isRequired,
  "height": React.PropTypes.number.isRequired,
  "stroke": React.PropTypes.string
}

const styles = {
  "cls1": {
    "fill": "none",
    "strokeLinecap": "round",
    "strokeLinejoin": "round"
  }
}

export default MarketingIcon
