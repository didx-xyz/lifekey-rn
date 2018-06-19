// external dependencies
import React, { Component } from "react"
import Svg, { Polyline } from "react-native-svg"
import PropTypes from "prop-types"

class BackIcon extends Component {
  constructor(...params) {
    super(...params)

    this.dynamic = {
      "stroke": this.props.stroke
    }
  }

  render() {
    return (
      <Svg width={this.props.width} height={this.props.height} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <Polyline {...styles.cls1} {...this.dynamic} points="20.024,8 11.976,16.144 19.832,24"/>
      </Svg>
    )
  }
}

BackIcon.defaultProps = {
  "stroke": "#000"
}

BackIcon.propTypes = {
  "width": PropTypes.number.isRequired,
  "height": PropTypes.number.isRequired,
  "stroke": PropTypes.string
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
