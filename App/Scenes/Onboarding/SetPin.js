import React from "react"
import { Text, View, StyleSheet, TextInput, Keyboard, Animated, Platform } from "react-native"
import { Container, Content, Grid, Col, Row } from "native-base"

import Scene from "../../Scene"
import Routes from "../../Routes"
import BackButton from "../../Components/BackButton"
import Dots from "../../Components/Dots"

class SetPin extends Scene {
  constructor(...params) {
    super(...params)

    this.state = {
      "screenHeight": this.props.screenHeight,
      "keyboardVisible": false,
      "characters": ""
    }

    this.onFocus = this.onFocus.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onKeyboardWithShow = this.onKeyboardWithShow.bind(this)
    this.onKeyboardDidHide = this.onKeyboardDidHide.bind(this)
  }

  onFocus(event) {
    this.refs.input.focus()
  }

  onChangeText(text) {
    this.setState({
      characters: text
    })
    setTimeout(() => {
      if (this.state.characters.length >= 5) {
        this.onSubmit()
      }
    }, 250)
  }

  onSubmit() {
    if (!this.submitted) {
      this.submitted = true
      this.navigator.push(Routes.onboarding.locked)
    }
    Keyboard.dismiss()
  }

  onKeyboardWithShow(event) {
    const change = event.endCoordinates.height

    this.setState({
      "screenHeight": this.props.screenHeight - change,
      "keyboardVisible": true
    }, () => {
      this.forceUpdate()
    })
  }

  onKeyboardDidHide(event) {
    this.setState({
      "screenHeight": this.props.screenHeight,
      "keyboardVisible": false
    }, () => {
      this.forceUpdate()
    })
  }

  componentWillReceiveProps(props) {
    super.componentWillReceiveProps()
    this.setState({
      "screenHeight": this.props.screenHeight
    })
  }

  componentDidMount() {
    super.componentDidMount()
    this.keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", this.onKeyboardWithShow)
    this.keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", this.onKeyboardDidHide)
  }

  componentWillUnmount() {
    super.componentWillUnmount()
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  render() {
    return (
      <Container onTouchStart={this.onFocus} style={[style.container]}>
        <BackButton navigator={this.navigator} />
        <Content>
          <Grid>
            <Col style={[style.col, {"height": this.state.screenHeight}]}>
              <Row style={[style.firstRow]}>
                <Text style={[style.firstText]}>
                  Create a 5-digit {"\n"} key PIN.
                </Text>
              </Row>
              <Row style={[style.secondRow]}>
                <Text style={[style.secondText]}>
                  Your key will secure your valuable {"\n"} personal information with bank-grade {"\n"} encryption
                </Text>
              </Row>
              <Row style={[style.thirdRow]}>
                {/* need a component for the hexagon of dots */}
              </Row>
              <Row style={[style.fourthRow]}>
                <View>
                  <Dots current={this.state.characters.length} />
                  <TextInput
                    ref="input"
                    autoFocus={true}
                    returnKeyType="done"
                    keyboardType="phone-pad"
                    onChangeText={(text) => this.onChangeText(text)}
                    style={[style.input]}
                  />
                </View>
              </Row>
            </Col>
          </Grid>
        </Content>
      </Container>
    )
  }
}

const textStyle = {
  "textAlign": "center",
  "fontFamily": Platform.select({
    "ios": "Helvetica",
    "android": "Arial"
  }),
  "fontWeight": "300"
}

const style = StyleSheet.create({
  "container": {
    "backgroundColor": "#f9fafa"
  },
  "col": {
    "flexDirection": "column"
  },
  "firstRow": {
    "alignItems": "center",
    "justifyContent": "center",
    "paddingTop": 40
  },
  "firstText": Object.assign(Object.create(textStyle), {
    "color": "#4b5359",
    "fontSize": 30
  }),
  "secondRow": {
    "alignItems": "center",
    "justifyContent": "center"
  },
  "secondText": Object.assign(Object.create(textStyle), {
    "color": "#a2acb2",
    "fontSize": 16
  }),
  "thirdRow": {
    "alignItems": "center",
    "justifyContent": "center"
  },
  "fourthRow": {
    "alignItems": "center",
    "justifyContent": "center"
  },
  "input": {
    "position": "absolute",
    "top": -1000
  }
})

export default SetPin
