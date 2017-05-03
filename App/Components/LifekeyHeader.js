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
  View,
  StyleSheet,
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
            return (
              <View key={i}>
                <Touchable onLongPress={icon.onLongPress && icon.onLongPress}
                           onPress={icon.onPress && icon.onPress}>
                  <View>{icon.icon}</View>
                </Touchable>
              </View>
            )
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
                    _.assign({}, style.tab, {borderBottomWidth: 2, borderColor: Palette.consentBlue})
                  ) : style.tab
                }>
                  <Text style={
                    tab.active ? (
                      _.assign({}, style.tabText, {color: Palette.consentBlue})
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
      <View style={style.header}>
        {this.renderIcons()}
        {this.renderTabs()}
      </View>
    )
  }
}

const style = {
  header: {
    backgroundColor: "white",
    flex: 1
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
  profileImageContainer: {
    height: "100%",
    marginRight: Design.paddingRight,
    justifyContent: "space-around",
    alignItems: "center"
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
  tabs: PropTypes.array
}

export default LifekeyHeader
