import React from "react"
import { Text, View, StyleSheet, Platform } from "react-native"
import { Container, Content, Grid, Col, Row } from "native-base"

import Scene from "../../Scene"
import Routes from "../../Routes"
import BackButton from "../../Components/BackButton"
import Touchable from "../../Components/Touchable"

class Locked extends Scene {
  constructor(...params) {
    super(...params)

    this.onPress = this.onPress.bind(this)
  }

  onPress(event) {
    this.navigator.push(Routes.onboarding.unlock)
  }

  render() {
    return (
      <Container onTouchStart={this.onFocus} style={[style.container]}>
        <BackButton navigator={this.navigator} />
        <Content>
          <Grid>
            <Col style={[style.col, {"height": this.props.screenHeight}]}>
              <Row>
                <Touchable onPress={this.onPress}>
                  <View>
                    <Text>Locked: go to unlock</Text>
                  </View>
                </Touchable>
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

})

export default Locked
