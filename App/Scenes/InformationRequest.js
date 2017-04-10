// external dependencies
import React from "react"
import { Text, View, ScrollView } from "react-native"
import { Container } from "native-base"

// internal dependencies
import BackButton from "../Components/BackButton"
import HelpIcon from "../Components/HelpIcon"
import InformationRequestResource from "../Components/InformationRequestResource"
import LocationIcon from "../Components/LocationIcon"
import MarketingIcon from "../Components/MarketingIcon"
import Scene from "../Scene"
import PeriodIcon from "../Components/PeriodIcon"
import Touchable from "../Components/Touchable"

class InformationRequest extends Scene {
  constructor(...params) {
    super(...params)

    this.onBoundPressDecline = this.onPressDecline.bind(this)
    this.onBoundPressHelp = this.onPressHelp.bind(this)
  }

  onPressDecline() {
    alert("decline")
  }

  onPressHelp() {
    alert("help")
  }

  render() {
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
                    Absa Bank
                  </Text>
                </View>
                <View style={styles.description}>
                  <Text style={styles.descriptionText}>
                    Would like to see the following information:
                  </Text>
                </View>
                <InformationRequestResource title="Legal Identity">
                  <Text style={styles.itemText}>
                    Jacques Noel Kleynhans, 8110231234567 {"\n"}
                    <Text style={styles.missingText}>Copy of ID</Text>.
                  </Text>
                </InformationRequestResource>
                <InformationRequestResource title="Home Address 1">
                  <Text style={styles.itemText}>
                    100 Palm Place, 45 Regent Street, Sea Point, Cape Town, 8005
                  </Text>
                </InformationRequestResource>
                <View style={styles.meta}>
                  <Text>
                    <Text style={styles.metaItem}>
                      <PeriodIcon width={13} height={13} stroke="#666" />{" "}
                      12 Months
                    </Text>{"  "}
                    <Text style={styles.metaItem}>
                      <LocationIcon width={13} height={13} stroke="#666" />{" "}
                      In SA
                    </Text>{"  "}
                    <Text style={styles.metaItem}>
                      <MarketingIcon width={13} height={13} stroke="#666" />{" "}
                      Marketing
                    </Text>
                  </Text>
                </View>
                <View style={styles.missingItems}>
                  <Text style={styles.missingItemsText}>
                    You are missing a photo of your Identity Document.
                    Please add one now.
                  </Text>
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
}

const styles = {
  "content": {
    "flex": 1,
    "backgroundColor": "#323a43"
    // "backgroundColor": "#fff"
  },
  "top": {
    "height": "14%"
  },
  "middle": {
    "height": "72%",
    "paddingLeft": 10,
    "paddingRight": 10
  },
  "middleBackground": {
    "flex": 1,
    "borderRadius": 10,
    "backgroundColor": "#f0f2f2",
    "shadowColor": "#000000",
    "shadowOpacity": 0.3,
    "shadowRadius": 5,
    "shadowOffset": {
      "height": 4,
      "width": 0
    }
  },
  "name": {
    "height": 60,
    "alignItems": "center",
    "justifyContent": "center",
    "paddingLeft": "20%",
    "paddingRight": "20%",
    "paddingTop": 20
  },
  "nameText": {
    "color": "#666",
    "fontSize": 17
  },
  "description": {
    "height": 50,
    "paddingLeft": "20%",
    "paddingRight": "20%"
  },
  "descriptionText": {
    "color": "#666",
    "fontSize": 15,
    "textAlign": "center"
  },
  "itemText": {
    "color": "#666"
  },
  "missingText": {
    "color": "#ff5d62"
  },
  "meta": {
    "flex": 1,
    "flexDirection": "row",
    "justifyContent": "center",
    "alignItems": "center",
    "marginTop": 10
  },
  "metaItem": {
    "color": "#666"
  },
  "missingItems": {
    "backgroundColor": "#ff2b33",
    "padding": 15,
    "margin": 15,
    "borderRadius": 8
  },
  "missingItemsText": {
    "color": "#fff"
  },
  "bottom": {
    "height": "14%",
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
  }
}

export default InformationRequest
