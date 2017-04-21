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

// const person = {
//   "fullName": "Jacques Noel Kleynhans",
//   "idOrigin": "South African ID",
//   "idNumber": "8205945067082",
//   "address": "52 Stanley Road, Tamboerskloof, Cape Town, South Africa, 8001",
//   "contactDetails": [
//     {
//       listCardHeading: "Mobile",
//       listCardPrimaryDetail: "+27 (082) 564 8245",
//       listCardSecondaryDetails: ["+27 (072) 223 3254"],
//       listImageUrl: "hello"
//     },
//     {
//       listCardHeading: "Home",
//       listCardPrimaryDetail: "+27 (021) 425 7685",
//       listCardSecondaryDetails: ["021 424 5678"],
//       listImageUrl: "hello"
//     },
//     {
//       listCardHeading: "Email",
//       listCardPrimaryDetail: "jacques@io.co.za",
//       listCardSecondaryDetails: ["jacqieboy@bedbathandbeyond.com", "jacqueslehomme@findyourdesire.fr"],
//       listImageUrl: "hello"
//     }
//   ]
// }

const CONNECT = 0
const MY_DATA = 1
const BADGES = 2

var person = {
  mycode: '+',
  facematch: '-',
}

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
    this.onClearCache()

    Api.allResourceTypes().then(this.onBoundResourceTypes)
  }

  componentWillFocus() {
    super.componentWillFocus()
    this.onClearCache()
  }

  onClearCache() {
    if (this.context.getShouldClearResourceCache()) {
      this.setState({
        resources: {}
      })

      Api.allResources().then(this.onBoundResources)
    }
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
    this.setState({
      resources: data.body.map((item) => {
        return {
          id: item.id,
          alias: item.alias,
          ...JSON.parse(item.value)
        }
      })
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

  onPressMyCode() {
    this.setState({ informationSource: "MY CODE" })
  }
  onPressFaceMatch() {
    this.setState({ informationSource: "FACE MATCH" })
  }

  currentInformationState(){
    if(this.state.informationSource === "MY CODE")
      return (
        <View>
          <View style={style.qrCodeContainer}>
            {/* Image goes here */}
            <Text>{person.mycode}</Text>
          </View>
          <View style={style.textContainer}>
            <Text style={style.text}>Invite other people to connect with you by sharing your unique ID code</Text>
          </View>
          <View style={style.footer}>
            <Touchable onPress={() => alert('help')}>
              <HelpIcon width={32} height={32} stroke="#666" />
            </Touchable>
            <Touchable onPress={() => alert('share')}>
              <Text style={style.footerText}>Share</Text>
            </Touchable>
          </View>
        </View>
      )
    else
      return (
        <View>
          <View style={style.qrCodeContainer}>
            {/* Image goes here */}
            <Text>{person.facematch}</Text>
          </View>
          <View style={style.textContainer}>
            <Text style={style.text}>Get someone else to scan this QR Code to verify your facial match</Text>
          </View>
          <View style={style.footer}>
            <Touchable onPress={() => alert('help')}>
              <HelpIcon width={32} height={32} stroke="#666" />
            </Touchable>
          </View>
        </View>
      )
  }

  renderTab() {
    switch (this.state.activeTab) {

    case CONNECT:
      return (
        <View style={style.connectTab}>
          <View style={style.switchButtonContainer}>
            <View style={Object.assign({}, style.switchButton, style.switchButtonLeft,
              {"backgroundColor": this.state.informationSource === "MY CODE" ? Palette.consentBlue : Palette.consentGrayLightest})}>
              <Touchable onPress={() => this.onPressMyCode()}>
                <Text style={Object.assign({}, style.switchButtonText, {"color": this.state.informationSource === "MY CODE" ? "white" : Palette.consentBlue})}>MY CODE</Text>
              </Touchable>
            </View>
            <View style={Object.assign({}, style.switchButton, style.switchButtonRight, {"backgroundColor": this.state.informationSource === "FACE MATCH" ? Palette.consentBlue : Palette.consentGrayLightest})}>
              <Touchable onPress={() => this.onPressMyCode()}>
                <Text style={Object.assign({}, style.switchButtonText, {"color": this.state.informationSource === "FACE MATCH" ? "white" : Palette.consentBlue})}>FACE MATCH</Text>
              </Touchable>
            </View>
          </View>
          <View style={style.informationContainer}>
            { this.currentInformationState() }
          </View>

        </View>
      )

    case MY_DATA:
      return (
        <Content>
          {Object.values(this.state.resources).map((resource, i) => {
            if (resource === null) {
              return
            }

            if (resource.form == null) {
              return (
                <LifekeyCard key={i} headingText={"resource " + resource.id} onPressDelete={() => this.onPressDelete(resource.id)}>
                  <Text>{resource.id} (malformed)</Text>
                </LifekeyCard>
              )
            }

            return (
              <LifekeyCard key={i} headingText={resource.alias} onPressEdit={() => this.onPressEdit(resource.form, resource.id)} onPressDelete={() => this.onPressDelete(resource.id)}>
                <Text key={i}>{resource.id}</Text>
              </LifekeyCard>
            )
          })}

          <View>
            {this.state.resourceTypes.map((resourceType, i) => {
              return (
                <LcAddCategoryButton key={i} name={resourceType.name} form={resourceType.url + "_form"} onEditResource={this.context.onEditResource} />
              )
            })}
          </View>
        </Content>
      )

    case BADGES:
      return (
        <View style={style.content}>
          <View style={style.badge}>
            <View style={style.badgeImage}>
              {/* badge image here */}
              <Text>+</Text>
            </View>
            <View style={style.badgeContent}>
              <View style={style.badgeName}>
                <Text style={style.badgeNameText}>
                  Absa RICA
                </Text>
              </View>
              <View style={style.badgeDescription}>
                <Text style={style.badgeDescriptionText}>
                  Complete RICA documentation with verification from Absa Bank.
                </Text>
              </View>
            </View>
          </View>

          <View style={style.badge}>
            <View style={style.badgeImage}>
              {/* badge image here */}
              <Text>+</Text>
            </View>
            <View style={style.badgeContent}>
              <View style={style.badgeName}>
                <Text style={style.badgeNameText}>
                  LifeLock
                </Text>
              </View>
              <View style={style.badgeDescription}>
                <Text style={style.badgeDescriptionText}>
                  Get a trust score of 4.5 or higher on the LifeKey platform.
                </Text>
              </View>
            </View>
          </View>

          <View style={style.badge}>
            <View style={style.badgeImage}>
              {/* badge image here */}
              <Text>+</Text>
            </View>
            <View style={style.badgeContent}>
              <View style={style.badgeName}>
                <Text style={style.badgeNameText}>
                  ThisIsMe Verified
                </Text>
              </View>
              <View style={style.badgeDescription}>
                <Text style={style.badgeDescriptionText}>
                  Complete all required fields to get a trustworthy verification from ThisIsMe.
                </Text>
              </View>
            </View>
          </View>
        </View>
      )
    }
  }

  render() {
    const headerIcons = [
      {
        icon: <BackIcon width={16} height={16}/>,
        onPress: () => this.navigator.pop()
      },
      {
        icon: <Image source={require('../Images/jacques.png')}/>,
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
        <Content>
          <Col style={{ flex: 1 }}>
            {this.renderTab()}
          </Col>
        </Content>
      </Container>
    )
  }
}

const style = {
  headerWrapper: {
    borderColor: Palette.consentGrayDark,
    height: Design.lifekeyHeaderHeight
  },
  content: {
    backgroundColor: "#eee"
  },
  "connectTab": {
    flex: 1,
    // "height": `${100 - Design.navigationContainerHeight}%`,
    "backgroundColor": Palette.consentGrayLightest,
    "alignItems": "center",
    "justifyContent": "center",
    "paddingRight": Design.paddingRight,
    "paddingLeft": Design.paddingLeft,
  },
  badge: {
    flex: 1,
    flexDirection: "row",
    margin: 15,
    marginBottom: 0,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#ddd"
  },
  badgeImage: {
    width: 80,
    justifyContent: "center",
    alignItems: "center"
  },
  badgeContent: {
    flex: 1,
    flexDirection: "column"
  },
  badgeName: {
    flex: 1
  },
  badgeNameText: {
    fontWeight: "bold",
    color: "#333"
  },
  badgeDescription: {
    flex: 1
  },
  badgeDescriptionText: {
    color: "#666"
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
