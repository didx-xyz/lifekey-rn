
// external dependencies
import React from "react"
import { Text, View, Image, ScrollView, TouchableHighlight, InteractionManager, ToastAndroid} from "react-native"
import { Container, Content, Col } from "native-base"
import PropTypes from "prop-types"
import ActivityIndicator from "ActivityIndicator"
import ModalDropdown from 'react-native-modal-dropdown';

// internal dependencies
import Common from "../Common"
import Api from "../Api"
import ConsentUser from "../Models/ConsentUser"
import Scene from "../Scene"
import Routes from "../Routes"
import Palette from "../Palette"
import LifekeyHeader from "../Components/LifekeyHeader"
import LcAddCategoryButton from "../Components/lc-AddCategoryButton"
import Touchable from "../Components/Touchable"
import BackButton from "../Components/BackButton"
import BackIcon from "../Components/BackIcon"
import HelpIcon from "../Components/HelpIcon"
import GearIcon from "../Components/GearIcon"
import PanTab from "../Components/PanTab"
import ProgressIndicator from "../Components/ProgressIndicator"
import Design from "../DesignParameters"
import Logger from "../Logger"
import Anonymous from "../Images/anonymous_person"

import Connect from "../Components/SceneComponents/Connect"
import ConnectionData from "../Components/SceneComponents/ConnectionData"
import MyData from "../Components/SceneComponents/MyData"
import CircularImage from "../Components/CircularImage"

const CONNECT = 0
const CONNECTION_DATA = 1
const MY_DATA = 2

const helpScreens = [ 
  { "image": require("../Images/onboarding_test.png"), "heading": "Identify", "copy": "Qi Identity is my digital passport" }, 
  { "image": require("../Images/qr.png"), "heading": "Connect", "copy": "Qi Code connects me in a snap & replaces paperwork" }, 
  { "image": require("../Images/phone.png"), "heading": "Access", "copy": "Qi Access magically logs me in without usernames & passwords" }, 
  { "image": require("../Images/share.png"), "heading": "Secure", "copy": "Qi Safe secures my personal information under my control" }, 
  { "image": require("../Images/rewards.png"), "heading": "Rewards", "copy": "Qi Rewards give me Thanks Points and personalised offers" }
]

class ConnectionDetailsPeerToPeer extends Scene {
  
  constructor(...params) {
    super(...params)

    this.state = {
      "activeTab": CONNECTION_DATA,
      "connectionProfile": null,
      "shallowConnectionData": [],
      "connectionData": [],
      "myData": [],
      "progressCopy": "Loading connection data...",
      "asyncActionInProgress": true
    }

    this.onBoundFetchFullResource = this.fetchFullResource.bind(this)

  }

  componentDidMount() {
    super.componentDidMount()
    this.interaction = InteractionManager.runAfterInteractions(() => {   
      this.fetchOurData()
    })
  }

  componentWillFocus() {
    super.componentWillFocus()

    // NB* - THIS WAS VERY RECENTLY REMMOVED AND SEEMED TO SOLVE THE WARNING OF SETTING STATE ON UNMOUNTED COMPONENT
    // BEWARE ::: 
    // this.interaction = InteractionManager.runAfterInteractions(() => {   
    //   this.fetchMyData()
    // })
  }

  componentWillUnmount() {
    if(this.interaction) this.interaction.cancel()
  }

  fetchFullResource(resourceId){

    console.log("resourceId FETCH: ", resourceId)

    Api.getResource({ id: resourceId }).then(result => {

      // TODO - ASYNC STORAGE
      
      const newArray = [ ...this.state.fullResources, result ]

      this.setState(
        { 
          fullResources: newArray, 
          connectionData: this.state.connectionData.filter(datum => datum.id !== resourceId) 
        })
    })
    .catch(error => {
      console.log("Error loading resource: ", error)
    })
  }

  fetchOurData() {
    
    return Promise.all([
      Api.profile({ did: this.props.route.connection_did }),
      Api.connectionResources(this.props.route.connection_did),
      Api.getMyData()
    ]).then(values => {

      const connectionProfile = values[0].body.user

      console.log("PROFILE: ", connectionProfile)

      const shallowConnectionData = values[1].body  
      const myData = values[2]

      /* Currently this function calls everything from cache - but could be adapted to work with async storage */
      ConsentUser.sortConnectionData()

      const allConnections = ConsentUser.getCached("myConnections")
      const connection = allConnections.peerConnections.find(c => c.did === this.props.route.connection_did)   
      
      this.setState({
        "connectionProfile": connectionProfile,
        "shallowConnectionData": shallowConnectionData,
        "connectionData": connection.resourcesByType,
        "myData": myData.resourcesByType, 
        "asyncActionInProgress": false
      })

    }).catch(error => {
      Logger.error(error)
    })
  }

