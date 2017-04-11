// external dependencies
import React from "react"
import { Text, View, ScrollView } from "react-native"
import { Container } from "native-base"

// internal dependencies
import BackButton from "../Components/BackButton"
import HelpIcon from "../Components/HelpIcon"
import Scene from "../Scene"
import Touchable from "../Components/Touchable"

class Messages extends Scene {
  constructor(...params) {
    super(...params)

    this.onBoundPressActivity = this.onPressActivity.bind(this)
    this.onBoundPressHelp = this.onPressHelp.bind(this)
    this.onBoundPressDone = this.onPressDone.bind(this)
  }

  onPressActivity() {
    alert("go to activity")
  }

  onPressHelp() {
    alert("help")
  }

  onPressDone() {
    alert("done")
  }

  render() {
    return (
      <Container>
        <BackButton navigator={this.navigator} />
        <View style={styles.content}>
          <View style={styles.top}>
            <View style={styles.topLeft}>
              <Text style={styles.topLeftText}>MESSAGES</Text>
            </View>
            <View style={styles.topRight}>
              <Touchable onPress={this.onBoundPressActivity}>
                <Text style={styles.topRightText}>ACTIVITY</Text>
              </Touchable>
            </View>
          </View>
          <ScrollView style={styles.middle}>

            <View style={styles.message}>
              <View style={styles.messageImage}>
                {/* image here */}
                <Text>+</Text>
              </View>
              <View style={styles.messageContent}>
                <View style={styles.messageDescription}>
                  <Text style={styles.messageDescriptionText}>
                    <Text style={styles.bold}>Vodacom</Text>
                    <Text> shared data with you</Text>
                  </Text>
                </View>
                <View style={styles.messageMeta}>
                  <Text style={styles.messageMetaText}>
                    18 Sep 2016
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.message}>
              <View style={styles.messageImage}>
                {/* image here */}
                <Text>+</Text>
              </View>
              <View style={styles.messageContent}>
                <View style={styles.messageDescription}>
                  <Text style={styles.messageDescriptionText}>
                    <Text style={styles.bold}>Woolworths</Text>
                    <Text> is requesting access to information</Text>
                  </Text>
                </View>
                <View style={styles.messageMeta}>
                  <Text style={styles.messageMetaText}>
                    Yesterday
                  </Text>
                </View>
              </View>
            </View>

          </ScrollView>
          <View style={styles.bottom}>
            <View style={styles.bottomLeft}>
              <Touchable onPress={this.onBoundPressHelp}>
                <HelpIcon width={24} height={24} stroke="#666" />
              </Touchable>
            </View>
            <View style={styles.bottomRight}>
              <Touchable onPress={this.onBoundPressDone}>
                <Text style={styles.bottomRightText}>Done</Text>
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
    "backgroundColor": "#fff"
  },
  "bold": {
    "fontWeight": "bold"
  },
  "top": {
    "width": "100%",
    "height": "13%",
    "flexDirection": "row",
    "justifyContent": "space-between"
  },
  "topLeft": {
    "paddingTop": 30,
    "paddingRight": 45,
    "paddingBottom": 30,
    "paddingLeft": 45
  },
  "topLeftText": {
    "color": "#1e76ff",
    "fontSize": 12,
    "fontWeight": "bold"
  },
  "topRight": {
    "paddingTop": 30,
    "paddingRight": 45,
    "paddingBottom": 30,
    "paddingLeft": 45
  },
  "topRightText": {
    "color": "#999",
    "fontSize": 12,
    "fontWeight": "bold"
  },
  "middle": {
    "width": "100%",
    "height": "74%",
    "flexDirection": "column"
  },
  "message": {
    "flex": 1,
    "flexDirection": "row",
    "padding": 15
  },
  "messageImage": {
    "width": 30,
    "justifyContent": "center",
    "alignItems": "center"
  },
  "messageContent": {
    "flex": 1
  },
  "messageDescriptionText": {
    "fontSize": 13,
    "color": "#666"
  },
  "messageMetaText": {
    "fontSize": 11,
    "color": "#999"
  },
  "bottom": {
    "width": "100%",
    "height": "13%",
    "flexDirection": "row",
    "justifyContent": "space-between"
  },
  "bottomLeft": {
    "paddingTop": 30,
    "paddingRight": 45,
    "paddingBottom": 30,
    "paddingLeft": 45
  },
  "bottomRight": {
    "paddingTop": 30,
    "paddingRight": 45,
    "paddingBottom": 30,
    "paddingLeft": 45
  },
  "bottomRightText": {
    "color": "#666"
  }
}

export default Messages
