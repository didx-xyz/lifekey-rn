// external dependencies
import React from "react"
import { Text, View, ScrollView, ToastAndroid, Image } from "react-native"
import { Container } from "native-base"
import ActivityIndicator from "ActivityIndicator"

// internal dependencies
import Api from "../Api"
import Session from "../Session"
import Routes from "../Routes"
import Palette from "../Palette"
import Design from "../DesignParameters"
import BackButton from "../Components/BackButton"
import HelpIcon from "../Components/HelpIcon"
import CircularImage from "../Components/CircularImage"
import HexagonIcon from "../Components/HexagonIcon"
import InformationRequestResource from "../Components/InformationRequestResource"
import LocationIcon from "../Components/LocationIcon"
import MarketingIcon from "../Components/MarketingIcon"
import Scene from "../Scene"
import PeriodIcon from "../Components/PeriodIcon"
import Touchable from "../Components/Touchable"
import Logger from '../Logger'
import Common from '../Common'
import PropTypes from 'prop-types'

class InformationRequest extends Scene {

  constructor(...params) {
    super(...params)

    this.state = {
      isa: {
        purpose: null,
        required_entities: this.props.route.required_entities
      },
      botDisplayName: this.props.route.display_name,
      botImageUri: this.props.route.image_uri,
      resources: [],
      complete: [],
      partial: [],
      missing: [],
      asyncActionInProgress: true,
      progressCopy: "Loading..."
    }

    this.onBoundPressDecline = this.onPressDecline.bind(this)
    this.onBoundPressHelp = this.onPressHelp.bind(this)
    this.onBoundPressShare = this.onPressShare.bind(this)

    this.onBoundResources = this.onResources.bind(this)

  }

  componentDidMount() {
    super.componentDidMount()
    Api.getFlattenedResources().then(this.onBoundResources)
    
  }

  componentWillFocus() {
    super.componentWillFocus()
    Api.getFlattenedResources().then(this.onBoundResources)

  }

  onResources(data) {
    this.findMissingResourceProperties(data, this.props.route.required_entities)
    this.setState({ resources: data })
  }


  findMissingResourceProperties(resources, required_entities){
    this.verifyAndFixSchemaProperty(resources, required_entities)
    this.sortMyData(resources, required_entities)
  }

  verifyAndFixSchemaProperty(resources, required_entities){
    resources.forEach(resource => {
      resource.schema = Common.ensureUrlHasProtocol(resource.schema)
    })
    required_entities.forEach(re => {
      re.address = Common.ensureUrlHasProtocol(re.address)
    })
  }

  sortMyData(resources, required_entities) {

    let complete = []
    let partial = []
    let missing = []

    required_entities.forEach(re => {

      // Set up UI-only entity
      let entity = { name: re.name, id: null, form: `${re.address}_form`}
      // Check if this resource is present
      const isRequiredAndPresent = resources.find(r => Common.schemaCheck(r.schema, re.address))
      if(!!isRequiredAndPresent){
        
        entity.id = isRequiredAndPresent.id

        // Add present fields, if any
        entity.presentFields = `${Object.values(isRequiredAndPresent).slice(1, 3).join().substring(0, 100)}...`

        // Add missing fields, if any
        entity.missingFields = Object.keys(isRequiredAndPresent).filter(k => isRequiredAndPresent[k] === null )
        // Add this entity to complete or partial
        entity.missingFields.length ? partial.push(entity) : complete.push(entity)
      }
      else{
        // Add the missing entity to the missing collection
        missing.push(entity)
      }
    })

    this.setState({
      // complete: complete,
      // partial: partial,
      // TEMPORARILY COMBINE PARTIAL AND COMPLETE 
      complete: complete.concat(partial),
      partial: [],
      missing: missing,
      asyncActionInProgress: false
    })
  }

  onPressDecline() {
    this.navigator.pop()
  }

  onPressHelp() {
    alert("help")
  }