  render() {
    
    const identityPhotographUri = (this.state.connectionProfile && this.state.connectionProfile.image_uri) ? Common.ensureDataUrlHasContext(this.state.connectionProfile.image_uri) : Anonymous.uri
    const profilepic = this.state.connectionProfile ? <CircularImage uri={ identityPhotographUri } radius={25} borderColor="white" /> : <ActivityIndicator color={Palette.consentGrayDark} style={style.progressIndicator}/>

    const icons = [
      {
        icon: <BackIcon width={16} height={16}/>,
        onPress: () => this.navigator.pop(),
        borderColor: "white"
      },
      {
        icon: profilepic,
        borderColor: "white"
      },
      {
        icon: (<View width={38} height={38}></View>),
        onPress: () => { },
        borderColor: "white"
      }
    ], tabs = [
      {
        text: "Connect",
        onPress: () => this.setState({ activeTab: CONNECT }),
        active: this.state.activeTab === CONNECT
      },
      {
        text: "Their Data",
        onPress: () => this.setState({ activeTab: CONNECTION_DATA }),
        active: this.state.activeTab === CONNECTION_DATA
      },
      {
        text: "My Data",
        onPress: () => this.setState({ activeTab: MY_DATA }),
        active: this.state.activeTab === MY_DATA
      }
    ]

    return (
      <Container>
        <View style={style.headerWrapper}>
          
          <BackButton navigator={this.navigator} />
          <LifekeyHeader icons={icons} tabs={tabs} /> 
        </View>
        <ScrollView style={style.contentContainer}>
          {
            !this.state.asyncActionInProgress ? 
              this.renderTab()
            :
              <ProgressIndicator progressCopy={ this.state.progressCopy }></ProgressIndicator>
          }
        </ScrollView>

      </Container>
    )

    
  }

  renderTab() {
    
    switch (this.state.activeTab) {
    case CONNECT:
      return <Connect profile={this.state.connectionProfile} connectWithMe={false}></Connect>
    case CONNECTION_DATA:
      // return <ConnectionData shallowConnectionData={this.state.shallowConnectionData} connectionData={this.state.connectionData} myData={this.state.myData} onFetchFullResource={this.onBoundFetchFullResource}></ConnectionData>
      return <MyData sortedResourceTypes={this.state.connectionData} light={true} ></MyData>
    case MY_DATA:
      return <MyData sortedResourceTypes={this.state.myData} light={true}></MyData>
      // return <ConnectionData shallowConnectionData={[]} connectionData={this.state.myData}></ConnectionData>
    }
  }

}

const style = {
  "contextMenu":{
    "width": 150,
    "height": 150,
    "paddingLeft": 5
  },
  "contextMenuOptions":{
    "flex": 1,
    "flexDirection": "row",
    "height": 50,
    "justifyContent": "flex-start",
    "alignItems": "center",
  },
  "headerWrapper": {
    "borderColor": Palette.consentGrayDark,
    "height": Design.lifekeyHeaderHeight
  },
  "contentContainer":{
    "flex": 1,
    "backgroundColor": Palette.consentGrayLightest,
  },
  "connectTab": {
    "flex": 1,
    "backgroundColor": Palette.consentGrayLightest,
    "alignItems": "center",
    "justifyContent": "center",
    "paddingRight": Design.paddingRight,
    "paddingLeft": Design.paddingLeft,
  },
  "switchButtonContainer":{
    "flex": 2,
    "flexDirection": "row",
    "width": "75%",
    "alignItems": "center",
    "justifyContent": "center"
  },
  "switchButton":{
    "height": 30,
    "width": "40%",
    "flexDirection": "row",
    "alignItems": "center",
    "justifyContent": "center",
    "borderColor": Palette.consentBlue,
    "borderWidth": 1,
    "paddingLeft": 15,
    "paddingRight": 15,
  },
  "switchButtonLeft":{
    "borderTopLeftRadius": 20,
    "borderBottomLeftRadius": 20
  },
  "switchButtonRight":{
    "borderTopRightRadius": 20,
    "borderBottomRightRadius": 20
  },
  "switchButtonText":{
    "fontSize": 10
  },
  "informationContainer":{
    "flex": 6,
    "alignItems": "center",
    "justifyContent": "center"
  },
  "qrCodeContainer": {
    "flex": 4,
    "alignItems": "center",
    "justifyContent": "center"
  },
  "textContainer": {
    "flex": 2,
    "width": "100%",
    "flexDirection": "row",
    "alignItems": "center",
    "justifyContent": "center"
  },
  "text":{
    "color": Palette.consentGrayDark,
    "textAlign": "center",
  },
  "footer": {
    "flex": 1,
    "width": "100%",
    "flexDirection": "row",
    "alignItems": "center",
    "justifyContent": "space-between"
  },
  "footerText": {
    "fontSize": 16,
    "color": Palette.consentGrayDark,
  }
}

// these are from Lifekeyrn
ConnectionDetailsPeerToPeer.contextTypes = {
  // behavior
  onEditResource: PropTypes.func,
  onSaveResource: PropTypes.func,

  // state
  getShouldClearResourceCache: PropTypes.func
}

export default ConnectionDetailsPeerToPeer
