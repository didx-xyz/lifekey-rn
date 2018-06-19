
import React, {Component} from 'react'
import Scene from '../Scene'
import Palette from '../Palette'
import Design from '../DesignParameters'
import Config from '../Config'
import Logger from '../Logger'
import Routes from '../Routes'
import Api from '../Api'
import LifekeyHeader from '../Components/LifekeyHeader'
import LifekeyCard from '../Components/LifekeyCard'
import Touchable from '../Components/Touchable'
import BackIcon from '../Components/BackIcon'
import AndroidBackButton from 'react-native-android-back-button'
import ConsentThanksMessage from '../Models/ConsentThanksMessage'
import ConsentUser from '../Models/ConsentUser'
import ThanksIcon from '../Components/ThanksIcon'

import {
  Text,
  View,
  Dimensions,
  Image
} from 'react-native'

import {
  Container,
  Col,
  Footer,
  ListItem,
  Content,
  Input,
  Card,
  CardItem
} from 'native-base'

import Icon from 'react-native-vector-icons/FontAwesome'

var moment = require('moment')

moment.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: function(number, withoutSuffix, key, isFuture) {
      if (number < 10) {
        return number + ' minutes'
      }
      return '00:' + number + ' minutes'
    },
    m: 'a minute',
    mm: function(number, withoutSuffix, key, isFuture) {
      return (number < 10 ? '0' : '') + number + ':00' + ' minutes'
    },
    h: 'an hour',
    hh: '%d hours',
    d: 'a day',
    dd: '%d days',
    M: 'a month',
    MM: '%d months',
    y: 'a year',
    yy: '%d years'
  }
})

const TAB_OFFERS = 0
const TAB_RECEIPTS = 1

export default class Thanks extends Scene {

  constructor(props) {
    super(props)
    this.state = {
      first_load: true,
      activeTab: TAB_RECEIPTS,
      thanksBalanceAmount: '0',
      receipts: []
    }
  }

  componentWillFocus() {
    if (this.state.first_load) {
      return this.setState({first_load: false})
    }
    super.componentWillFocus()
    this.refreshThanksMessages()
    this.refreshThanksBalance()
  }

  componentDidMount() {
    this.refreshThanksBalance()
    this.refreshThanksMessages()
  }

  setTab(tab) {
    this.setState({activeTab: tab})
  }

  hardwareBack() {
    this.props.navigator.pop()
    return true
  }
  
  refreshThanksBalance() {
    ConsentUser.refreshThanksBalance().then(balance => {
      this.setState({thanksBalanceAmount: balance}) 
    }).catch(err => {
      console.log('refreshthanksbalance', err)
      this.setState({thanksBalanceAmount: '0'})
    })
  }

  refreshThanksMessages() {
    ConsentThanksMessage.all().then(msgs => {
      this.setState({receipts: msgs})
    }).catch(console.log)
  }
  
  renderReceipt(receipt, i) {
    return (
      <Card key={i} style={style.card}>
        <CardItem>
          <View>
            <Text>
              {([
                'You were awarded',
                receipt.amount,
                'Thanks by',
                receipt.from
              ].concat(
                receipt.reason ?
                ['for', receipt.reason].join(' ') :
                ''
              )).join(' ')}
            </Text>
          </View>
        </CardItem>
        <CardItem>
          <View style={style.cardFooter}>
            <View style={style.cardFooterLeftView}>
              <Text style={style.cardFooterLeftText}>
                {moment(receipt.created_at).fromNow()}
              </Text>
            </View>
          </View>
        </CardItem>
      </Card>
    )
  }

  renderReceipts() {
    var now = new Date
    var y = now.getFullYear(), r_y
    var m = now.getMonth(), r_m
    var d = now.getDate(), r_d
    var today = []
    var any_other_day = []
    this.state.receipts.forEach((receipt, idx, arr) => {
      this.state.receipts[idx].created_at = new Date(receipt.created_at)
      r_y = receipt.created_at.getFullYear()
      r_m = receipt.created_at.getMonth()
      r_d = receipt.created_at.getDate()
      if (r_y === y && r_m === m && r_d === d) {
        today.push(receipt)
      } else {
        any_other_day.push(receipt)
      }
    })
    return (
      <View style={style.flexOne}>
        {
          any_other_day.sort(function(a, b) {
            return a.created_at.getTime() > b.created_at.getTime() ? 1 : -1
          }).concat(
            today.sort(function(a, b) {
              return a.created_at.getTime() > b.created_at.getTime() ? 1 : -1
            })
          ).map(this.renderReceipt)
        }
      </View>
    )
  }

