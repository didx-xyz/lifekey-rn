// external dependencies
import React from "react"
import { Text, View, Image } from "react-native"
import { Container, Content, Col } from "native-base"
import PropTypes from "prop-types"

// internal dependencies
import Api from "../Api"
import Scene from "../Scene"
import Palette from "../Palette"
import LifekeyHeader from "../Components/LifekeyHeader"
import LifekeyCard from "../Components/LifekeyCard"
import LcAddCategoryButton from "../Components/lc-AddCategoryButton"
import Touchable from "../Components/Touchable"
import BackButton from "../Components/BackButton"
import BackIcon from "../Components/BackIcon"
import HelpIcon from "../Components/HelpIcon"
import Design from "../DesignParameters"
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
      resources: {},
      resourceTypes: [],
      informationSource: "MY CODE"
    }

    this.onBoundResourceTypes = this.onResourceTypes.bind(this)
    this.onBoundResources = this.onResources.bind(this)
  }

  componentDidMount() {
    super.componentDidMount()   

    Promise.all([
      this.onClearCache(),
      Api.allResourceTypes()
    ]).then(values => { 
      this.onBoundResourceTypes(values[1])
      this.sortMyData(this.state.resources, this.state.resourceTypes)
    }).catch(error => {
      Logger.error(error)
    });
  }

  componentWillFocus() {
    super.componentWillFocus()
    this.onClearCache()
  }

  onClearCache() {
    if (this.context.getShouldClearResourceCache()) {
      this.setState({
        "resources": {}
      })  
      return Api.allResources()
                .then(this.onBoundResources)
                .catch(e => alert("All RESOURCES ERROR: " + e))
    }
    return Promise.resolve()
  }

  sortMyData(resources, resourceTypes){

    resourceTypes.push({ name: 'Malformed', url: null, items: [] })
    resourceTypes.map(rt => {
      rt.items = []
      resources.forEach(r => {
        if(`${rt.url}_form` === r.form){
          rt.items.push(r)
        }
      })
      return rt
    })

    this.setState({
      "myData": resourceTypes
    })
  }

  onResourceTypes(data) {
    if (!data.resources) {
      console.warn("resource list format changed")
    }

    this.setState({
      resourceTypes: data.resources
    })
  }

  onResources(data) {

    const updatedResources = data.body.map((item) => {
      return {
        id: item.id,
        alias: item.alias,
        ...JSON.parse(item.value)
      }
    })

    if(this.state.resourceTypes && this.state.resourceTypes.length)
      this.sortMyData(updatedResources, this.state.resourceTypes)
    
    this.setState({
      resources: updatedResources
    })
    
  }

  onPressDelete(id) {
    Api.deleteResource({ id })
    .catch(error => Logger.error(error))
    // refresh the list
    this.context.onSaveResource()
    this.onClearCache()
  }

  onPressEdit(form, id = null) {
    this.context.onEditResource(form, id)
  }

  renderTab() {
    switch (this.state.activeTab) {

    case CONNECT:
      return <Connect></Connect> 
    case MY_DATA: 
      return this.state.myData && <MyData data={this.state.myData} notifyParent={this.onClearCache.bind(this)}></MyData>
    case BADGES:
      return <Badges badges={this.state.resources}></Badges>
    }
  }

  render() {
    const headerIcons = [
      {
        icon: <BackIcon width={16} height={16}/>,
        onPress: () => this.navigator.pop()
      },
      {
        icon: <Image source={require('../Images/smiley_speech_bubble.png')}/>,
      },
      {
        icon: <Text>+</Text>,
        onPress: () => alert("test")
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
        <Content style={style.contentContainer}>
          {this.renderTab()}
        </Content>

      </Container>
    )
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
