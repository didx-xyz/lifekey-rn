// external dependencies
import React from "react"
import { Text, View, ScrollView, ToastAndroid } from "react-native"
import { Container } from "native-base"
import ActivityIndicator from "ActivityIndicator"

// internal dependencies
import Api from "../Api"
import Session from "../Session"
import Routes from "../Routes"
import Palette from "../Palette"
import BackButton from "../Components/BackButton"
import HelpIcon from "../Components/HelpIcon"
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
      //MOCK
      // isa: {
      //   purpose: null,
      //   required_entities: [ { name: "Verify ID", action_name: "verify_id", entities: [ { name: "Person", address: "http://schema.cnsnt.io/person" } ] } ]
      // },
      // END MOCK
      resources: [],
      complete: [],
      partial: [],
      missing: [],
      asyncActionInProgress: true
    }

    console.log("CONSTRUCTOR REQ ENTITIES: ", this.props.route.required_entities)

    this.onBoundPressDecline = this.onPressDecline.bind(this)
    this.onBoundPressHelp = this.onPressHelp.bind(this)
    this.onBoundPressShare = this.onPressShare.bind(this)

    // this.onBoundISA = this.onISA.bind(this)
    this.onBoundResources = this.onResources.bind(this)

  }

  componentDidMount() {

    super.componentDidMount()

    Api.allResources()
    .then(values => {
      this.onBoundResources(values)
    })
    .catch(error => {
      Logger.error(error)
    })
  }

  componentWillFocus() {
    super.componentWillFocus()

    this.setState({"asyncActionInProgress": true, "progressCopy": "Loading..."}, async () => {
      Promise.all([
        Api.allResources()
      ]).then(values => {
        this.onBoundResources(values[0])
      }).catch(error => {
        Logger.error(error)
      })
    })

  }

  // onISA(response, then) {
  //   if (response && !response.error) {
  //     const unacked = response.body.unacked
  //     const currentISA = unacked.find(isar => parseInt(isar.id, 10) === parseInt(this.state.isar_id, 10))
  //     if (currentISA) {
  //       // remove required_entities FIX
  //       const fixedISA = currentISA.filter(x => !x.required_entities && !x.entities)
  //       setTimeout(() => {
  //         this.setState({
  //           isa: fixedISA
  //         }, then)
  //       }, 100)
  //     } else {
  //       Logger.warn('Could not find corresponding ISA')
  //     }
  //   }
  // }

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

    this.findMissingResourceProperties(updatedResources, this.props.route.required_entities)

    this.setState({
      resources: updatedResources
    })
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
      complete: complete,
      partial: partial,
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
    
    console.log("******************** ", this.props.route.did,
      this.props.route.action.action_name,
      this.state.complete)

    Api.establishISA(
      this.props.route.did,
      this.props.route.action.action_name,
      this.state.complete
    )
    .then(response => {
      this.navigator.pop()
      ToastAndroid.show("Shared", ToastAndroid.SHORT)
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
          <View style={styles.top}>
          </View>

          {
            !this.state.asyncActionInProgress ? 
              <View style={styles.middle}>
                <View style={styles.middleBackground}>
                  <ScrollView>
                    <View style={styles.name}>
                      {/* logo here */}
                      <Text style={styles.nameText}>
                        {this.state.isa.purpose}
                      </Text>
                    </View>

                    <View>
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
                    </View>

                    { /* this.state.complete.length > 0 && 
                      <View>
                        <View style={styles.description}>
                          <Text style={styles.descriptionText}>
                            COMPLETE
                          </Text>
                        </View>
                        <View style={styles.missingItems}>
                          { this.state.complete.map((entity, i) => {
                            return (
                              <Touchable key={i} onPress={() => this.onPressMissing(entity.form, entity.id)}>
                                <Text style={styles.missingItemsText}>
                                  You need to complete {entity.name}... specifically the field(s):&nbsp;
                                    { entity.missingFields.map((item, j) => {
                                      return (j !== entity.missingFields.length - 1) ? `${item}, ` : `${item}`
                                    })
                                  }
                                </Text>
                              </Touchable>
                            )
                          }) }
                        </View>
                      </View>
                    */ }                  
  
                    {this.state.partial.length > 0 &&
                      <View>
                        <View style={styles.description}>
                          <Text style={styles.descriptionText}>
                            PARTIAL
                          </Text>
                        </View>
                        <View style={styles.missingItems}>
                          { this.state.partial.map((entity, i) => {
                            return (
                              <Touchable key={i} onPress={() => this.onPressMissing(entity.form, entity.id, entity.name)}>
                                <Text style={styles.missingItemsText}>
                                  You need to complete {entity.name}... specifically the field(s):&nbsp;
                                    { entity.missingFields.map((item, j) => {
                                      return (j !== entity.missingFields.length - 1) ? `${item}, ` : `${item}`
                                    })
                                  }
                                </Text>
                              </Touchable>
                            )
                          }) }
                        </View>
                      </View>
                    }
                    
                    {this.state.missing.length > 0 &&
                      <View>
                        <View style={styles.description}>
                          <Text style={styles.descriptionText}>
                            MISSING
                          </Text>
                        </View>
                        <View style={styles.missingItems}>
                          { this.state.missing.map((entity, i) => {
                            return (
                              <Touchable key={i} onPress={() => this.onPressMissing(entity.form, entity.id, entity.name)}>
                                <Text style={styles.missingItemsText}>
                                  You are missing {entity.name}.
                                </Text>
                              </Touchable>
                            )
                          }) }
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
              </View>
            :
              <View style={styles.progressContainer}>
                <ActivityIndicator color={Palette.consentGrayDark} style={styles.progressIndicator}/> 
                <Text style={styles.progressText}>Loading...</Text>
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
  content: {
    flex: 1,
    "backgroundColor": Palette.consentOffBlack
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
  top: {
    height: "14%"
  },
  middle: {
    height: "72%",
    paddingLeft: 10,
    paddingRight: 10
  },
  middleBackground: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: "#f0f2f2",
    shadowColor: "#000000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: {
      height: 4,
      width: 0
    }
  },
  name: {
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: "20%",
    paddingRight: "20%",
    paddingTop: 20
  },
  nameText: {
    color: "#666",
    fontSize: 17
  },
  description: {
    height: 50,
    paddingLeft: "20%",
    paddingRight: "20%"
  },
  descriptionText: {
    color: "#666",
    fontSize: 15,
    textAlign: "center"
  },
  itemText: {
    color: "#666"
  },
  missingText: {
    color: "#ff5d62"
  },
  meta: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10
  },
  metaItem: {
    color: "#666"
  },
  wantedItems: {
    backgroundColor: Palette.consentGrayLight,
    padding: 15,
    margin: 15
  },
  wantedItemContainer: {
    backgroundColor: Palette.consentGray,
    padding: 5,
  },
  wantedItemsText: {
    color: Palette.consentGrayDark
  },
  missingItems: {
    backgroundColor: "#ff2b33",
    padding: 15,
    margin: 15,
    borderRadius: 8
  },
  missingItemsText: {
    color: "#fff"
  },
  foundText: {
    color: "#333",
    fontWeight: "bold"
  },
  bottom: {
    height: "14%",
    flexDirection: "row",
    paddingLeft: "12%",
    paddingRight: "12%"
  },
  decline: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center"
  },
  declineText: {
    color: "#fff",
    textAlign: "left",
    fontSize: 17
  },
  help: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center"
  },
  shareView: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    padding: 30
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
