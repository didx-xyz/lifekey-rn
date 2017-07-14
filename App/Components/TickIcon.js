// external dependencies
import React from "react"
import Svg, { Path, G } from "react-native-svg"
import PropTypes from "prop-types"

const TickIcon = (props) => {
  const dynamic = {
    "stroke": props.stroke,
    "color": props.stroke
  }

  return (
    <Svg width={props.width} height={props.height} id='Layer_1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 1000'>
      <G>
        <Path {...dynamic} d="M500,10C229.8,10,10,229.8,10,500c0,270.2,219.8,490,490,490c270.2,0,490-219.8,490-490C990,229.8,770.2,10,500,10z M500,952.3C250.2,952.3,47.7,749.8,47.7,500C47.7,250.2,250.2,47.7,500,47.7c249.8,0,452.3,202.5,452.3,452.3C952.3,749.8,749.8,952.3,500,952.3z M683.9,356.4L441,615.2l-88.6-94.4c-9.5-10.1-25-10.1-34.5,0c-9.5,10.2-9.5,26.6,0,36.8L441,688.7l277.4-295.6c9.5-10.2,9.5-26.6,0-36.8C708.9,346.2,693.4,346.2,683.9,356.4z"/>
      </G>
    </Svg>
  )
}

TickIcon.defaultProps = {
  "stroke": "blue"
}

TickIcon.propTypes = {
  "width": PropTypes.number.isRequired,
  "height": PropTypes.number.isRequired,
  "stroke": PropTypes.string
}

const styles = {
  "cls1": {
    "fill": "black",
    "strokeMiterlimit": 10
  },
  "cls2": {
    "fill": "none",
    "strokeLinecap": "round",
    "strokeLinejoin": "round"
  },
  "cls3": {
    "fill": "none",
    "strokeLinecap": "round",
    "strokeLinejoin": "round",
    "strokeWidth": 2
  }
}

export default TickIcon



