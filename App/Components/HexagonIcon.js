// external dependencies
import React from "react"
import Svg, { Path } from "react-native-svg"

const HexagonIcon = (props) => {
  const dynamic = {
    "fill": props.fill
  }

  return (
    <Svg width={props.width} height={props.height} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 89.8 100.025">
      <Path {...dynamic} d="M676.9,432.3l-32.7-18.9a12.17786,12.17786,0,0,1-6.1-10.6V365a12.17787,12.17787,0,0,1,6.1-10.6l32.7-18.9a12.10076,12.10076,0,0,1,12.2,0l32.7,18.9a12.17786,12.17786,0,0,1,6.1,10.6v37.8a12.17787,12.17787,0,0,1-6.1,10.6l-32.7,18.9A12.60021,12.60021,0,0,1,676.9,432.3Z" translate="-638.1 -333.85"/>
    </Svg>
  )
}

HexagonIcon.defaultProps = {
  "fill": "#1a7bff"
}

HexagonIcon.propTypes = {
  "width": React.PropTypes.number.isRequired,
  "height": React.PropTypes.number.isRequired,
  "fill": React.PropTypes.string
}

export default HexagonIcon
