// external dependencies
import React from "react"
import { Text, View, Image, ScrollView, TouchableHighlight, InteractionManager } from "react-native"
import { Container, Content, Col } from "native-base"
import PropTypes from "prop-types"
import ActivityIndicator from "ActivityIndicator"
import ModalDropdown from 'react-native-modal-dropdown';

// internal dependencies
import Common from "../Common"
import Api from "../Api"
import Scene from "../Scene"
import Routes from "../Routes"
import Palette from "../Palette"
import LifekeyHeader from "../Components/LifekeyHeader"
import LifekeyCard from "../Components/LifekeyCard"
import LcAddCategoryButton from "../Components/lc-AddCategoryButton"
import Touchable from "../Components/Touchable"
import BackButton from "../Components/BackButton"
import BackIcon from "../Components/BackIcon"
import HelpIcon from "../Components/HelpIcon"
import GearIcon from "../Components/GearIcon"
import Design from "../DesignParameters"
import Anonymous from "../Images/anonymous_person"
import Logger from "../Logger"

import MyData from "../Components/SceneComponents/MyData"
import Connect from "../Components/SceneComponents/Connect"
import Badges from "../Components/SceneComponents/Badges"
import CircularImage from "../Components/CircularImage"

const CONNECT = 0
const MY_DATA = 1
const BADGES = 2

const helpScreens = [ 
  { "image": require("../Images/onboarding_test.png"), "heading": "Identify", "copy": "Qi Identity is my digital passport" }, 
  { "image": require("../Images/qr.png"), "heading": "Connect", "copy": "Qi Code connects me in a snap & replaces paperwork" }, 
  { "image": require("../Images/phone.png"), "heading": "Access", "copy": "Qi Access magically logs me in without usernames & passwords" }, 
  { "image": require("../Images/share.png"), "heading": "Secure", "copy": "Qi Safe secures my personal information under my control" }, 
  { "image": require("../Images/rewards.png"), "heading": "Rewards", "copy": "Qi Rewards give me Thanks Points and personalised offers" }
]

class Me extends Scene {
  constructor(...params) {
    super(...params)

    this.state = {
      "activeTab": MY_DATA,
      "tabName": "My Data",
      "resources": [],
      "resourceTypes": [],
      "sortedResourceTypes": [],
      "sortedBadges": [],
      "informationSource": "MY CODE",
      "progressCopy": "Loading...",
      "asyncActionInProgress": true,
      "scrollview": null
    }

    this.onBoundResourceTypes = this.onResourceTypes.bind(this)
    this.onBoundResources = this.onResources.bind(this)
    this.onBoundPressHelp = this.onPressHelp.bind(this)

    this.onBoundShowContextMenu = this.onShowContextMenu.bind(this)
  }

  onPressDelete(id) {
    Api.deleteResource({ id })
    .catch(error => Logger.error(error))
    // refresh the list
    this.context.onSaveResource()
  }

  onPressEdit(form, id = null) {
    this.context.onEditResource(form, id)
  }

  onPressHelp(destination, helpScreens, navigationType) {
    this.navigator.push({...Routes.helpGeneral, "destination": destination, "screens": helpScreens, "navigationType": navigationType })
  }

  componentDidMount() {
    super.componentDidMount()

    Promise.all([
      Api.allResourceTypes(),
      Api.allResources()
    ]).then(values => {
      this.onBoundResourceTypes(values[0], () => {
        this.onBoundResources(values[1])
      })
    }).catch(error => {
      Logger.error(error)
    })
  }

  componentWillFocus() {
    super.componentWillFocus()

    this.setState({"asyncActionInProgress" : true, "progressCopy" : "Loading new resources..."}, () => {
      Promise.all([
      Api.allResources()
      ]).then(values => {
        this.onBoundResources(values[0])
      }).catch(error => {
        Logger.error(error)
      })
    }) 
  }

  // componentDidUpdate(){
  //   // This is intended to ensure that the scrollview is always at Y : 0 when tabs are changed. 
  //   // It needs a bit of TLC however...
  //   this.scrollViewToTop()
  // }

  scrollViewToTop() {
    if(this.state.scrollview){
      // This has to run after animations complete... https://stackoverflow.com/questions/33208477/react-native-android-scrollview-scrollto-not-working
      setTimeout(() => {
        this.state.scrollview.scrollTo({x: 0, y: 0})
      }, 0)
    }
    else{
      console.log("Skipped the scroll")
    }
  }

