// external dependencies
import React, { Component } from "react"
import { Text, View, ScrollView, ToastAndroid, Image } from "react-native"
import { Container, Card, CardItem } from "native-base"
import ActivityIndicator from "ActivityIndicator"

// internal dependencies
import Api from "../../Api"
import Routes from "../../Routes"
import Palette from "../../Palette"
import Design from "../../DesignParameters"
import Scene from "../../Scene"
import Logger from '../../Logger'
import Common from '../../Common'
import LifekeyFooter from '../LifekeyFooter'
import BackButton from "../BackButton"
import HelpIcon from "../HelpIcon"
import TickIcon from "../TickIcon"
import CircularImage from "../CircularImage"
import HexagonIcon from "../HexagonIcon"
import AddCategoryButton from "../lc-AddCategoryButton"
import ProgressIndicator from "../ProgressIndicator"
import Touchable from "../Touchable"
import PropTypes from 'prop-types'
import Toast from '../../Utils/Toast'

class InformationRequest extends Component {

  constructor(...params) {
    super(...params)

    this.state = {
      isa: {
        purpose: null,
        required_entities: this.props.required_entities
      },
      botDisplayName: this.props.display_name,
      botImageUri: this.props.image_uri,
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
    Api.getFlattenedResources().then(this.onBoundResources)
  }

  componentWillFocus() {
    Api.getFlattenedResources().then(this.onBoundResources)
  }

  onResources(data) {
    this.findMissingResourceProperties(data, this.props.required_entities)
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
    this.props.onCancel()
  }

  onPressHelp() {
  }

  onPressShare() {

    // SPINNER
    this.setState({"asyncActionInProgress": true, "progressCopy": "Sharing details..."}, () => {
      Api.establishISA(
        this.props.did,
        this.props.action.action_name,
        this.state.complete
      )
      .then(response => {
        this.navigator.resetTo({...Routes.main})
        Toast.show("Shared", ToastAndroid.SHORT)
      })
      .catch(error => {
        alert('Could not connect')
        Logger.warn(JSON.stringify(error))
        this.setState({
          "asyncActionInProgress": false
        }, () => Toast.show("Failed to connect...", ToastAndroid.SHORT))
      })
    })
  }

  onPressMissing(form, id, name) {
    console.log("PRESS MISSING")
    this.context.onEditResource(form, id, name)
    this.props.onCancel()
  }

  render() {
    return (
      <Container>
        <BackButton navigator={this.navigator} />
        <View style={styles.content}>
          {
            this.state.asyncActionInProgress ? 
              <ProgressIndicator progressCopy={ this.state.progressCopy }></ProgressIndicator>
            :
              <View style={styles.resourceItemContainer}>
                  <ScrollView contentContainerStyle={styles.resourceScrollView}>
                    <View style={styles.name}>
                      {/* logo */}
                      <CircularImage uri={this.state.botImageUri} radius={25} borderColor={Palette.consentGrayLight} />   
                      <Text style={styles.nameText}>
                        {this.state.botDisplayName}
                      </Text> 
                    </View>
                    <View style={styles.description}>
                      <Text style={styles.descriptionText}>
                        { this.state.missing.length === 0 ? 'Would like to see the following information:' : 'You are missing one or more pieces of information, please update before sharing' }
                      </Text>
                    </View>

                    { this.state.complete.length > 0 && 
                      <View>  
                        { 
                          this.state.complete.map((entity, i) => {
                            return (
                              <View key={`${entity.name}${i}`} style={ styles.resourceItem }>
                                <Card style={styles.card}>
                                  <CardItem>
                                    <View style={styles.cardHeader}>
                                      <Text style={ Object.assign({}, styles.cardHeadingText, { "color": Palette.consentOffBlack })}>{entity.name.toUpperCase()}</Text>
                                      <TickIcon width={ Design.headerIconWidth/2 } height={ Design.headerIconHeight/2 } stroke={Palette.consentBlue} />
                                    </View>
                                  </CardItem>
                                </Card>
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
                              <View key={`${entity.name}${i}`} style={ Object.assign({}, styles.resourceItem, styles.partialResource) }>
                                <AddCategoryButton name={entity.name} form={entity.form}></AddCategoryButton>
                              </View>
                            )
                          }) }
                      </View>
                    }
                    
                    {this.state.missing.length > 0 &&
                      <View>
                        { this.state.missing.map((entity, i) => {
                          return (
                            <View key={`${entity.name}${i}`} style={ styles.resourceItem }>
                              <AddCategoryButton name={entity.name} 
                                                 form={entity.form} 
                                                 color={Palette.consentRed}
                                                 onEditResource={this.onPressMissing.bind(this)}></AddCategoryButton>
                            </View>
                          )
                        }) }
                      </View>
                    }
                  </ScrollView>
                  {
                    this.state.partial.length > 0 || this.state.missing.length > 0 &&
                    <View style={ Object.assign({}, styles.shareView, { "opacity": 0.5 }) }>
                      <HexagonIcon width={100} height={100} textSize={19} text="Share" fill={Palette.consentGrayMedium} />
                    </View>
                  }
                  {
                    this.state.partial.length < 1 && this.state.missing.length < 1 &&
                    <Touchable onPress={this.onBoundPressShare}>
                      <View style={styles.shareView}>
                        <HexagonIcon width={100} height={100} textSize={18} text="Share" textColor={Palette.consentWhite} />
                      </View>
                    </Touchable>
                  }
              </View>
          }
          
          <LifekeyFooter
            backgroundColor={ Palette.consentOffBlack }
            leftButtonText="Cancel"
            rightButtonText=""
            rightButtonIcon={<HelpIcon width={Design.footerIconWidth} height={Design.footerIconHeight} stroke={Palette.consentWhite} />}
            onPressLeftButton={this.onBoundPressDecline}
            onPressRightButton={this.onBoundPressHelp}
          />

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
  "name": {
    "flexDirection": "row",
    alignItems: "center",
    justifyContent: "center"
  },
  "nameText": {
    "color": Palette.consentOffBlack,
    "fontSize": 18,
    "paddingLeft": Design.paddingRight/2
  },
  "description": {
    minHeight: 50,
    padding: 20,
    paddingTop: 0
  },
  "descriptionText": {
    color: Palette.consentGrayDark,
    fontSize: 15,
    textAlign: "center"
  },
  "resourceItemContainer": {
    "flex": 1,
    "borderRadius": 10,
    "backgroundColor": Palette.consentGrayLight,
    "margin": "3%",
    "paddingLeft": Design.paddingRight/2,
    "paddingRight": Design.paddingRight/2,
    "paddingTop": Design.paddingRight/2
  },
  "resourceScrollView":{
    "justifyContent": "center",
    "alignItems": "center",
  },
  "resourceItem":{
    "width": "100%"
  },
  "partialResource": {
    "borderLeftColor": "orange",
    "borderLeftWidth": 5
  },
  "missingResource": {
    "backgroundColor": Palette.consentRed,
    "paddingLeft": 5
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
  "shareView": {
    "flexDirection": "row",
    "alignItems": "center",
    "justifyContent": "center",
    "padding": Design.paddingTop
  },
  "card": {
    "marginTop": 1
  },
  "cardHeader": {
    "flex": 1,
    "flexDirection": "row",
    "justifyContent": "space-between",
    "alignItems": "center"
  },
  "cardHeadingText": {
    "fontSize": 10,
    "fontWeight": "bold"
  },
  "cardHeadingIcon": {
    "marginTop": -10,
    "color": Palette.consentGrayDark
  },
  "cardHeadingIconSmall": {
    "fontSize": 30
  },
  "cardHeadingIconLarge": {
    "fontSize": 32
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
