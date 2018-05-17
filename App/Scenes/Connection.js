// external dependencies
import React from "react"
import {
  Text,
  View,
  Dimensions,
  StatusBar,
  ToastAndroid,
  Image,
  Platform
} from "react-native"
import { Container } from "native-base"
import * as Nachos from 'nachos-ui'
// internal dependencies
import BackButton from "../Components/BackButton"
import HelpIcon from "../Components/HelpIcon"
import HexagonIcon from "../Components/HexagonIcon"
import CircularImage from "../Components/CircularImage"
import LifekeyFooter from '../Components/LifekeyFooter'
import Scene from "../Scene"
import Design from "../DesignParameters"
import Palette from "../Palette"
import Routes from "../Routes"
import Util from "../Util"
import Touchable from "../Components/Touchable"
import VerifiedIcon from "../Components/VerifiedIcon"
import ConsentUser from '../Models/ConsentUser'
import Api from '../Api'
import Logger from '../Logger'
import Session from '../Session'

class Connection extends Scene {

  constructor(...params) {
    super(...params)

    this.state = {
      isVerified: true,
      connecting: false,
      actions: []
    }
    this.onBoundPressConnect = this.onPressConnect.bind(this)
    this.onBoundPressHelp = this.onPressHelp.bind(this)
    this.onBoundPressDecline = this.onPressDecline.bind(this)

  }

  componentWillMount() {
    super.componentWillMount()
    this.loadActions(this.props.route.actions_url)
  }

  async loadActions(actions_url) {
    if (actions_url) {
      Logger.info('Fetching actions')
      const requestOptions = {
        "method": "GET",
        "headers": {
          "x-cnsnt-did": Session.getState().user.did
        }
      }
      Logger.networkRequest('GET', actions_url, requestOptions)
      const actionsResponse = await fetch(actions_url, requestOptions)
      Logger.networkResponse(actionsResponse.status, new Date(), JSON.stringify(actionsResponse))
      const actions = JSON.parse(actionsResponse._bodyText)
      if (actions) {
        if (actions.body) {
          this.setState({
            actions: actions.body
          }, () => Logger.info('Actions updated'))
        } else {
          this.setState({
            actions: actions
          }, () => Logger.info('Actions updated'))
        }
      } else {
        Logger.warn('Could not parse JSON')
      }
    }
  }

  onPressConnect() {

    if (Platform.OS === 'android') {
      ToastAndroid.show(`Connecting to ${this.props.route.display_name}`, ToastAndroid.SHORT)
    }
    this.setState({
      connecting: true
    }, () => {
      Api.requestConnection({ target: this.props.route.did })
      .then(() => {
        this.navigator.push({
          ...Routes.connectionDetails,
          user_did: this.props.route.did,
          display_name: this.props.route.display_name,
          image_uri: this.props.route.image_uri
        })
      })
      .catch(error => {
        if (Platform.OS === 'android') { 
          ToastAndroid.show(`Could not connect...`, ToastAndroid.SHORT)
        }
        // console.log("--------------------------------- ERROR: ", error)
        Logger.warn(JSON.stringify(error))
        this.setState({
          connecting: false
        })
      })
    })
  }

  onPressHelp() {
    alert("help")
  }

  onPressDecline() {
    this.navigator.pop()
  }

