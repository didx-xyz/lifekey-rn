import React from "react"
import { Text, View, StyleSheet, Platform } from "react-native"
import { Container, Content, Grid, Col, Row } from "native-base"

import Scene from "../../Scene"
import BackButton from "../../Components/BackButton"
import Routes from "../../Routes"

class Unlocked extends Scene {
  constructor(...params) {
    super(...params)

  }

  render() {
    return (
      <Container onTouchStart={this.onFocus} style={[style.container]}>
        <BackButton navigator={this.navigator} />
        <Content>
          <Grid>
            <Col style={[style.col, {"height": this.props.screenHeight}]}>
              <Text>unlock</Text>
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

export default Unlocked
