/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */
import React, { Component } from 'react'
import Palette from '../Palette'
import Config from '../Config'
import Touchable from '../Components/Touchable'
import PropTypes from "prop-types"

import {
  Text,
  View,
  StyleSheet,
  Image
} from 'react-native'

const DEBUG = false

class LifekeyHeader extends Component {

  TAB_CONNECTED = 0
  TAB_SUGGESTED = 1

  constructor(props) {

    super(props)
    this.state = {
      activeTab: this.TAB_CONNECTED,
      bottomLeftText: props.bottomLeftText,
      bottomRightText: props.bottomRightText,
      tabs: props.tabs
    }
  }

  onPressBottomLeftButton() {
    this.props.onPressBottomLeft()
    this.setState({
      activeTab: this.TAB_CONNECTED
    })
  }

  onPressBottomRightButton() {
    this.props.onPressBottomRight()
    this.setState({
      activeTab: this.TAB_SUGGESTED
    })
  }

  render() {

    return (
      <View style={style.header}>

        { /* TOP SECTION */ }
        <View style={style.topView}>

          { /* TOP LEFT */ }
          <View style={style.topViewLeft}>
            <Image source={require('../Images/torn_page.png')}/>
          </View>

        { /* TOP CENTER */ }
        { Config.DEBUG ?
          <Touchable delayLongPress={500} onLongPress={() => this.props.onLongPressTopCenter()}>
            <View style={style.topViewCenter}>
              <Image source={require('../Images/blue_dots_static.png')}/>
            </View>
          </Touchable>

          :
          <View style={style.topViewCenter}>
            <Image source={require('../Images/blue_dots_static.png')}/>
          </View>
        }

          { /* TOP RIGHT */ }
          <View style={style.topViewRight}>
            <Image source={require('../Images/smiley_speech_bubble.png')}/>
          </View>

        </View>

        { /* BOTTOM SECTION */ }
        <View style={style.bottomView}>

          { this.props.tabs.map((tab, i) =>
            <Touchable key={i} onPress={() => tab.onPress()}>
              <View style={[
                style.bottomButton,
                { borderColor: tab.active ? Palette.consentBlue : Palette.consentGrayDark }
              ]}>
                <Text style={{ fontSize: 16 }}>{tab.text}</Text>
              </View>
            </Touchable>
          )}
        </View>

      </View>
    )
  }
}

const style = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    flex: 1
  },
  topView: {
    flex: 3,
    flexDirection: 'row'
  },
  topViewLeft: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: DEBUG ? 'green' : null
  },
  topViewCenter: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: DEBUG ? 'red' : null
  },
  topViewRight: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: DEBUG ? 'green' : null
  },
  bottomView: {
    flex: 2,
    flexDirection: 'row',
  },
  bottomGap: {
    flex: 2,

  },
  bottomButton: {
    flex: 4,
    borderColor: Palette.consentBlue,
    borderBottomWidth: 2,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

LifekeyHeader.propTypes = {
  bottomLeftText: PropTypes.string,
  onPressBottomLeft: PropTypes.func,
  bottomRightText: PropTypes.string,
  onPressBottomRight: PropTypes.func,
  activeTab: PropTypes.number
}

LifekeyHeader.defaultProps = {
  bottomLeftText: 'Connected',
  bottomRightText: 'Suggested',
  activeTab: LifekeyHeader.TAB_CONNECTED,
  onPressBottomLeft: () => ({}),
  onPressBottomRight: () => ({})
}

export default LifekeyHeader