  render() {
    const screenWidth = Dimensions.get('window').width
    const iconSize = screenWidth / 25

    return (
      <View style={styles.content}>
        <BackButton navigator={this.navigator} />
        <View style={ {flex: 1} }>
          <View style={styles.logo}>
            <CircularImage uri={ this.props.route.image_uri } radius={32} borderColor={ Palette.consentWhite } />
            {/* <Image style={{ width: 64, height: 64, borderRadius: 45 }} source={{ uri: this.props.route.image_uri }}/>  */}
          </View>
          <Text style={styles.nameText}>{Util.ucfirst(this.props.route.display_name)}</Text>
          

          {
            this.state.isVerified &&
            <View style={styles.verified}>
                <VerifiedIcon width={iconSize} height={iconSize} />
                <Text style={ styles.verifiedText }>Verified</Text>
            </View>
          }

          { /* <View style={styles.connected}>
            <Text style={styles.connectedText}>Connected to 3,421 people.</Text>
          </View> */ }
          <Text style={ styles.greetingText }>Hi there {Util.ucfirst(ConsentUser.getDisplayNameSync())}. Connecting with {Util.ucfirst(this.props.route.display_name)} will allow you to:</Text>

          { this.state.actions.map((action, i) =>
            <Text key={i} style={styles.actionsText}>• {action.name}.</Text>
          )}
          
          <View style={styles.connectButtonContainer}>
            { this.state.connecting ?
              <Nachos.Spinner color={Palette.consentBlue}/>
            :
              <Touchable onPress={this.onBoundPressConnect}>
                <View>
                  <HexagonIcon width={100} height={100} textSize={18} textX={22} textY={43} text="Connect" />
                </View>
              </Touchable>
            }
          </View>
        

        </View>

        <LifekeyFooter
          style={ styles.footer}
          color={ Palette.consentOffBlack }
          backgroundColor={ Palette.consentWhite }
          leftButtonText=""
          rightButtonText="Not now"
          leftButtonIcon={<HelpIcon width={Design.footerIconWidth} height={Design.footerIconHeight} stroke={Palette.consentOffBlack} />}
          onPressLeftButton={this.onBoundPressHelp}
          onPressRightButton={this.onBoundPressDecline}
        />
      </View>
    )
  }
}

const styles = {
  "content": {
    "height": Dimensions.get('window').height - StatusBar.currentHeight,
    "backgroundColor": Palette.consentWhite,
    "paddingTop": Design.paddingTop*2
  },
  "logo": {
    "height": 64,
    "justifyContent": "center",
    "alignItems": "center"
  },
  // "name": {
  //   // "height": "5%",
  //   flexDirection: "column",
  //   "justifyContent": "center",
  //   "alignItems": "center"
  // },
  "nameText": {
    "color": Palette.consentOffBlack,
    "fontSize": 20,
    "margin": 5,
    "textAlign": "center"
  },
  "verified": {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  "verifiedText": {
    fontSize: 14,
    "color": Palette.consentOffBlack,
    "marginLeft": 3
  },
  // "connected": {
  //   "height": "3%",
  //   "justifyContent": "center",
  //   "alignItems": "center",
  //   "marginTop": "2%"
  // },
  // "connectedText": {
  //   "color": Palette.consentGrayDarkest
  // },
  // "greeting": {
  //   "height": "17%",
  //   "justifyContent": "flex-end",
  //   "flexDirection": "column",
  //   "paddingLeft": "17%",
  //   "paddingRight": "17%",
  //   "paddingBottom": "5%"
  // },
  "greetingText": {
    "color": Palette.consentGrayDark,
    "textAlign": "center",
    "width": "75%",
    "fontSize": 18,
    "paddingTop": 64,
    "paddingBottom": 32,
    "marginLeft": "12.5%",
    "marginRight": "12.5%"
  },
  // "actions": {
  //   "height": "17%",
  //   "alignItems": "center",
    
  // },
  "actionsText": {
    "fontSize": 14,
    "textAlign": "left",
    "width": "50%",
    "marginLeft": "25%",
    "marginRight": "25%",
    "marginTop": 5,
    "color": Palette.consentOffBlack,
  },
  "connectButtonContainer": {
    "flex": 1,    
    "justifyContent": "center",
    "alignItems": "center"
  },
  "footer": {
    "height": "17%",
    "flexDirection": "row",
    "alignItems": "center",
    "paddingLeft": "12%",
    "paddingRight": "12%"
  },
  "help": {
    "flex": 1,
    "justifyContent": "flex-start"
  },
  "decline": {
    "flex": 1,
    "justifyContent": "flex-end"
  },
  "declineText": {
    "color": "#666",
    "textAlign": "right"
  }
}

export default Connection