  onPressShare() {

    // SPINNER
    this.setState({"asyncActionInProgress": true, "progressCopy": "Sharing details..."}, () => {
      Api.establishISA(
        this.props.route.did,
        this.props.route.action.action_name,
        this.state.complete
      )
      .then(response => {
        this.navigator.resetTo({...Routes.main})
        ToastAndroid.show("Shared", ToastAndroid.SHORT)
      })
      .catch(error => {
        alert('Could not connect')
        Logger.warn(JSON.stringify(error))
        this.setState({
          "asyncActionInProgress": false
        }, () => ToastAndroid.show("Failed to connect...", ToastAndroid.SHORT))
      })
    })
  }

  onPressMissing(form, id, name) {
    this.context.onEditResource(form, id, name)
  }

  render() {
    return (
      <Container>
        <BackButton navigator={this.navigator} />
        <View style={styles.content}>
          {
            !this.state.asyncActionInProgress ? 
              <View style={styles.resourceItemContainer}>
                  <ScrollView contentContainerStyle={styles.resourceScrollView}>
                    <View style={styles.name}>
                      {/* logo here */}
                      <CircularImage uri={this.state.botImageUri} radius={25} borderColor={Palette.consentGrayLight} />   
                      <Text style={styles.nameText}>
                        {this.state.botDisplayName}
                      </Text> 
                    </View>
                    <View style={styles.description}>
                      <Text style={styles.descriptionText}>
                        Would like to see the following information: 
                      </Text>
                    </View>

                    { /* <View>
                      <View style={styles.description}>
                        <Text style={styles.descriptionText}>
                          This BOT would like to see the following information: 
                        </Text>
                      </View>
                      <View style={styles.wantedItems}>
                        
                        { this.props.route.required_entities.map((entity, i) => {
                          return (
                            <View key={i} style={styles.wantedItemContainer}>
                              <Text  style={styles.wantedItemsText}>
                                { entity.name }
                              </Text>
                            </View>
                          )
                        }) }
                      </View>
                    </View> */}

                    { this.state.complete.length > 0 && 
                      <View>  
                        { 
                          this.state.complete.map((entity, i) => {
                            return (
                              <View key={i} style={styles.resourceItem}>
                                <Text style={styles.resourceItemTextHeading}>
                                  { entity.name }
                                </Text>
                                <Text style={styles.resourceItemText}>
                                  { entity.presentFields }
                                </Text>
                              </View>
                            )
                          }) 
                        }
                      </View>
                    }                  
  
                    {this.state.partial.length > 0 &&
                      <View>
                          { this.state.partial.map((entity, i) => {
                            return (
                              <Touchable key={i} onPress={() => this.onPressMissing(entity.form, entity.id, entity.name)}>
                                <View style={Object.assign({}, styles.resourceItem, styles.partialResource)}>
                                  <Text style={styles.resourceItemText}>
                                    { entity.name }
                                  </Text>
                                </View>
                                {/* <Text style={styles.missingItemsText}>
                                  You need to complete {entity.name}... specifically the field(s):&nbsp;
                                    { entity.missingFields.map((item, j) => {
                                      return (j !== entity.missingFields.length - 1) ? `${item}, ` : `${item}`
                                    })
                                  }
                                </Text> */}
                              </Touchable>
                            )
                          }) }
                      </View>
                    }
                    
                    {this.state.missing.length > 0 &&
                      <View>
                        { this.state.missing.map((entity, i) => {
                          return (
                            <Touchable key={i} onPress={() => this.onPressMissing(entity.form, entity.id, entity.name)}>
                              <View style={Object.assign({}, styles.resourceItem, styles.missingResource)}>
                                <Text style={styles.resourceItemText}>
                                  { entity.name }
                                </Text>
                                <Text style={styles.missingResourceItemText}>
                                  Tap to create this resource
                                </Text>
                              </View>
                            </Touchable>
                          )
                        }) }
                      </View>
                    }
                    {
                      this.state.partial.length > 0 || this.state.missing.length > 0 &&
                      <View>
                        <View style={styles.missingItems}>
                          <Text style={styles.missingItemsText}>
                            You are missing one or more pieces of information, please update before sharing.
                          </Text>
                        </View>
                        <View style={Object.assign({}, styles.shareView, {"opacity": 0.5})}>
                          <HexagonIcon width={100} height={100} textSize={19} textX={30} textY={43} text="Share" />
                        </View>
                      </View>
                    }
                    {
                      this.state.partial.length < 1 && this.state.missing.length < 1 &&
                      <Touchable onPress={this.onBoundPressShare}>
                        <View style={styles.shareView}>
                          <HexagonIcon width={100} height={100} textSize={19} textX={30} textY={43} text="Share" />
                        </View>
                      </Touchable>
                    }
                  </ScrollView>
              </View>
            :
              <View style={styles.progressContainer}>
                <ActivityIndicator color={Palette.consentGrayDark} style={styles.progressIndicator}/> 
                <Text style={styles.progressText}>{ this.state.progressCopy }</Text>
              </View>
          }
          
          <View style={styles.bottom}>
            <View style={styles.decline}>
              <Touchable onPress={this.onBoundPressDecline}>
                <Text style={styles.declineText}>
                  Cancel
                </Text>
              </Touchable>
            </View>
            <View style={styles.help}>
              <Touchable onPress={this.onBoundPressHelp}>
                <HelpIcon width={32} height={32} stroke="#fff" />
              </Touchable>
            </View>
          </View>
        </View>
      </Container>
    )
  }
}

