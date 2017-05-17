// external dependencies
import React from "react"
import { Text, View, Image, ScrollView } from "react-native"
import { Container, Content, Col } from "native-base"
import PropTypes from "prop-types"
import ActivityIndicator from "ActivityIndicator"




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
import Design from "../DesignParameters"
import Anonymous from "../Images/anonymous_person"
import Logger from "../Logger"

import MyData from "../Components/SceneComponents/MyData"
import Connect from "../Components/SceneComponents/Connect"
import Badges from "../Components/SceneComponents/Badges"

const CONNECT = 0
const MY_DATA = 1
const BADGES = 2

class Me extends Scene {
  constructor(...params) {
    super(...params)

    this.state = {
      activeTab: MY_DATA,
      tabName: "My Data",
      resources: [],
      resourceTypes: [],
      sortedResourceTypes: [],
      sortedBadges: [],
      informationSource: "MY CODE",
      "progressCopy": "Loading...",
      "asyncActionInProgress": true,
      scrollview: null
    }

    this.onBoundResourceTypes = this.onResourceTypes.bind(this)
    this.onBoundResources = this.onResources.bind(this)
  }

  componentDidMount() {
    super.componentDidMount()

    // const time = new Date()
    Promise.all([
      Api.allResourceTypes(),
      Api.allResources()
    ]).then(values => {
      // console.log("Time spent waiting : ", (Date.now() - time.getTime()) / 1000)
      this.onBoundResourceTypes(values[0], () => {
        this.onBoundResources(values[1])
      })
    }).catch(error => {
      Logger.error(error)
    })
  }

  componentWillFocus() {
    super.componentWillFocus()

    Promise.all([
      Api.allResources()
    ]).then(values => {
      this.onBoundResources(values[0])
    }).catch(error => {
      Logger.error(error)
    })
  }

  componentDidUpdate(){
    // This is intended to ensure that the scrollview is always at Y : 0 when tabs are changed. 
    // It needs a bit of TLC however...
    this.scrollViewToTop()
  }

  scrollViewToTop() {
    if(this.state.scrollview){
      this.state.scrollview.scrollTo({x: 0, y: 0, animated: true})
      console.log("SCROLLED!")
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

    console.log("BADGES: ", badges)

    this.setState({
      "sortedBadges": badges
    })
  }



  sortMyData(resources, resourceTypes) {

    resourceTypes.push({ name: 'Malformed', url: null, items: [] })
    resourceTypes.push({ name: 'Verifiable Claims', url: null, items: [] })

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

    // Set profile pic

    const person = resourceTypes.find(rt => rt.url === "http://schema.cnsnt.io/person").items[0]
    // console.log("PERSON: ", JSON.stringify(person))
    const identityPhotographUri = person && person.identityPhotograph ? `data:image/jpg;base64,${person.identityPhotograph}` : Anonymous.uri

    // End set profile pic 

    this.setState({
      "profilePicUrl": identityPhotographUri,
      "sortedResourceTypes": resourceTypes,
      "asyncActionInProgress": false
    })


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

  render() {
    const profilepic = this.state.profilePicUrl ? <Image source={{ uri: this.state.profilePicUrl }} style={{ width: "100%", height: "100%" }} /> : <ActivityIndicator color={Palette.consentGrayDark} style={style.progressIndicator}/>
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
        icon: <Text>+</Text>,
        onPress: () => alert("test"),
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
                onPress: () => this.setState({ activeTab: CONNECT }),
                active: this.state.activeTab === CONNECT
              },
              {
                text: "My Data",
                onPress: () => this.setState({ activeTab: MY_DATA }),
                active: this.state.activeTab === MY_DATA
              },
              {
                text: "Badges",
                onPress: () => this.setState({ activeTab: BADGES }),
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
      return <Connect></Connect>
    case MY_DATA:
      return <MyData sortedResourceTypes={this.state.sortedResourceTypes}></MyData>
    case BADGES:
      return <Badges badges={this.state.sortedBadges}></Badges>
    }
  }

}

const style = {

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