  onResourceTypes(data, then) {
    if (!data.resources) {
      console.warn("resource list format changed")
    }

    this.setState({
      resourceTypes: data.resources
    }, then)
  }

  onResources(data) {

    const updatedResources = data.body.map(resource => {
      return {
        id: resource.id,
        alias: resource.alias,
        schema: resource.schema, 
        is_verifiable_claim: resource.is_verifiable_claim,
        ...JSON.parse(resource.value)
      }
    })

    if (this.state.resourceTypes && this.state.resourceTypes.length) {
      this.sortChildData(updatedResources, this.state.resourceTypes)
    }

    this.setState({
      resources: updatedResources
    })
  }

  sortChildData(resources, resourceTypes){
    this.verifyAndFixSchemaProperty(resources)
    this.sortBadges(resources)
    this.sortMyData(resources, this.state.resourceTypes)
  }

  verifyAndFixSchemaProperty(resources){
    resources.forEach(resource => {  
      resource.schema = Common.ensureUrlHasProtocol(resource.schema)
      if(!resource.form){
        resource.form = `${resource.schema}_form`
      }
    })
  }

  sortBadges(resources){

    var badges = Object.values(resources).map((v, i) => {

      if(!v.claim || !v.claim.isCredential){
        return null
      }

      if (v.form === "http://schema.cnsnt.io/pirate_name_form") {
        return {
          "name": "Pirate Name",
          "description": "Hello ",
          "image": require('../../App/Images/pirate_name.png')
        }
      } else if (v.form === "http://schema.cnsnt.io/verified_identity_form") {
        return {
          "name": "Verified Identity",
          "description": "Hello ",
          "image": require('../../App/Images/verified_identity.png')
        }
      } else if (v.form === "http://schema.cnsnt.io/full_name_form") {
        return {
          "name": "Full Name",
          "description": "Hello ",
          "image": require('../../App/Images/full_name.png')
        }
      } else if (v.form === "http://schema.cnsnt.io/contact_email_form") {
        return {
          "name": "Verified Email",
          "description": "Hello ",
          "image": require('../../App/Images/contact_email.png')
        }
      } else if (v.form === "http://schema.cnsnt.io/contact_mobile_form") {
        return {
          "name": "Verified Mobile",
          "description": "Hello ",
          "image": require('../../App/Images/contact_mobile.png')
        }
      } else if(v.form === "http://schema.cnsnt.io/verified_face_match_form"){
        return {
          "name": "Verified FaceMatch",
          "description": "Hello ",
          "image": require('../../App/Images/verified_face_match.png')
        }
      } else {
        // FIXME
        return null
      }
    })
    .filter(v => !!v)

    this.setState({
      "sortedBadges": badges
    })
  }

  sortMyData(resources, resourceTypes) {

    // Add logically seperate resources types that aren't persisted in server 
    resourceTypes.push({ name: 'Malformed', url: null, items: [] })
    resourceTypes.push({ name: 'Verifiable Claims', url: null, items: [] })
    resourceTypes.push({ name: 'Decentralized Identifier', url: 'http://schema.cnsnt.io/decentralised_identifier', items: [] })
    resourceTypes.push({ name: 'Miscellaneous', url: null, items: [] })

    // Sort known items and verifiable claims  
    resourceTypes.map(rt => {

      if(rt.name === 'Verifiable Claims'){
        rt.items = resources.filter(r => r.is_verifiable_claim)
      }
      else{
        rt.items = resources.filter(r => {

          if(r.is_verifiable_claim){
            return false
          }

          if(!!r.schema){
            return Common.schemaCheck(r.schema, rt.url)
          }
          else{
            return `${rt.url}_form` === r.form
          }
        })
      }
      
      return rt
    })

    // Sort miscellaneous resources 
    let misc = resourceTypes.find(rt => rt.name === 'Miscellaneous')
    misc.items = resources.filter(r => !resourceTypes.some(rt => Common.schemaCheck(r.schema, rt.url)))

    // Set profile pic
    const person = resourceTypes.find(rt => rt.url === "http://schema.cnsnt.io/person").items[0]
    const identityPhotographUri = person && person.identityPhotograph ? `data:image/jpg;base64,${person.identityPhotograph}` : Anonymous.uri

    this.setState({
      "profilePicUrl": identityPhotographUri,
      "sortedResourceTypes": resourceTypes,
      "asyncActionInProgress": false
    })

  }

