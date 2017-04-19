// external dependencies
import React from "react"
import { Text, View } from "react-native"
import { Container } from "native-base"

// internal dependencies
import BackButton from "../Components/BackButton"
import BackIcon from "../Components/BackIcon"
import Design from "../DesignParameters"
import Palette from "../Palette"
import Scene from "../Scene"
import LifekeyHeader from "../Components/LifekeyHeader"
import Touchable from "../Components/Touchable"
import Button from "../Components/Button"

var routeParams = {
  result: false
}

class FaceMatchResult extends Scene {
  constructor(...params) {
    super(...params)

    this.onBoundPressContinue = this.onPressContinue.bind(this)
  }

  onPressContinue() {
    alert("continue")
  }

  matchResult() {
    if(routeParams.result)
      return(
        <View style={styles.resultContainer}>
          <View style={styles.title}>
            <Text style={styles.titleText}>Matched!</Text>
          </View>
          <View style={styles.image}>
            {/* Image goes here */}
            <Text>+</Text>
          </View>
        </View>
      )
    else
      return(
        <View style={styles.resultContainer}>
          <View style={styles.title}>
            <Text style={styles.titleText}>This is awkward...</Text>
          </View>
          <View style={styles.image}>
            {/* Image goes here */}
            <Text>-</Text>
          </View>
        </View>
      )
  }

  render() {
    return (
      <Container style={styles.container}>
        <View style={styles.content}>
          <View style={styles.resultContainer}> 
            { this.matchResult() }
          </View>   
          <View style={styles.copyContainer}>
            <Text style={styles.copyText}>Thank you for your response</Text>
          </View>
          <View style={styles.actions}>
            <Button affirmative={true} buttonText={"Continue"} onClick={this.onBoundPressContinue} />
          </View>
        </View>
      </Container>
    )
  }
}

const styles = {
  "container":{
    "backgroundColor": Palette.consentGrayLight,
    "justifyContent": "center",
    "alignItems": "center"
  },
  "content": {
    "flex": 1,
    "width": "75%",
    "justifyContent": "space-between"
  },
  "resultContainer":{
    flex: 2
  },
  "title":{
    "flex": 1,
    "justifyContent": "center",
    "alignItems": "center"
  },
  "titleText": {
    "fontSize": 28,
    "color": Palette.consentBlue,
    "fontWeight": "300"
  },
  "image":{
    "flex": 1,
    "justifyContent": "center",
    "alignItems": "center",
  },
  "copyContainer":{
    "flex": 1,
    "justifyContent": "center",
    "alignItems": "center"
  },
  "copyText": {
    "fontSize": 16,
    "color": Palette.consentGrayDark,
    "textAlign": "center",
    "fontWeight": "300"
  },
  "actions":{
    "flex": 1,
    "flexDirection": "row",
    "justifyContent": "center",
    "alignItems": "flex-start"
  }
}

export default FaceMatchResult
