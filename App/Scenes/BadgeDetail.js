// external dependencies
import React from "react"
import { Text, View, ScrollView } from "react-native"
import { Container } from "native-base"

// internal dependencies
import BackButton from "../Components/BackButton"
import HelpIcon from "../Components/HelpIcon"
import Scene from "../Scene"
import Touchable from "../Components/Touchable"

class BadgeDetail extends Scene {
  constructor(...params) {
    super(...params)

    this.onBoundPressBack = this.onPressBack.bind(this)
    this.onBoundPressHelp = this.onPressHelp.bind(this)
  }

  onPressBack() {
    alert("go back")
  }

  onPressHelp() {
    alert("help")
  }

  render() {
    return (
      <Container>
        <BackButton navigator={this.navigator} />
        <View style={styles.content}>
          {/*<HelpIcon width={24} height={24} stroke="#666" />*/}
        </View>
      </Container>
    )
  }
}

const styles = {
  "content": {
    "backgroundColor": "#fff"
  }
}

export default BadgeDetail
