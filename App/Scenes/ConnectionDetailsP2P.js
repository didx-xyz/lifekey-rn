
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

import MyData from "../Components/SceneComponents/MyData"
import Connect from "../Components/SceneComponents/Connect"
import ConnectionData from "../Components/SceneComponents/ConnectionData"
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
      Api.connectionResources(this.props.route.connection_did),
      Api.getMyData()
    ]).then(values => {

      const shallowConnectionData = values[0].body  
      const myData = values[1]

      console.log("MY DATA: ", myData)

      /* Currently this function calls everything from cache - but could be adapted to work with async storage */
      ConsentUser.sortConnectionData()

      const allConnections = ConsentUser.getCached("myConnections")
      const connection = allConnections.peerConnections.find(c => c.did === this.props.route.connection_did)   
      
      this.setState({
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
    
    // const profilepic = this.state.connectionData ? <CircularImage uri={this.state.profile.profileImageUri} radius={25} borderColor="white" /> : <ActivityIndicator color={Palette.consentGrayDark} style={style.progressIndicator}/>
    // const icons = [
    //   {
    //     icon: <BackIcon width={16} height={16}/>,
    //     onPress: () => this.navigator.pop(),
    //     borderColor: "white"
    //   },
    //   {
    //     icon: profilepic,
    //     borderColor: "white"
    //   },
    //   {
    //     icon: (<GearIcon width={38} height={38} stroke={Palette.consentGrayDark} />),
    //     onPress: () => { this.onBoundShowContextMenu() },
    //     borderColor: "white"
    //   }
    // ], tabs = [
    //   {
    //     text: "Connect",
    //     onPress: () => this.setState({ activeTab: CONNECT }, this.scrollViewToTop.bind(this)),
    //     active: this.state.activeTab === CONNECT
    //   },
    //   {
    //     text: "My Data",
    //     onPress: () => this.setState({ activeTab: MY_DATA }, this.scrollViewToTop.bind(this)),
    //     active: this.state.activeTab === MY_DATA
    //   },
    //   {
    //     text: "Badges",
    //     onPress: () => this.setState({ activeTab: BADGES }, this.scrollViewToTop.bind(this)),
    //     active: this.state.activeTab === BADGES
    //   }
    // ]

    return (
      <Container>
        <View style={style.headerWrapper}>
          
          <BackButton navigator={this.navigator} />
          { /* <LifekeyHeader icons={icons} tabs={tabs} /> */ }
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
      return <Connect profile={this.state.profile} onPressProfile={this.onBoundPressProfile} onPressHelp={ this.onBoundPressHelp }></Connect>
    case CONNECTION_DATA:
      return <ConnectionData shallowConnectionData={this.state.shallowConnectionData} connectionData={this.state.connectionData} myData={this.state.myData} onFetchFullResource={this.onBoundFetchFullResource}></ConnectionData>
    case MY_DATA:
      return <MyData sortedResourceTypes={this.state.sortedResourceTypes} onPressDelete={ this.onBoundPressDelete } onPressEdit={ this.onBoundPressEdit } onPressProfile={this.onBoundPressProfile}></MyData>
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
