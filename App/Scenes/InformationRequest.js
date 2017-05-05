// external dependencies
import React from "react"
import { Text, View, ScrollView, ToastAndroid } from "react-native"
import { Container } from "native-base"

// internal dependencies
import Api from "../Api"
import Session from "../Session"
import Routes from "../Routes"
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
        required_entities: []
      },
      resources: [],
      isar_id: this.props.route.message.isar_id
    }

    this.onBoundPressDecline = this.onPressDecline.bind(this)
    this.onBoundPressHelp = this.onPressHelp.bind(this)
    this.onBoundPressShare = this.onPressShare.bind(this)

    this.swaps = {}
    this.shared = []
    this.i = 0
  }

  componentDidMount() {

    console.log("COMPONENT MOUNTING")

    const state = Session.getState()

    // this.setState({
    //   "isa": state.currentIsa
    // })

    Api.allResources().then(data => {
      console.log("resources", data)

      this.setState({
        resources: data.body,
      })
    })
    .catch((error) => Logger.warn(error))
    try {
      this.loadISAs()
    } catch (error) {
      Logger.warn(error)
    }

    this.updateSwaps()
  }

  componentWillUpdate(p, n) {
    super.componentWillUpdate()
    console.log('componentWillUpdate.this.state.', this.state)
  }

  updateSwaps() {
    const data = Session.getState()
    console.log("DATA", data)

    if (data.swapFrom && data.swapTo) {
      console.log("SWAP", data.swapFrom, data.swapTo)

      this.state.resources.some(resource => {
        if (resource.id === data.swapTo) {
          this.swaps["_" + data.swapFrom] = resource

          Session.update({
            "swapFrom": null,
            "swapTo": null
          })

          console.log("SWAPS", this.swaps)
          console.log("RESOURCES", this.state.resources)

          return true
        }
      })
    }
  }

  componentWillFocus() {
    super.componentWillFocus()

    this.updateSwaps()
  }

  componentDidFocus() {
    this.forceUpdate()
  }

  onPressDecline() {
    this.navigator.pop()
  }

  onPressHelp() {
    alert("help")
  }

  onPressShare() {
    console.log('----------------',JSON.stringify(this.shared))
    Api.respondISA({
      isa_id: this.state.isa.id,
      accepted: true,
      permitted_resources: this.shared.map(shared => ({ id: shared }))
    }).then(response => {
      // console.log("response", response)
      if(parseInt(response.status) === 201) {
        this.navigator.pop()
        ToastAndroid.show("ISA established", ToastAndroid.SHORT)
      } else {
        Logger.warn("Could not establish ISA")
        ToastAndroid.show("ISA established", ToastAndroid.SHORT)
      }
    })
    .catch(error => Logger.warn(error))
  }

  onSwap(resource, key = null) {
    Session.update({
      swapSchema: resource.schema,
      swapResources: this.state.resources,
      swapKey: key,
      swapFrom: resource.id
    })

    this.navigator.push(Routes.selectResourceOfType)
  }

  async loadISAs() {
    const response = await Api.allISAs()
    if (response && !response.error) {
      const unacked = response.body.unacked
      const currentISA = unacked.find(isar => parseInt(isar.id, 10) === parseInt(this.state.isar_id, 10))
      if (currentISA) {
        // currentISA.required_entities
        // currentISA.from_did
        // purpose
        // license
        Logger.info('currentISA', currentISA)
        setTimeout(() => {
          this.setState({
            isa: currentISA
          })
        }, 100)
      } else {
        Logger.warn('Could not find corresponding ISA')
      }
    }
  }

  onPressMissing(schema, id) {
    console.log('SCHAMEA', schema)
    schema = Common.ensureUrlHasProtocol(schema)
    const form = schema + "_form"
    this.context.onEditResource(form, null)
    // this.navigator.push(Routes.editResource)
  }

  render() {
    const missing = []
    // console.log("ISA", this.state.isa)

    return (
      <Container>
        <BackButton navigator={this.navigator} />
        <View style={styles.content}>
          <View style={styles.top}>
          </View>
          <View style={styles.middle}>
            <View style={styles.middleBackground}>
              <ScrollView>
                <View style={styles.name}>
                  {/* logo here */}
                  <Text style={styles.nameText}>
                    {this.state.isa.purpose}
                  </Text>
                </View>
                <View style={styles.description}>
                  <Text style={styles.descriptionText}>
                    Would like to see the following information
                  </Text>
                </View>
                {this.state.isa &&
                  <View>
                    {this.state.isa.required_entities.map(entity => {
                      this.shared = []
                      console.log('this.shared', JSON.stringify(this.shared))
                      let component = null

                      this.state.resources.forEach(resource => {
                        console.log('resource', JSON.stringify(resource))
                        const result = this.tryResource(entity, resource)

                        console.log('IF RESULT% %', result)
                        if (result) {
                          component = result
                        }
                      })

                      if (component) {
                        return component
                      }

                      missing.push(entity)
                    })}
                  </View>
                }
                {missing.length > 0 &&
                  <View style={styles.missingItems}>
                    {missing.map((entity, i) => {
                      return (
                        <Touchable key={i} onPress={() => this.onPressMissing(entity.address, null)}>
                          <Text style={styles.missingItemsText}>
                            You are missing {entity.name}.
                          </Text>
                        </Touchable>
                      )
                    })}
                  </View>
                }
                {missing.length < 1 &&
                  <Touchable onPress={this.onBoundPressShare}>
                    <View style={styles.shareView}>
                      <HexagonIcon width={100} height={100} textSize={19} textX={30} textY={43} text="Share" />
                    </View>
                  </Touchable>
                }
                <View style={styles.meta}>
                  {/* TODO: This stuff needs to ACTUALLY WORK
                  <View>
                    <View style={styles.metaItem}>
                      <PeriodIcon width={13} height={13} stroke="#666" />
                      <Text style={styles.metaItemText}>{" "} 12 Months {"  "}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <LocationIcon width={13} height={13} stroke="#666" />
                      <Text style={styles.metaItemText}>{" "} In SA {"  "}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <MarketingIcon width={13} height={13} stroke="#666" />
                      <Text style={styles.metaItemText}>{" "} Marketing</Text>
                    </View>
                  </View>
                  */}
                </View>
              </ScrollView>
            </View>
          </View>
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

  tryResource(entity, resource) {
    console.log('SOEMTHING OBVIOUSOFJ', this.i++)
    // check for http prefix
    if (entity.address.indexOf('http://') === 0) {
      entity.address = entity.address.slice(7)
    }

    if (resource.schema.indexOf('http://') === 0) {
      resource.schema = resource.schema.slice(7)
    }

    if (entity.address === resource.schema) {
      const swappable = this.swaps["_" + resource.id]
      console.log("SWAPPABLE (RESOURCE)", swappable)

      if (swappable) {
        const result = this.tryResource(entity, swappable)
        console.log("SWAPPING", result)

        if (result) {
          this.shared.push(swappable.id)
          return result
        }
      }

      this.shared.push(resource.id)
      return this.renderResource(resource)
    }

    const parts = entity.address.split("/")
    const last = parts.pop()
    const rest = parts.join("/")
    const value = JSON.parse(resource.value)

    if (rest === resource.schema
    // && value[last].trim() !== ""
    ) {
      const swappable = this.swaps["_" + resource.id]
      // console.log("SWAPPABLE (PARTIAL RESOURCE)", swappable)

      if (swappable && this.state.isa.required_entities.length > 1) {
        const result = this.tryResource(entity, swappable)
        // console.log("SWAPPING", result)

        if (result) {
          this.shared.push(swappable.id)
          return result
        }
      }

      this.shared.push(resource.id)
      return this.renderPartialResource(resource, last)
    }
  }

  renderResource(resource) {
    return (
      <InformationRequestResource key={resource.id} title={resource.alias} onPress={() => this.onSwap(resource)}>
        <Text style={styles.itemText}>
          <Text style={styles.foundText}>
            {/* customise this for different resource types */}
            {
              Object.values(
                JSON.parse(resource.value)
              ).filter(x => x && x.length && x.length < 50).join(', ')
            }
          </Text>
        </Text>
      </InformationRequestResource>
    )
  }

  renderPartialResource(resource, key) {
    return (
      <InformationRequestResource key={resource.id} title={resource.alias} onPress={() => this.onSwap(resource, key)}>
        <Text style={styles.itemText}>
          <Text style={styles.foundText}>{JSON.parse(resource.value)[key]}</Text>
        </Text>
      </InformationRequestResource>
    )
  }
}

const styles = {
  content: {
    flex: 1,
    backgroundColor: "#323a43"
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
