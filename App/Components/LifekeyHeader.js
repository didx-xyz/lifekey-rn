/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Hein <hein@io.co.za>
 */

import React, { Component } from 'react'
import Design from "../DesignParameters"
import Palette from "../Palette"
import Touchable from '../Components/Touchable'
import PropTypes from "prop-types"
import _ from 'lodash'

import {
  Text,
  View
} from 'react-native'

class LifekeyHeader extends Component {

  constructor(props) {
    super(props)
  }

  renderIcons() {
    return (
      <View style={style.navigation}>
        {
          this.props.icons.map((icon, i) => {
            const template = 
            (
              <View key={i}>
                <Touchable onLongPress={icon.onLongPress && icon.onLongPress} onPress={icon.onPress && icon.onPress}>
                  <View>
                    <View style={style.headerIcon}>{icon.icon}</View>
                    <View style={Object.assign({}, style.fixCircleClipping, {"borderColor": icon.borderColor})}/>
                  </View>
                </Touchable>
              </View>
            )
            return template
          })
        }
      </View>
    )
  }

  renderTabs() {
    return (
      <View style={style.tabs}>
        {
          this.props.tabs.map((tab, i) => {
            return (
              <Touchable key={i} onPress={tab.onPress}>
                <View style={
                  tab.active ? (
                    _.assign({}, style.tab, {borderBottomWidth: 2, borderColor: this.props.foregroundHighlightColor})
                  ) : style.tab
                }>
                  <Text style={
                    tab.active ? (
                      _.assign({}, style.tabText, {color: this.props.foregroundHighlightColor})
                    ) : style.tabText
                  }>{tab.text.toUpperCase()}</Text>
                </View>
              </Touchable>
            )
          })
        }
      </View>
    )
  }

  render() {
    return (
      <View style={_.assign({}, style.header, { backgroundColor: this.props.backgroundColor })}>
        {this.renderIcons()}
        {this.renderTabs()}
      </View>
    )
  }
}

const style = {
  header: {
    // backgroundColor: "white",
    flex: 1
  },
  headerIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    // overflow: "hidden",
    justifyContent: "center",
    alignItems: "center"
  },
  fixCircleClipping: {
    // https://github.com/facebook/react-native/issues/3198
    position: 'absolute',
    top: -25,
    bottom: -25,
    right: -25,
    left: -25,
    borderRadius: 50 / 2 + 25 / 2,
    borderWidth: 25
  },
  navigation: {
    flex: 2,
    width: "100%",
    paddingRight: Design.paddingRight,
    paddingLeft: Design.paddingLeft,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  "contextMenu":{
    "position" : "absolute",
    "backgroundColor": "red",
    "top": 50,
    "right": 0,
    "width": 150,
    "height": 150,
  },
  tabs: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  tabText: {
    fontSize: Design.navigationTabFontSize,
    color: Palette.consentGray,
    fontWeight: "bold"
  }
}

LifekeyHeader.propTypes = {
  icons: PropTypes.array,
  tabs: PropTypes.array,
  foregroundHighlightColor: PropTypes.string,
  backgroundColor: PropTypes.string
}

LifekeyHeader.defaultProps = {
  backgroundColor: "white",
  foregroundHighlightColor: Palette.consentBlue,
  foregroundColor: "black"
}
export default LifekeyHeader
