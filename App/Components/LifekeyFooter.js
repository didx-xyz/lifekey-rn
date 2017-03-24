/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React, { Component } from 'react'
import {
  Text,
  View,
  StyleSheet
} from 'react-native'
import {
  Grid,
  Row,
  Col
} from 'native-base'
import Touchable from './Touchable'

class LifekeyFooter extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={style.wrappingView}>
        <Touchable onPress={() => this.props.onPressLeftButton()}>
          <View style={style.leftButton}>
            <Text style={style.buttonText}>{this.props.leftButtonText}</Text>
          </View>
        </Touchable>
        <Touchable onPress={() => this.props.onPressRightButton()}>
          <View style={style.rightButton}>
            <Text style={style.buttonText}>{this.props.rightButtonText}</Text>
          </View>
        </Touchable>
      </View>
    )
  }
}

const style = StyleSheet.create({
  wrappingView: {
    flex: 1,
    flexDirection: 'row'
  },
  leftButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  rightButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 20
  }
})

LifekeyFooter.defaultProps = {
  leftButtonText: 'Me',
  rightButtonText: 'Scan',
  onPressLeftButton: () => alert('Not implemented'),
  onPressRightButton: () => alert('Not implemented')
}

export default LifekeyFooter
