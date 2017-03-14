import React from "react"
import { Text, View, StyleSheet, TextInput, Keyboard, Animated, Platform } from "react-native"
import { Container, Content, Grid, Col, Row } from "native-base"

import Scene from "../../Scene"
import Routes from "../../Routes"
import BackButton from "../../Components/BackButton"
import Touchable from "../../Components/Touchable"
import Dots from "../../Components/Dots"

class Unlocked extends Scene {
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
    this.onKeyboardWillHide = this.onKeyboardWillHide.bind(this)
    this.onPressForgot = this.onPressForgot.bind(this)
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
      this.navigator.push(Routes.onboarding.unlocked)
    }
    Keyboard.dismiss()
  }

  onKeyboardWithShow(event) {
    const change = event.endCoordinates.height

    this.setState({
      "screenHeight": this.props.screenHeight - change,
      "keyboardVisible": true
    })
  }

  onKeyboardWillHide(event) {
    this.setState({
      "screenHeight": this.props.screenHeight,
      "keyboardVisible": false
    })
  }

  onPressForgot(event) {
    alert("forgot")

    event.preventDefault()
    event.stopPropagation()
  }

  componentWillReceiveProps(props) {
    this.setState({
      "screenHeight": this.props.screenHeight
    })
  }

  componentDidMount() {
    super.componentDidMount()
    this.keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", this.onKeyboardWithShow)
    this.keyboardWillHideListener = Keyboard.addListener("keyboardWillHide", this.onKeyboardWillHide)
  }

  componentWillUnmount() {
    super.componentWillUnmount()
    this.keyboardDidShowListener.remove()
    this.keyboardWillHideListener.remove()
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
                  Unlock
                </Text>
              </Row>
              <Row style={[style.secondRow]}>
                <Text style={[style.secondText]}>
                  Enter your 5-digit key PIN.
                </Text>
              </Row>
              <Row style={[style.thirdRow]}>
                <Touchable onPress={this.onPressForgot}>
                  <View>
                    <Text style={[style.thirdText]}>
                      I forgot
                    </Text>
                  </View>
                </Touchable>
              </Row>
              <Row style={[style.fourthRow]}>
                {/* need a component for the hexagon of dots */}
              </Row>
              <Row style={[style.fifthRow]}>
                <View>
                  <Dots
                    current={this.state.characters.length}
                    strokeColor="#3f484e"
                    fullFill="#3f484e"
                    emptyFill="#eceeee"
                  />
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
    "backgroundColor": "#eceeee"
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
  "thirdText": Object.assign(Object.create(textStyle), {
    "color": "#3f8efa",
    "fontSize": 16
  }),
  "input": {
    "position": "absolute",
    "top": -1000
  }
})

export default Unlocked
