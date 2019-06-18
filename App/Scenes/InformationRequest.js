// external dependencies
import React from "react"
import { Text, View, ScrollView, ToastAndroid, Image, Dimensions } from "react-native"
import { Container, Card, CardItem } from "native-base"
import LinearGradient from 'react-native-linear-gradient';

// internal dependencies
import Api from "../Api"
import Routes from "../Routes"
import Palette from "../Palette"
import Design from "../DesignParameters"
import LifekeyFooter from '../Components/LifekeyFooter'
import BackButton from "../Components/BackButton"
import HelpIcon from "../Components/HelpIcon"
import VerifiedIcon from "../Components/VerifiedIcon"
import TickIcon from "../Components/TickIcon"
import CircularImage from "../Components/CircularImage"
import LocationFlagIcon from '../Components/LocationFlagIcon'
import MarketingIcon from '../Components/MarketingIcon'
import PeriodIcon from '../Components/PeriodIcon'
import HexagonIcon from "../Components/HexagonIcon"
import AddCategoryButton from "../Components/lc-AddCategoryButton"
import ProgressIndicator from "../Components/ProgressIndicator"
import Scene from "../Scene"
import Touchable from "../Components/Touchable"
import Logger from '../Logger'
import Common from '../Common'
import LifekeyHeader from '../Components/LifekeyHeader'
import BackIcon from '../Components/BackIcon'
import PropTypes from 'prop-types'
import Toast from '../Utils/Toast'
import _ from 'lodash'

