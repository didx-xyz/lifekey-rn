// external dependencies
import React from "react"
import { Text, View, ScrollView } from "react-native"
import { Container } from "native-base"

// internal dependencies
import Session from "../Session"
import BackButton from "../Components/BackButton"
import InformationRequestResource from "../Components/InformationRequestResource"
import Scene from "../Scene"
import Touchable from "../Components/Touchable"

class SelectResourceForType extends Scene {
  constructor(...params) {
    super(...params)

    this.state = {
      "schema": null,
      "resources": [],
      "key": null
    }
  }

  componentDidMount() {
    const data = Session.getState()

    this.setState({
      "schema": data.swapSchema,
      "resources": data.swapResources,
      "key": data.swapKey
    })
  }

  onSelect(resource) {
    Session.update({
      "swapSchema": null,
      "swapResources": null,
      "swapKey": null,
      "swapTo": resource.id
    })

    this.navigator.pop()
  }

  render() {
    return (
      <Container>
        <BackButton navigator={this.navigator} />
        <View style={styles.content}>
          <ScrollView style={styles.scroll}>
            <Text style={styles.title}>
              Please select:
            </Text>
            {this.state.resources.map((resource, i) => {
              // console.log(resource.schema, this.state.schema)

              if (resource.schema === this.state.schema) {
                return (
                  <InformationRequestResource key={i} title={resource.alias} onPress={() => this.onSelect(resource)}>
                      <Text style={styles.itemText}>
                        {/* customise this for different resource types */}
                        {Object.values(JSON.parse(resource.value)).filter(v => v && v.length <= 25 && v.indexOf("http") !== 0).map((v, i) => {
                          if (i > 0) {
                            return (
                              <Text key={i}>
                                <Text>, </Text>
                                <Text key={i}>{v}</Text>
                              </Text>
                            )
                          }

                          return (
                            <Text key={i}>{v}</Text>
                          )
                        })}
                      </Text>
                  </InformationRequestResource>
                )
              }
            })}
            {/*<Touchable onPress={() => alert("selected")}>
              <InformationRequestResource title="Home Address 1" meta="(default)" action="edit" onAction={() => alert("edit")}>
                  <Text style={styles.itemText}>
                    100 Palm Place, 45 Regent Street, Sea Point, Cape Town, 8005
                  </Text>
              </InformationRequestResource>
            </Touchable>
            <Touchable onPress={() => alert("selected")}>
              <InformationRequestResource title="Home Address 2" action="edit" onAction={() => alert("edit")}>
                  <Text style={styles.itemText}>
                    222 Balderdash Drive, Lynwood Ridge, Pretoria, 1122
                  </Text>
              </InformationRequestResource>
            </Touchable>
            <Touchable onPress={() => alert("adding (from card)")}>
              <InformationRequestResource title="Add another home address" action="add" onAction={() => alert("adding (from action)")} />
            </Touchable>*/}
          </ScrollView>
        </View>
      </Container>
    )
  }
}

const styles = {
  "content": {
    "flex": 1,
    "flexDirection": "row",
    "backgroundColor": "#323a43",
    "paddingTop": 10,
    "paddingBottom": 80
  },
  "scroll": {
    "alignSelf": "flex-end"
  },
  "title": {
    "textAlign": "center",
    "color": "#fff"
  }
}

export default SelectResourceForType
