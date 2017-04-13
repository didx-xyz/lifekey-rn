/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Hein <hein@io.co.za>
 */
import React, { Component } from 'react'
import Config from '../Config'
import Design from "../DesignParameters"
import Palette from "../Palette"
import { Container } from "native-base"
import Touchable from '../Components/Touchable'
import BackIcon from '../Components/BackIcon'

import {
  Text,
  View,
  StyleSheet,
  Image
} from 'react-native'

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
    this.setState({
      activeTab: this.TAB_SUGGESTED
    })
  }

  render() {

    return (
      <Container>
        <View style={style.header}>

          { /* TOP SECTION */ }
          <View style={style.navigationContainer}>

            <View style={style.navigation}>
              <View >
                <Touchable onPress={this.onPressBottomLeftButton}>
                  <BackIcon { ...Design.backIcon } />
                </Touchable>
              </View>
              <View style={style.profileImageContainer}>
                {/* image here */}
                <Image source={require('../Images/smiley_speech_bubble.png')}/>
              </View>
              <View>
                <Touchable onPress={this.onPressBottomRightButton}>
                  <Text>+</Text>
                </Touchable>
              </View>
            </View>
          </View>

          { /* BOTTOM SECTION */ }
          <View style={ style.tabs }>

            { /* The key for this map is the index. Which is a bad idea. */ }
            { this.props.tabs.map((tab, i) => {

                { /* https://facebook.github.io/react-native/docs/stylesheet.html#flatten */ }
                const tabStyle = tab.active ? StyleSheet.flatten([ style.tab, { borderBottomWidth: 2, borderColor: Palette.consentBlue } ]) : style.tab
                const tabTextStyle = tab.active ? StyleSheet.flatten([ style.tabText, { color: Palette.consentBlue } ]) : style.tabText

                return (
                  <Touchable key={i} onPress={this.onBoundPressBottomRightButton}>
                    <View style={ tabStyle }>
                      <Text style={ tabTextStyle }>{tab.text.toUpperCase()}</Text>
                    </View>
                  </Touchable>
                )
              }
            )}
          </View>
        </View>
      </Container>
    )
  }
}

const style = StyleSheet.create({
  "header": {
    "backgroundColor": "white",
    "flex": 1
  },
  "navigationContainer": {
    "flex": 2
  },
  "navigation": {
    "width": "100%",
    "paddingRight": Design.paddingRight,
    "paddingLeft": Design.paddingLeft,
    "flexDirection": "row",
    "justifyContent": "space-between",
    "alignItems": "center"
  },
  "profileImageContainer":{
    "height": "100%",
    "marginRight": Design.paddingRight,
    "justifyContent": "space-around",
    "alignItems": "center"
  },
  "tabs": {
    "flex": 1,
    "flexDirection": "row",
    "justifyContent": "space-around"
  },
  "tab": {
    "flex": 1,
    "justifyContent": "center",
    "alignItems": "center"
  },
  "tabText": {
    "fontSize": Design.navigationTabFontSize,
    "color": Palette.consentGray,
    "fontWeight": "bold"
  }
})

LifekeyHeader.propTypes = {
  "bottomLeftText": React.PropTypes.string,
  "onPressBottomLeft": React.PropTypes.func,
  "bottomRightText": React.PropTypes.string,
  "onPressBottomRight": React.PropTypes.func,
  "activeTab": React.PropTypes.number
}

LifekeyHeader.defaultProps = {
  "bottomLeftText": 'Connected',
  "bottomRightText": 'Suggested',
  "activeTab": LifekeyHeader.TAB_CONNECTED,
  onPressBottomLeft: () => ({}),
  onPressBottomRight: () => ({})
}

export default LifekeyHeader
