import React, { Component } from 'react'
import * as Nachos from 'nachos-ui'
import PropTypes from 'prop-types'

class DebugButton extends Component {

  constructor(props) {
    super(props)

  }

  render = () =>
    <Nachos.Button
      iconName={this.props.iconName}
      kind={this.props.kind}
      type={this.props.type}
      onPress={() => this.props.onPress()}
      style={{ margin: 5 }}
    >
      {this.props.text}
    </Nachos.Button>
}

DebugButton.defaultProps = {
  iconName: null,
  kind: "squared",
  type: "primary",
  onPress: () => alert("onPress not set"),
}

DebugButton.propTypes = {
  iconName: PropTypes.string,
  kind: PropTypes.string,
  type: PropTypes.string,
  onPress: PropTypes.func,
  text: PropTypes.string,
}

export default DebugButton
