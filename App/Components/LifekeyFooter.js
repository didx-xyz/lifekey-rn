
import React, { Component } from 'react'
import Design from '../DesignParameters'
import Palette from '../Palette'
import {
  Text,
  View,
  StyleSheet
} from 'react-native'
import Touchable from './Touchable'

class LifekeyFooter extends Component {

  render() {
    return (
      <View style={ Object.assign({}, style.wrappingView, { backgroundColor: this.props.backgroundColor }) }>
        { (!!this.props.leftButtonText || this.props.leftButtonIcon) &&
          <Touchable onPress={() => this.props.onPressLeftButton()}>
            <View style={style.leftButton}>
              <Text style={ Object.assign({}, style.buttonText, {color: this.props.color}) }>{this.props.leftButtonText}</Text>
              <View style={style.leftIcon}>{this.props.leftButtonIcon}</View>
            </View>
          </Touchable>
        }
        { (!!this.props.middleButtonText || this.props.middleButtonIcon) &&
          <Touchable onPress={() => this.props.onPressMiddleButton()}>
            <View style={style.middleButton}>
              <Text style={ Object.assign({}, style.buttonText, {color: this.props.color}) }>{this.props.middleButtonText}</Text>
              <View style={style.middleIcon}>{this.props.middleButtonIcon}</View>
            </View>
          </Touchable>
        }
        { (!!this.props.rightButtonText || this.props.rightButtonIcon) &&
          <Touchable onPress={() => this.props.onPressRightButton()}>
            <View style={style.rightButton}>
              <View style={style.rightIcon}>{this.props.rightButtonIcon}</View>
              <Text style={ Object.assign({}, style.buttonText, {color: this.props.color}) }>{this.props.rightButtonText}</Text>
            </View>
          </Touchable>
        }
      </View>
    )
  }
}

const style = {
  wrappingView: {
    height: 100,
    flexDirection: 'row'
  },
  leftButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 50
  },
  middleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  middleIcon: {
    paddingLeft: 10
  },
  rightButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 50
  },
  leftIcon: {
    paddingLeft: 10
  },
  rightIcon: {
    paddingRight: 10
  },
  buttonText: {
    fontSize: 20
  }
}

LifekeyFooter.defaultProps = {
  color: Palette.consentWhite,
  backgroundColor: Palette.consentBlue,
  leftButtonText: '',
  rightButtonText: '',
  onPressLeftButton: () => alert('Not implemented'),
  onPressRightButton: () => alert('Not implemented')
}

export default LifekeyFooter
