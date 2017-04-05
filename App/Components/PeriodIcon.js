// external dependencies
import React from "react"
import Svg, { Path, Polyline, Rect, Line } from "react-native-svg"

const PeriodIcon = (props) => {
  const dynamic = {
    "stroke": props.stroke
  }

  return (
    <Svg width={props.width} height={props.height} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23.4 23.4">
      <Polyline {...styles.cls1} {...dynamic} points="4.4,2.8 0.5,2.8 0.5,22.9 22.9,22.9 22.9,2.8 19,2.8"/>
      <Rect {...styles.cls1} {...dynamic} x="4.4" y="0.5" width="3.1" height="3.9"/>
      <Rect {...styles.cls1} {...dynamic} x="15.9" y="0.5" width="3.1" height="3.9"/>
      <Line {...styles.cls1} {...dynamic} x1="7.5" y1="2.8" x2="15.9" y2="2.8"/>
      <Line {...styles.cls1} {...dynamic} x1="0.5" y1="7.5" x2="22.9" y2="7.5"/>
      <Polyline {...styles.cls1} {...dynamic} points="5.9,13.2 8.5,11.2 8.5,19.1"/>
      <Line {...styles.cls1} {...dynamic} x1="6.2" y1="19.1" x2="10.4" y2="19.1"/>
      <Path {...styles.cls1} {...dynamic} d="M688.9,391.3h-5.1s2.9-2.9,3.8-3.9a3.10051,3.10051,0,0,0,.8-2.3,1.93719,1.93719,0,0,0-2.1-1.6c-1,0-1.9.2-2.5,1.9" translate="-671.4 -372.2"/>
    </Svg>
  )
}

PeriodIcon.defaultProps = {
  "stroke": "#000"
}

PeriodIcon.propTypes = {
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

export default PeriodIcon
