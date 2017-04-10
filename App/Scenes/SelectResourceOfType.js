// external dependencies
import React from "react"
import { Text, View, ScrollView } from "react-native"
import { Container } from "native-base"

// internal dependencies
import BackButton from "../Components/BackButton"
import InformationRequestResource from "../Components/InformationRequestResource"
import Scene from "../Scene"
import Touchable from "../Components/Touchable"

class SelectResourceForType extends Scene {
  constructor(...params) {
    super(...params)
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
            <Touchable onPress={() => alert("selected")}>
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
            </Touchable>
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
