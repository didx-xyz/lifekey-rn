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

  render() {

    return (
        <View style={style.header}>
          { /* TOP SECTION */ }
          <View style={style.navigation}>

            { this.props.icons.map((icon, i) =>
              <View key={i}>
                <Touchable
                  onLongPress={() => icon.onLongPress && icon.onLongPress()}
                  onPress={() => icon.onPress && icon.onPress()}>
                  <View>{icon.icon}</View>
                </Touchable>
              </View>
            )}

          </View>

          { /* BOTTOM SECTION */ }
          <View style={ style.tabs }>

            { /* The key for this map is the index. Which is a bad idea. */ }
            { this.props.tabs.map((tab, i) => {

              const tabStyle = tab.active ?
                _.assign({}, style.tab, { borderBottomWidth: 2, borderColor: Palette.consentBlue })
              :
                style.tab

              const tabTextStyle = tab.active ?
                _.assign({}, style.tabText, { color: Palette.consentBlue })
                :
                  style.tabText
              console.log(tabTextStyle)
              return (
                <Touchable key={i} onPress={() => tab.onPress()}>
                  <View style={ tabStyle }>
                    <Text style={ tabTextStyle }>{tab.text.toUpperCase()}</Text>
                  </View>
                </Touchable>
              )
            })}
          </View>
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
