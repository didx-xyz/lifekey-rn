// external dependencies
import React from "react"
import {
  Text,
  View,
  Dimensions,
  StatusBar,
  Image
} from "react-native"
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
import Toast from '../Utils/Toast'
import { Container } from "native-base";
import LinearGradient from 'react-native-linear-gradient';

const { height, width } = Dimensions.get('window');

class Connection extends Scene {

  constructor(...params) {
    super(...params)

    this.state = {
      isVerified: true,
      connecting: false,
      actions: [],
      agentColor: Palette.consentWhite,
      agentColorSecondary: Palette.consentGrayDarkest,
      agentImage: '',

    }
    this.onBoundPressConnect = this.onPressConnect.bind(this)
    this.onBoundPressHelp = this.onPressHelp.bind(this)
    this.onBoundPressDecline = this.onPressDecline.bind(this)

  }

  componentWillMount() {
    super.componentWillMount()
    this.loadActions(this.props.route.actions_url)
    this.getConnectionProfile();
  }

  async getConnectionProfile() {
    try {
      const { body: { user: { colour = Palette.consentWhite, image_uri = '' } }} = await Api.profile({ did: this.props.route.did })
      const agentColors = colour.split(',');

      this.setState({ agentColor: agentColors[0], agentColorSecondary: (agentColors[1]) ? agentColors[1] : Palette.consentOffBlack, agentImage: image_uri.replace('\{type\}', 'logo') })
    } catch (error) {
      Logger.warn(error);
    }
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
      let text = await actionsResponse.text()
      const actions = JSON.parse(text)
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

    Toast.show(`Connecting to ${this.props.route.display_name}`)
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
        Toast.show(`Could not connect...`)
        // console.log("--------------------------------- ERROR: ", error)
        Logger.warn(JSON.stringify(error))
        this.setState({
          connecting: false
        })
      })
    })
  }

  onPressHelp() {
  }

  onPressDecline() {
    this.navigator.pop()
  }

  render() {
    const screenWidth = Dimensions.get('window').width
    const iconSize = screenWidth / 25

    return (
      <Container style={{ backgroundColor: this.state.agentColor }}>
        <LinearGradient colors={[this.state.agentColor, this.state.agentColorSecondary]} style={{ flex: 1 }}>
        <BackButton navigator={this.navigator} />
        <View style={{ flex: 1 }}>
          <View style={styles.logo}>
            {/* <CircularImage uri={ this.state.agentImage } radius={32} borderColor={ this.state.agentColor } /> */}
            <Image source={{ uri: this.state.agentImage }} style={{ width: '60%', height: '85%' }} />
            {/* <Image style={{ width: 64, height: 64, borderRadius: 45 }} source={{ uri: this.props.route.image_uri }}/>  */}
          </View>
          {
            this.state.isVerified &&
            <View style={styles.verified}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20, paddingVertical: 2, paddingHorizontal: 5, backgroundColor: this.state.agentColorSecondary, borderTopRightRadius: 5, borderTopLeftRadius: 5 }}>
                  <VerifiedIcon width={iconSize} height={iconSize} stroke={Palette.consentWhite} />
                  <Text style={ styles.verifiedText }>Verified</Text>
                </View>
                <View>
                  <Text style={styles.connectedText}>Connected to 3,421 people</Text>
                </View>
            </View>
          }
          <View style={{ backgroundColor: Palette.consentWhite, flex: 1, flexDirection: 'column', marginHorizontal: 20, borderRadius: 10, marginBottom: 30, justifyContent: 'flex-start' }}>
            <Text style={[styles.greetingTextHeading, { color: this.state.agentColor }]}>Hi {Util.ucfirst(ConsentUser.getDisplayNameSync())}.</Text>
            <Text style={ styles.greetingText }>Connecting with {Util.ucfirst(this.props.route.display_name)} will allow you to:</Text>
            <View style={{ flexDirection: 'column', justifyContent: 'flex-start' }}>
              { this.state.actions.map((action, i) =>
                <View key={i} style={{ marginLeft: '25%', paddingVertical: 13, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', flex: 1 }}>
                  <Text style={{ color: this.state.agentColorSecondary, fontSize: 30 }}>• </Text><Text style={styles.actionsText}>{action.name}</Text>
                </View>
              )}
            </View>
          </View>
          {/* <Text style={styles.nameText}>{Util.ucfirst(this.props.route.display_name)}</Text> */}
          
          <View style={[styles.connectButtonContainer,  { justifyContent: 'center', alignItems: 'center', alignSelf: 'center', position: 'absolute', top: height - 205 }]}>
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
          

          { /* <View style={styles.connected}>
            <Text style={styles.connectedText}>Connected to 3,421 people.</Text>
          </View> */ }

        </View>

        <LifekeyFooter
          style={ styles.footer}
          color={ Palette.consentWhite }
          backgroundColor={'transparent'}
          leftButtonText=""
          rightButtonText="Not now"
          leftButtonIcon={<HelpIcon width={Design.footerIconWidth} height={Design.footerIconHeight} stroke={Palette.consentWhite} />}
          onPressLeftButton={this.onBoundPressHelp}
          onPressRightButton={this.onBoundPressDecline}
        />
        </LinearGradient>
      </Container>
    )
  }
}

const styles = {
  content: {
    "height": Dimensions.get('window').height - StatusBar.currentHeight,
    "backgroundColor": Palette.consentWhite,
    "paddingTop": Design.paddingTop*2
  },
  logo: {
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 25,
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
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  verifiedText: {
    fontSize: 14,
    "color": Palette.consentWhite,
    "padding": 5
  },
  // "connected": {
  //   "height": "3%",
  //   "justifyContent": "center",
  //   "alignItems": "center",
  //   "marginTop": "2%"
  // },
  "connectedText": {
    "color": Palette.consentWhite
  },
  // "greeting": {
  //   "height": "17%",
  //   "justifyContent": "flex-end",
  //   "flexDirection": "column",
  //   "paddingLeft": "17%",
  //   "paddingRight": "17%",
  //   "paddingBottom": "5%"
  // },
  greetingTextHeading: {
    textAlign: "center",
    width: "75%",
    fontSize: 24,
    paddingTop: 64,
    paddingBottom: 10,
    marginLeft: "12.5%",
    marginRight: "12.5%"
  },
  "greetingText": {
    "color": Palette.consentGrayMedium,
    "textAlign": "center",
    "width": "75%",
    "fontSize": 18,
    "paddingBottom": 10,
    "marginLeft": "12.5%",
    "marginRight": "12.5%"
  },
  // "actions": {
  //   "height": "17%",
  //   "alignItems": "center",
    
  // },
  "actionsText": {
    "fontSize": 18,
    // "textAlign": "left",
    // "width": "50%",
    // "marginLeft": "25%",
    // "marginRight": "25%",
    // "alignItems": "center",
    "color": Palette.consentGrayDarkest,
    
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
