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
  Platform,
  StyleSheet,
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

            const containerPosition = i === 0 ? style.leftContainer : i ===  1 ? {} : style.rightContainer
            const mainIconStyle = i === 1 ? style.mainHeaderIcon : {}
            const template = 
            (
              <View key={i}>
                <Touchable onLongPress={icon.onLongPress && icon.onLongPress} onPress={icon.onPress && icon.onPress}>
                  
                  {
                    i !== this.props.icons.length - 1 ?
                      (
                        <View style={Object.assign({}, style.container, containerPosition)}>
                          <View style={Object.assign({}, style.headerIcon, mainIconStyle)}>{icon.icon}</View>
                          { icon.secondaryItem && <View style={ style.secondaryItemContainer }>{icon.secondaryItem}</View> }
                        </View>
                      )
                    :
                      (
                        <View style={Object.assign({}, style.container, containerPosition)}>
                          { icon.secondaryItem && <View style={ style.secondaryItemContainer }>{icon.secondaryItem}</View> }
                          <View style={style.headerIcon}>{icon.icon}</View>
                        </View>
                      )
                  }

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
              <Touchable key={i} onPress={tab.onPress} noRipple={true}>
                <View style={style.tab}>
                  <Text style={
                    tab.active ? (
                      Object.assign({}, style.tabText, {color: this.props.foregroundHighlightColor, borderBottomWidth: 2, borderColor: this.props.foregroundHighlightColor})
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
      <View style={Object.assign({}, style.header, { backgroundColor: this.props.backgroundColor })}>
        {this.renderIcons()}
        {this.renderTabs()}
      </View>
    )
  }
}
 

const style = {
  header: {
    height: 115,
  },
  container: {
    flex: 1,
    minWidth: 80,
    flexDirection: "row",
    alignItems: "center",
    "justifyContent" : "center"
  },
  leftContainer: {
    "justifyContent" : "flex-start"
  },
  rightContainer: {
    "justifyContent" : "flex-end"
  },
  headerIcon: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center"
  },
  mainHeaderIcon: {
    width: 42,
    height: 48
  },
  navigation: {
    flex: 2,
    paddingRight: Design.paddingRight,
    paddingLeft: Design.paddingLeft,
    ...Platform.select({
      ios: {
        paddingTop: 50,
      },
    }),
    flexDirection: "row",
    justifyContent: "space-between",
  },  
  secondaryItemContainer: {
    // position: "absolute",
    // left: 0,
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
    flex: 1,
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
  backgroundColor: Palette.consentWhite,
  foregroundHighlightColor: Palette.consentBlue,
  foregroundColor: Palette.consentOffBlack
}
export default LifekeyHeader