  // Context Menu functionality 

  onShowContextMenu(){
    this.contextMenu && this.contextMenu.show()
  }

  renderContextMenuRow(rowData, rowID, highlighted){
    let evenRow = rowID % 2; 
    return (
      <TouchableHighlight>
        <View style={[style.contextMenuOptions, { "backgroundColor": evenRow ? Palette.consentGrayLightest : "white" }]}>
          <Text style={[ highlighted && { "color": Palette.consentBlue } ]}>
            {`${rowData.value}`}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }

  onContextMenuItemSelect(index, option){
    option.onClick()
  }

  // End Context Menu functionality 

  render() {
    const profilepic = this.state.profilePicUrl ? <CircularImage uri={this.state.profilePicUrl} radius={25} borderColor="white" /> : <ActivityIndicator color={Palette.consentGrayDark} style={style.progressIndicator}/>
    const headerIcons = [
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
        icon: (
               <ModalDropdown 
                ref={el => this.contextMenu = el}
                options={[
                  { "value":'Help', onClick: this.onPressHelp.bind(this, "me", helpScreens, "pop") }, 
                  { "value":'Legal', onClick: () => { alert("Navigate to legal") }}, 
                  { "value":'Logout', onClick: () => { alert("Logout...") }}
                ]}
                dropdownStyle={style.contextMenu}
                renderRow={this.renderContextMenuRow.bind(this)}
                onSelect={ (idx, value) => this.onContextMenuItemSelect(idx, value) }
               >
                <GearIcon width={38} height={38} stroke={Palette.consentGrayDark} />
               </ModalDropdown>
              ),
        onPress: () => { this.onBoundShowContextMenu() },
        borderColor: "white"
      }
    ]

    return (
      <Container>
        <View style={style.headerWrapper}>
          <BackButton navigator={this.navigator} />
          <LifekeyHeader
          icons={headerIcons}
          tabs={[
            {
              text: "Connect",
              onPress: () => this.setState({ activeTab: CONNECT }, this.scrollViewToTop.bind(this)),
              active: this.state.activeTab === CONNECT
            },
            {
              text: "My Data",
              onPress: () => this.setState({ activeTab: MY_DATA }, this.scrollViewToTop.bind(this)),
              active: this.state.activeTab === MY_DATA
            },
            {
              text: "Badges",
              onPress: () => this.setState({ activeTab: BADGES }, this.scrollViewToTop.bind(this)),
              active: this.state.activeTab === BADGES
            }
          ]}
          />
        </View>
        <ScrollView ref={(sv) => { this.state.scrollview = sv }} style={style.contentContainer}>
          {
            !this.state.asyncActionInProgress ? 
              this.renderTab()
            :
              <View style={style.progressContainer}>
                <ActivityIndicator color={Palette.consentGrayDark} style={style.progressIndicator}/> 
                <Text style={style.progressText}>{this.state.progressCopy}</Text>
              </View>
          }

        </ScrollView>

      </Container>
    )
  }

  renderTab() {
    
    switch (this.state.activeTab) {

    case CONNECT:
      return <Connect onPressHelp={ this.onBoundPressHelp }></Connect>
    case MY_DATA:
      return <MyData sortedResourceTypes={this.state.sortedResourceTypes}></MyData>
    case BADGES:
      return <Badges badges={this.state.sortedBadges}></Badges>
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
  "content": {
    "backgroundColor": "#eee"
  },
  "contentContainer":{
    "flex": 1
  },
  "connectTab": {
    "flex": 1,
    // "height": `${100 - Design.navigationContainerHeight}%`,
    "backgroundColor": Palette.consentGrayLightest,
    "alignItems": "center",
    "justifyContent": "center",
    "paddingRight": Design.paddingRight,
    "paddingLeft": Design.paddingLeft,
  },
  "progressContainer": {
    // "backgroundColor": Palette.consentBlue,
    "flex": 1,
    "alignItems": "center",
    "justifyContent": "center"
  },
  "progressIndicator": {
    "width": 75,
    "height": 75 
  },
  "progressText":{
    "color": Palette.consentGrayDark
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
Me.contextTypes = {
  // behavior
  onEditResource: PropTypes.func,
  onSaveResource: PropTypes.func,

  // state
  getShouldClearResourceCache: PropTypes.func
}

export default Me
