// external dependencies
import React from "react"
import { Text, View, ScrollView } from "react-native"
import { Container } from "native-base"

// internal dependencies
import BackButton from "../Components/BackButton"
import Scene from "../Scene"
import Palette from "../Palette"
import LifekeyHeader from "../Components/LifekeyHeader"
import Touchable from "../Components/Touchable"

class Badges extends Scene {
  constructor(...params) {
    super(...params)

    this.state = {
      "activeTab": 2 // badges
    }

    this.onBoundPressConnect = this.onPressConnect.bind(this)
    this.onBoundPressMyData = this.onPressMyData.bind(this)
    this.onBoundPressBadges = this.onPressBadges.bind(this)
  }

  onPressConnect() {
    alert("go to connect")
  }

  onPressMyData() {
    alert("go to my data")
  }

  onPressBadges() {
    console.log("do nothing")
  }

  render() {
    return (
      <Container>
        <View style={styles.header}>
          <BackButton navigator={this.navigator} />
          <LifekeyHeader
            icons={[
              <Text>Test1</Text>,
              <Text>Test2</Text>,
              <Text>Test3</Text>
            ]}
            tabs={[
              { "text": "Connect", "onPress": this.onBoundPressConnect },
              { "text": "My Data", "onPress": this.onBoundPressMyData },
              { "text": "Badges", "onPress": this.onBoundPressBadges }
            ]}
          />
        </View>
        <ScrollView style={styles.content}>
          <View style={styles.badge}>
            <View style={styles.badgeImage}>
              {/* badge image here */}
              <Text>+</Text>
            </View>
            <View style={styles.badgeContent}>
              <View style={styles.badgeName}>
                <Text style={styles.badgeNameText}>
                  Absa RICA
                </Text>
              </View>
              <View style={styles.badgeDescription}>
                <Text style={styles.badgeDescriptionText}>
                  Complete RICA documentation with verification from Absa Bank.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.badge}>
            <View style={styles.badgeImage}>
              {/* badge image here */}
              <Text>+</Text>
            </View>
            <View style={styles.badgeContent}>
              <View style={styles.badgeName}>
                <Text style={styles.badgeNameText}>
                  LifeLock
                </Text>
              </View>
              <View style={styles.badgeDescription}>
                <Text style={styles.badgeDescriptionText}>
                  Get a trust score of 4.5 or higher on the LifeKey platform.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.badge}>
            <View style={styles.badgeImage}>
              {/* badge image here */}
              <Text>+</Text>
            </View>
            <View style={styles.badgeContent}>
              <View style={styles.badgeName}>
                <Text style={styles.badgeNameText}>
                  ThisIsMe Verified
                </Text>
              </View>
              <View style={styles.badgeDescription}>
                <Text style={styles.badgeDescriptionText}>
                  Complete all required fields to get a trustworthy verification from ThisIsMe.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </Container>
    )
  }
}

const styles = {
  "header": {
    "borderColor": Palette.consentGrayDark,
    "borderBottomWidth": 3,
    "height": 120
  },
  "content": {
    "backgroundColor": "#eee"
  },
  "badge": {
    "flex": 1,
    "flexDirection": "row",
    "margin": 15,
    "marginBottom": 0,
    "paddingBottom": 15,
    "borderBottomWidth": 2,
    "borderBottomColor": "#ddd"
  },
  "badgeImage": {
    "width": 80,
    "justifyContent": "center",
    "alignItems": "center"
  },
  "badgeContent": {
    "flex": 1,
    "flexDirection": "column"
  },
  "badgeName": {
    "flex": 1
  },
  "badgeNameText": {
    "fontWeight": "bold",
    "color": "#333"
  },
  "badgeDescription": {
    "flex": 1
  },
  "badgeDescriptionText": {
    "color": "#666"
  }
}

export default Badges