const { height, width } = Dimensions.get('window');
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
      agentColor: Palette.consentWhite,
      agentColorSecondary: Palette.consentGrayDarkest,
      agentImage: '',
      asyncActionInProgress: true,
      progressCopy: "Loading..."
    }

    this.onBoundPressDecline = this.onPressDecline.bind(this)
    this.onBoundPressHelp = this.onPressHelp.bind(this)
    this.onBoundPressShare = this.onPressShare.bind(this)

    this.onBoundResources = this.onResources.bind(this)

    this.iconDimension = 20

  }

  componentDidMount() {
    super.componentDidMount()
    Api.getFlattenedResources().then(this.onBoundResources)
    this.getConnectionProfile();
  }

  componentWillFocus() {
    super.componentWillFocus()
    Api.getFlattenedResources().then(this.onBoundResources)

  }

  onResources(data) {
    this.findMissingResourceProperties(data, this.props.route.required_entities)
    this.setState({ resources: data })
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
      debugger;
      const isRequiredAndPresent = resources.find(r => Common.schemaCheck(r.schema, re.address))
      if(!!isRequiredAndPresent){
        entity.id = isRequiredAndPresent.id
        
        // Add present fields, if any
        entity.presentFields = `${Object.values(isRequiredAndPresent).slice(1, 3).join().substring(0, 100)}...`

        // Add missing fields, if any
        entity.missingFields = Object.keys(isRequiredAndPresent).filter(k => isRequiredAndPresent[k] === null )

        //entity.missingFields = _.omit(entity.missingFields, 'from_user_did');
        entity.missingFields = entity.missingFields.filter(e => e !== 'from_user_did');
        // Add this entity to complete or partial
        entity.missingFields.length ? partial.push(entity) : complete.push(entity)

      }
      else {
        // Add the missing entity to the missing collection
        // console.log('**** not been schemad ****')
        // console.log(entity)
        missing.push(entity)
      }
    })

    this.setState({
      complete: complete,
      partial: partial,
      missing: missing,
      // complete: complete.concat(partial),
      // partial: [],
      // missing: missing,
      asyncActionInProgress: false
    })
  }

  onPressDecline() {
    this.navigator.pop()
  }

  onPressHelp() {
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
    this.context.onEditResource(form, id, name)
  }

  render() {
    const screenWidth = Dimensions.get('window').width
    const iconSize = screenWidth / 25
    console.log('**** RERENDER!! ****')
    console.log('COMPLETE', this.state.complete);
    console.log('MISSING', this.state.missing);
    console.log('PARTICAL', this.state.partial);
    return (
      <Container>
        <BackButton navigator={this.navigator} />
        <LifekeyHeader
              headerHeight={90}
              hasGradient={true}
              backgroundColor={this.state.agentColor}
              backgroundColorSecondary={this.state.agentColorSecondary}
              foregroundHighlightColor={Palette.consentWhite}
              icons={[
                {
                  icon: (<BackIcon width={Design.headerIconWidth} height={Design.headerIconHeight} stroke="#fff" />),
                  onPress: this.navigator.pop,
                  borderColor: this.state.colour
                },
                {
                  logo: true,
                  icon: (
                    <View style={{ flex: 1, position: 'absolute', top: 20, alignItems: 'center' }}>
                      {/* <Image source={{uri: this.state.image_uri}} style={styles.fullWidthHeight} /> */}
                      <Image source={{ uri: this.state.agentImage }} style={{ width: 180, height: 40 }} />
                    </View>
                  ),
                  onPress: () => this.setState({activeTab: ACTIVITY}),
                  borderColor: this.state.colour
                },
                {
                  icon: <View width={24} height={24}/>,
                  onPress: () => {},
                  borderColor: this.state.colour
                }
              ]}
              />
        <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={[this.state.agentColor, this.state.agentColorSecondary]} style={styles.content}>
          <View style={{ backgroundColor: Palette.consentGrayLight, flex: 1 }}>
          <LinearGradient style={{ height: 70, justifyContent: 'center', width: '100%' }}  start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={[this.state.agentColor, this.state.agentColorSecondary]}>
              <View style={{ position: 'absolute', bottom: 40, zIndex: 1000, marginHorizontal: '16%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 2, paddingHorizontal: 5, backgroundColor: this.state.agentColorSecondary, borderTopRightRadius: 5, borderTopLeftRadius: 5 }}>
              <PeriodIcon stroke={Palette.consentWhite} width={iconSize} height={iconSize}/>
                <Text style={ styles.verifiedText }>12 Months</Text>
                <LocationFlagIcon stroke={Palette.consentWhite} width={iconSize} height={iconSize}/>
                <Text style={ styles.verifiedText }>In SA</Text>
                <MarketingIcon stroke={Palette.consentWhite} width={iconSize} height={iconSize}/>
                <Text style={ styles.verifiedText }>Marketing</Text>
              </View>
          </LinearGradient>
          {
            this.state.asyncActionInProgress ? 
              <ProgressIndicator progressCopy={ this.state.progressCopy }></ProgressIndicator>
            :
              <View style={[styles.resourceItemContainer, { position: 'absolute', height: height - 250, top: 30 }]}>
                  <ScrollView contentContainerStyle={styles.resourceScrollView}>
                    <View style={styles.name}>
                    </View>
                    <View style={styles.description}>
                      <Text style={styles.descriptionText}>
                        {this.state.botDisplayName} would like to see the following information:
                      </Text>
                    </View>
                    { this.state.complete.length > 0 && 
                      <View style={styles.cardContainer}>  
                        { 
                          this.state.complete.map((entity, i) => {
                            return (
                              <View key={entity.name} style={ styles.resourceItem }>
                                <View style={styles.card}>
                                  <View>
                                    <View style={styles.cardHeader}>
                                      <Text style={ Object.assign({}, styles.cardHeadingText, { "color": Palette.consentOffBlack })}>{entity.name.toUpperCase()}</Text>
                                      {/* <TickIcon width={ this.iconDimension } height={ this.iconDimension } stroke={Palette.consentBlue} /> */}
                                    </View>
                                  </View>
                                </View>
                              </View>
                            )
                          }) 
                        }
                      </View>
                    }                  
  
                    {this.state.partial.length > 0 &&
                      <View style={styles.cardContainer}>
                          { this.state.partial.map((entity, i) => {
                            return (
                              <View key={entity.name} style={[styles.resourceItem, styles.partialResource]}>
                                <AddCategoryButton 
                                  width={ this.iconDimension }
                                  height={ this.iconDimension }
                                  color={Palette.consentRed}
                                  name={entity.name}
                                  form={entity.form}
                                  id={entity.id}
                                  onEditResource={this.context.onEditResource.bind(this)}
                                />
                              </View>
                            )
                          }) }
                      </View>
                    }
                    
                    {this.state.missing.length > 0 &&
                      <View style={styles.cardContainer}>
                        { this.state.missing.map((entity, i) => {
                          return (
                            <View key={entity.name} style={ styles.resourceItem }>
                              <AddCategoryButton
                                name={entity.name} 
                                form={entity.form} 
                                color={Palette.consentRed}
                                width={ this.iconDimension } height={ this.iconDimension }
                                onEditResource={this.context.onEditResource.bind(this)}
                              />
                            </View>
                          )
                        }) }
                      </View>
                    }
                  </ScrollView>
                  {
                    this.state.missing.length !== 0 &&
                    <View style={styles.redWarningBox}>
                      <Text style={styles.redWarningBoxText}>
                        You are missing one or more pieces of information, please update before sharing
                      </Text>
                    </View>
                  }
                  

              </View>
          }
          
          </View>
          <View style={[{ top: height - 290, zIndex: 1000, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', position: 'absolute' }]}>
          {
            this.state.partial.length > 0 || this.state.missing.length > 0 &&
              <View style={ Object.assign({}, styles.shareView) }>
                <HexagonIcon width={110} height={110} textSize={19} text="Share" fill={Palette.consentGrayMedium} />
              </View>
          }
          {
            this.state.partial.length < 1 && this.state.missing.length < 1 &&
            <Touchable onPress={this.onBoundPressShare}>
              <View style={styles.shareView}>
                <HexagonIcon width={110} height={110} textSize={18} text="Share" textColor={Palette.consentWhite} />
              </View>
            </Touchable>
          }
          </View>
          <LifekeyFooter
            backgroundColor={ "transparent" }
            leftButtonText="Cancel"
            rightButtonText=""
            rightButtonIcon={<HelpIcon width={Design.footerIconWidth} height={Design.footerIconHeight} stroke={Palette.consentWhite} />}
            onPressLeftButton={this.onBoundPressDecline}
            onPressRightButton={this.onBoundPressHelp}
          />

        </LinearGradient>
      </Container>
    )
  }
}

const styles = {
  "content": {
    // paddingTop: 15,
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
    fontSize: 17,
    textAlign: "center"
  },
  "resourceItemContainer": {
    "flex": 1,
    "borderRadius": 1,
    "backgroundColor": Palette.consentWhite,
    "marginHorizontal": "3%",
    marginBottom: "3%",
    "paddingLeft": Design.paddingRight/2,
    "paddingRight": Design.paddingRight/2,
    "paddingTop": Design.paddingRight/2,
    "paddingBottom": Design.paddingRight/2
  },
  "resourceScrollView":{
    "justifyContent": "center",
    "alignItems": "center",
  },
  "resourceItem":{
    "width": "100%",
  },
  verifiedText: {
    fontSize: 14,
    "color": Palette.consentWhite,
    "padding": 5
  },
  "partialResource": {
    "borderLeftColor": Palette.consentRed,
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
  "cardContainer": {
    "flexDirection": "column",
    "width": "100%",
  },
  "card": {
    paddingTop: 40,
    paddingBottom: 10,
    marginHorizontal: 20,
    borderBottomColor: Palette.consentGrayMedium,
    borderBottomWidth: 1,
  },
  "cardHeader": {
    "flex": 1,
    "flexDirection": "row",
    "justifyContent": "space-between",
    "alignItems": "center"
  },
  "cardHeadingText": {
    "fontSize": 13,
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
  },
  "redWarningBox": {
    backgroundColor: Palette.consentRed,
    borderRadius: 4,
    "marginHorizontal": "4%",
    paddingHorizontal: 30,
    paddingVertical: 10,
    marginBottom: 45,
    marginTop: 10,
  },
  "redWarningBoxText": {
    color: 'white',
    textAlign: 'center'
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
