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
          <View style={styles.navigation}>
            <View >
              <Touchable onPress={this.onBoundPressBack}>
                <Text>{'<'}</Text>
              </Touchable>
            </View>
            <View>
              <Touchable onPress={this.onBoundPressHelp}>
                <HelpIcon width={24} height={24} stroke="#666" />
              </Touchable>
            </View>
          </View>

          <ScrollView style={styles.scrollableContent}>
            <View style={styles.brand}>
              <View style={styles.brandImage}>
                {/* image here */}
                <Text>+</Text>
              </View>
              <View>
                <Text style={Object.assign({}, styles.serviceName, styles.lighter)}>Absa RICA</Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.brandName}>by</Text>
                <Text style={Object.assign({}, styles.brandName, styles.bold)}> Absa Bank</Text>
              </View>
              <View style={styles.brandDescriptionView}>
                <Text style={styles.brandDescription}>Description of a badge The next few sections will gradually introduce you to Absa.</Text>
              </View>
            </View>
            <View style={styles.headingView}>
              <Text style={styles.headingText}>LEGAL IDENTITY</Text>
            </View>
            <View style={styles.listCard}>
              <View style={styles.listImage}>
                {/* image here */}
                <Text>+</Text>
              </View>
              <View style={styles.listBody}>
                <Text style={styles.listBodyTitle}>Jacques Noel Kleynhans</Text>
                <Text style={styles.listBodySubtitle}>South African ID</Text>
                <Text style={styles.listBodyContent}>8110115064082</Text>
              </View>
            </View>
            <View style={styles.headingView}>
              <Text style={styles.headingText}>HOME ADDRESS</Text>
            </View>
            <View style={styles.addressImage}>
              {/* image here */}
              <Text>+</Text>
            </View>
            <View style={styles.headingView}>
              <Text style={styles.headingText}>CONTACT DETAILS</Text>
            </View>
            <View style={styles.listCard}>
              <View style={styles.listImage}>
                {/* image here */}
                <Text>+</Text>
              </View>
              <View style={styles.listBody}>
                <Text style={styles.listBodySubtitle}>Mobile</Text>
                <Text style={styles.listBodyContent}>+27 (078) 964 5567</Text>
              </View>
            </View>
            <View style={styles.listCard}>
              <View style={styles.listImage}>
                {/* image here */}
                <Text>+</Text>
              </View>
              <View style={styles.listBody}>
                <Text style={styles.listBodySubtitle}>Home</Text>
                <Text style={styles.listBodyContent}>+27 (021) 424 5678</Text>
              </View>
            </View>
            <View style={styles.listCard}>
              <View style={styles.listImage}>
                {/* image here */}
                <Text>+</Text>
              </View>
              <View style={styles.listBody}>
                <Text style={styles.listBodySubtitle}>Email</Text>
                <Text style={styles.listBodyContent}>jacques@io.co.za</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </Container>
    )
  }
}

const navigationHeight = 12.5

const darkgray = '#353d43'
const gray = '#666'
const lightgray = '#999'

const paddingTop = 15;
const paddingRight = 20;
const paddingBottom = 15;
const paddingLeft = 20;

const styles = {
  "content": {
    "backgroundColor": "#fff",
    "paddingBottom": paddingBottom * 2
  },
  "scrollableContent": {
    // "height": `${100 - navigationHeight}%`
  },
  "navigation": {
    "width": "100%",
    "height": `${navigationHeight}%`,
    "paddingRight": paddingRight,
    "paddingLeft": paddingLeft,
    "flexDirection": "row",
    "justifyContent": "space-between",
    "alignItems": "center"
  },
  "brand": {
    "flexDirection": "column",
    "justifyContent": "center",
    "alignItems": "center",
    "paddingBottom": paddingBottom
  },
  "brandImage": {
    "width": 100,
    "height": 100,
    "justifyContent": "center",
    "alignItems": "center",
    "backgroundColor": lightgray
  },
  "serviceName": {
    "fontSize": 25,
    "color": "#666",
    "paddingTop": paddingTop,
  },
  "brandName": {
    "fontSize": 10,
    "color": gray,
    "paddingTop": paddingTop
  },
  "brandDescriptionView": {
    "width": "70%",
  },
  "brandDescription": {
    "fontSize": 12,
    "color": gray,
    "textAlign": "center",
    "paddingTop": paddingTop
  },
  "headingView":{
    "paddingLeft": 20,
    "paddingTop": paddingTop,
    "paddingBottom": paddingBottom
  },
  "headingText":{
    "fontSize": 10,
    "color": darkgray,
    "fontWeight": "bold"
  },
  "listCard":{
    "width": "100%",
    "height": 80,
    "paddingRight": paddingRight,
    "paddingLeft": paddingLeft,
    "flexDirection": "row"
  },
  "listImage":{
    "flex": 1,
    "height": "100%",
    "marginRight": paddingRight,
    "justifyContent": "space-around",
    "alignItems": "center",
    "backgroundColor": lightgray
  },
  "listBody":{
    "flex": 4,
    "justifyContent": "space-around",  
    "paddingTop": 5,
    "paddingBottom": 5, 
  },
  "listBodyTitle":{
    "fontSize": 16,
    "color": darkgray
  },
  "listBodySubtitle":{
    "fontSize": 10,
    "color": lightgray
  },
  "listBodyContent":{
    "fontSize": 25,
    "color": gray
  },
  "addressImage": {
    "flexDirection": "row",
    "height": 150,
    "justifyContent": "center",
    "alignItems": "center",
    "marginRight": paddingRight / 2,
    "marginLeft": paddingLeft / 2,
    "backgroundColor": lightgray
  },
  "textContainer": {
    "flexDirection": "row"
  },
  "bold": {
    "fontWeight": "bold"
  },
  "lighter": {
    "fontWeight": "300",
  }
  
}

export default BadgeDetail
