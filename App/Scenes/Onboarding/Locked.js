import React from 'react'
import { Text, View, StyleSheet, Platform } from 'react-native'
import { Container, Content, Grid, Col, Row } from 'native-base'

import Scene from '../../Scene'
import Routes from '../../Routes'
import BackButton from '../../Components/BackButton'
import Touchable from '../../Components/Touchable'

class Locked extends Scene {
  constructor(props) {
    super(props)

    this.onPressUnlock = this.onPressUnlock.bind(this)
    this.onPressHelp = this.onPressHelp.bind(this)
    this.onPressNewKeyPin = this.onPressNewKeyPin.bind(this)
  }

  onPressUnlock(event) {
    this.navigator.push(Routes.onboarding.unlock)
  }

  onPressHelp(event) {
  }

  onPressNewKeyPin(event) {
    alert("new key pin")
  }

  render() {
    return (
      <Container onTouchStart={this.onFocus} style={[style.container]}>
        <BackButton navigator={this.navigator} />
        <Content>
          <Grid>
            <Col style={[style.col, { "height": this.props.screenHeight }]}>
              <Row style={[style.firstRow]}>
                <View>
                  <Text style={[style.firstText]}>Locked!</Text>
                </View>
              </Row>
              <Row style={[style.secondRow]}>
                <View>
                  <Text style={[style.secondText]}>
                    Your valuable personal information {"\n"} is now secured.
                  </Text>
                </View>
              </Row>
              <Row style={[style.thirdRow]}>
                <View>
                  <Touchable onPress={this.onPressUnlock}>
                    <View>
                      <Text>Unlock</Text>
                    </View>
                  </Touchable>
                </View>
              </Row>
              <Row>
                <Touchable onPress={this.onPressHelp}>
                  <View style={[style.help]}>
                    <Text>help</Text>
                  </View>
                </Touchable>
                <Touchable onPress={this.onPressNewKeyPin}>
                  <View style={[style.newKeyPin]}>
                    <Text>new key pin</Text>
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
  textAlign: "center",
  fontFamily: Platform.select({
    ios: "Helvetica",
    android: "Arial"
  }),
  fontWeight: "300"
}

const style = StyleSheet.create({
  container: {
    backgroundColor: "#eceeee"
  },
  col: {
    flexDirection: "column"
  },
  firstRow: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60
  },
  firstText: Object.assign(Object.create(textStyle), {
    color: "#4b5359",
    fontSize: 30
  }),
  secondRow: {
    alignItems: "center",
    justifyContent: "center"
  },
  secondText: Object.assign(Object.create(textStyle), {
    color: "#a9b2b7",
    fontSize: 16
  }),
  thirdRow: {
    alignItems: "center",
    justifyContent: "center"
  },
  fourthRow: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  },
  help: {
    alignItems: "center",
    justifyContent: "center",
    width: "50%"
  },
  newKeyPin: {
    alignItems: "center",
    justifyContent: "center",
    width: "50%"
  }
})

export default Locked
