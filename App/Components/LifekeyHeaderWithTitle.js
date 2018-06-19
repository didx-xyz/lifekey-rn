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

class LifekeyHeaderWithTitle extends Component {

  constructor(props) {
    super(props)
  }

  renderTop() {
    const leftButton = this.props.leftButton;
    const rightButton = this.props.rightButton;

    return (
      <View style={style.navigation}>
        <View style={style.leftButton}>
          {leftButton &&
            <Touchable onLongPress={leftButton.onLongPress && leftButton.onLongPress} onPress={leftButton.onPress && leftButton.onPress}>
              {leftButton.icon}
            </Touchable>
          }
        </View>
        <View style={style.titleContainer}>
          {this.props.title &&
            <Text style={style.headingText}>{this.props.title}</Text>
          }
        </View>
        <View style={style.rightButton}>
          {rightButton &&
            <Touchable onLongPress={rightButton.onLongPress && rightButton.onLongPress} onPress={rightButton.onPress && rightButton.onPress}>
              {rightButton.icon}
            </Touchable>
          }
        </View>
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
                      Object.assign({}, style.tabText, { color: this.props.foregroundHighlightColor, borderBottomWidth: 2, borderColor: this.props.foregroundHighlightColor })
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
      <View style={{height: this.props.tabs ? 115 : 70}}>
        {this.renderTop()}
        {this.props.tabs && this.renderTabs()}
      </View>
    )
  }
}


const style = {
  
  container: {
    flex: 1,
    minWidth: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  leftContainer: {
    "justifyContent": "flex-start"
  },
  rightContainer: {
    "justifyContent": "flex-end"
  },

  navigation: {
    flex: 2,
    ...Platform.select({
      ios: {
        paddingTop: 20,
      },
    }),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headingText: {
    textAlign: "center",
    color: Palette.consentBlue,
    fontSize: 20,
  },
  titleContainer: {
    flex: 4,
    alignItems: "center",
    justifyContent: "center"
  },
  leftButton: {
    flex: 1,
    justifyContent: "center"
  },
  rightButton: {
    flex: 1,
    justifyContent: "center"
  },

  secondaryItemContainer: {
    // position: "absolute",
    // left: 0,
  },
  "contextMenu": {
    "position": "absolute",
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

LifekeyHeaderWithTitle.propTypes = {
  icons: PropTypes.array,
  title: PropTypes.string,
  leftButton: PropTypes.object,
  rightButton: PropTypes.object,
  tabs: PropTypes.array,
  foregroundHighlightColor: PropTypes.string,
  backgroundColor: PropTypes.string
}

LifekeyHeaderWithTitle.defaultProps = {
  backgroundColor: Palette.consentWhite,
  foregroundHighlightColor: Palette.consentBlue,
  foregroundColor: Palette.consentOffBlack
}
export default LifekeyHeaderWithTitle