  renderOffersTab() {
    // NOTE offers is not yet implemented
    return (

      <LifekeyCard headingText={"ACME INC."} leftButtonText={"SHARE"} rightButtonText={"REDEEM"} onPressDelete={() => console.log("hello")} onPressEdit={() => console.log("hello")}>
        <View style={ style.offerCard }>
          <Text style={ style.offerHeading }>Give a friend a 100 thanks</Text>
          <Text style={ style.offerDescription }>Get a friend started and you'll get 100 thanks too.</Text>
        </View>
      </LifekeyCard>

    )
  }

  render() {
    
    var icons = [
      {
        // back button
        icon: (<BackIcon width={Design.headerIconWidth} height={Design.headerIconHeight} color={Design.headerIconColour} />),
        onPress: this.hardwareBack.bind(this),
        borderColor: "white"
      },
      {
        // smiling face in conversation bubble
        icon: (<ThanksIcon width={Design.headerIconWidth} height={Design.headerIconHeight} color={Design.headerIconColour} />),
        borderColor: "white"
      },
      {
        // thanks balance number
        icon: (<Text style={{fontSize: Design.headerIconHeight, color: Design.headerIconColour}}>{this.state.thanksBalanceAmount}</Text>),
        onPress: this.refreshThanksBalance.bind(this),
        borderColor: "white"
      }
    ], tabs = [
      {
        text: 'Offers',
        onPress: _ => this.setTab(TAB_OFFERS),
        active: this.state.activeTab === TAB_OFFERS
      },
      {
        text: 'Receipts',
        onPress: () => this.setTab(TAB_RECEIPTS),
        active: this.state.activeTab === TAB_RECEIPTS
      }
    ]

    return (
      <Container>
        <AndroidBackButton onPress={this.hardwareBack.bind(this)} />
        <LifekeyHeader icons={icons} tabs={tabs} />
        <Content style={{backgroundColor: Palette.consentGrayLight}}>
          <Col style={style.flexOne}>
            <View style={style.tab}>{
              this.state.activeTab === TAB_OFFERS && (
                this.renderOffersTab()
              ) || this.renderReceipts()
            }</View>
          </Col>
        </Content>
      </Container>
    )
  }
}

const style = {
  flexOne: {
    flex: 1
  },
  tab: {
    flex: 10,
    backgroundColor: Palette.consentGrayLightest
  },
  listItem: {
    flex: 1,
    paddingLeft: 20
  },
  listItemLabel: {
    backgroundColor: Palette.consentGrayDark
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    margin: 5,
    borderWidth: 2,
    borderColor: Palette.consentGrayMedium,
    borderRadius: 10,
  },
  searchBoxInput: {
    flex: 1,
    backgroundColor: 'white',
    fontSize: 17,
    padding: 2
  },
  searchBoxSearchIcon: {
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 5,
    paddingTop: 10,
    paddingLeft: 10,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0
  },
  searchBoxCloseIcon: {
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 5,
    paddingTop: 8,
    paddingRight: 10,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0
  },
  footer: {
    height: Dimensions.get('window').height / 6
  },
  card: {
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15
  },
  cardFooter: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cardFooterLeftView: {
    flex: 1
  },
  cardFooterLeftText: {
    color: Palette.consentGrayDark,
    // fontWeight: 'bold',
    fontSize: 12,
    paddingLeft: 10
  },
  offerCard:{
    justifyContent: "center",
    alignItems: "center"
  },
  offerBrand:{
    flex: 1
  },
  offerHeading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center"
  },
  offerDescription: {
    textAlign: "center",
    width: "50%"
  }
}