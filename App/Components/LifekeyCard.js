/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Hein <hein@io.co.za>
 */

import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text
} from 'react-native'
import {
  Card,
  CardItem
} from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome'
import Design from "../DesignParameters"
import Palette from '../Palette'
import Touchable from '../Components/Touchable'

class LifekeyCard extends Component {

  constructor(props) {
    super(props)

    this.state = {
      expanded: false
    }

    this.onBoundPressSwitchExpand = this.onPressSwitchExpand.bind(this)
  }

  onPressSwitchExpand (event) {
    this.setState({ expanded: !this.state.expanded })
  }

  render() {

    var childrenWithExpandedProp = React.Children.map(this.props.children, (child) => React.cloneElement(child, { expanded: this.state.expanded }));

    if(this.state.expanded)
      return (
        <Card style={style.card}>
          <CardItem>
            <View style={style.cardHeader}>
              <Text style={style.cardHeadingText}>{this.props.headingText.toUpperCase()}</Text>
              <Touchable onPress={this.onBoundPressSwitchExpand}>
                <Icon style={Object.assign({}, style.cardHeadingIcon, style.cardHeadingIconLarge)} name="angle-down"  />
              </Touchable>
            </View>
          </CardItem>
          <CardItem style={style.cardBody}>
            { childrenWithExpandedProp }
          </CardItem>
          <CardItem>
            <View style={style.cardFooter}>
              <Touchable onPress={() => this.props.onPressEdit()}>
                <Text style={Object.assign({}, style.cardFooterText, style.cardFooterLeftText)}>EDIT</Text>
              </Touchable>
              <Touchable onPress={() => this.props.onPressShare()}>
                <Text style={Object.assign({}, style.cardFooterText, style.cardFooterRightText)}>SHARE</Text>
              </Touchable>
            </View>
          </CardItem>
        </Card>
      )
    else
      return(
        <Card style={style.card}>
          <CardItem>
            <View style={style.cardHeader}>
              <Text style={style.cardHeadingText}>{this.props.headingText.toUpperCase()}</Text>
              <Touchable onPress={this.onBoundPressSwitchExpand}>
                <Icon style={Object.assign({}, style.cardHeadingIcon, style.cardHeadingIconSmall)}  name="angle-right"  />
              </Touchable>
            </View>
          </CardItem>
          <CardItem style={style.cardBody}>
            { childrenWithExpandedProp }
          </CardItem>
        </Card>
      )
  }
}

const style = {
  card: {
    marginTop: Design.paddingLeft / 2,
    marginLeft: Design.paddingLeft / 2,
    marginRight: Design.paddingRight / 2
  },
  cardHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cardHeadingText: {
    "fontSize": 10,
    fontWeight: 'bold'
  },
  cardHeadingIcon: {
    marginTop: -10,
    color: Palette.consentGrayDark
  },
  cardHeadingIconSmall: {
    fontSize: 30
  },
  cardHeadingIconLarge: {
    fontSize: 32
  },
  cardBody: {
    "flex": 1,
    "paddingTop": 0,
    "marginTop": -10
  },
  cardFooter: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    "paddingTop": Design.paddingTop,
    "borderTopWidth": 1,
    "borderColor": Palette.consentGrayLightest
  },
  cardFooterText: {
    fontWeight: 'bold',
    fontSize: 12
  },
  cardFooterLeftText: {
    color: Palette.consentGrayDark
  },
  cardFooterRightText: {
    color: Palette.consentBlue
  },

}

LifekeyCard.defaultProps = {
  headingText: 'NOT_SET'
}

LifekeyCard.propTypes = {
  headingText: React.PropTypes.string
}

export default LifekeyCard