const styles = {
  "content": {
    flex: 1,
    "backgroundColor": Palette.consentOffBlack
  },
  "description": {
    height: 50,
    paddingLeft: "20%",
    paddingRight: "20%"
  },
  "descriptionText": {
    color: "#666",
    fontSize: 15,
    textAlign: "center"
  },
  "progressContainer": {
    "flex": 1,
    "alignItems": "center",
    "justifyContent": "center"
  },
  "progressIndicator": {
    "width": 75,
    "height": 75 
  },
  "progressText":{
    "color": "white"
  },
  "resourceItemContainer": {
    "borderRadius": 10,
    "backgroundColor": Palette.consentGrayLight,
    "margin": "3%",
    "height": "84%",
    "paddingLeft": Design.paddingRight/2,
    "paddingRight": Design.paddingRight/2,
    "paddingTop": Design.paddingRight/2
  },
  "resourceScrollView":{
    "justifyContent": "center",
    "alignItems": "center",
  },
  "resourceItem":{
    "backgroundColor": Palette.consentGrayMedium,
    "padding": Design.paddingTop,
    "margin": Design.paddingTop/2,
    "width": "100%",
    "shadowColor": "red",
    "shadowOffset": { "height": 4, "width": 0 },
    "shadowOpacity": 0.8,
  },
  "partialResource": {
    "borderLeftColor": "orange",
    "borderLeftWidth": 5
  },
  "missingResource": {
    "borderLeftColor": Palette.consentRed,
    "borderLeftWidth": 5
  },
  "resourceItemTextHeading":{
    "color": Palette.consentOffBlack
  },
  "resourceItemText": {
    "color": Palette.consentGrayDark
  },
  "missingResourceItemText": {
    "color": Palette.consentRed
  },
  "name": {
    "flexDirection": "row",
    alignItems: "center",
    justifyContent: "center"
  },
  "nameText": {
    "color": Palette.consentGrayDark,
    "fontSize": 16,
    "paddingLeft": Design.paddingRight/2
  },
  "missingItems":{
    "justifyContent": "center",
    "width": "80%",
    "backgroundColor": Palette.consentRed,
    "borderRadius": 5,
    "margin": Design.paddingRight/2,
    "padding": Design.paddingRight/2
  },
  "missingItemsText":{
    "textAlign": "center",
    "color": "white"
  },
  "bottom": {
    "height": "10%",
    "flexDirection": "row",
    "paddingLeft": "12%",
    "paddingRight": "12%"
  },
  "decline": {
    "flex": 1,
    "alignItems": "flex-start",
    "justifyContent": "center"
  },
  "declineText": {
    "color": "#fff",
    "textAlign": "left",
    "fontSize": 17
  },
  "help": {
    "flex": 1,
    "alignItems": "flex-end",
    "justifyContent": "center"
  },
  "shareView": {
    "flexDirection": "row",
    "alignItems": "center",
    "justifyContent": "center",
  }
}

InformationRequest.contextTypes = {
  // behavior
  onEditResource: PropTypes.func,
  onSaveResource: PropTypes.func,

  // state
  getShouldClearResourceCache: PropTypes.func
}

export default InformationRequest
