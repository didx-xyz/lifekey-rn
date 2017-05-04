// external dependencies
import React, { Component } from "react"
import { ScrollView, View, Text, TextInput } from "react-native"
import { Container } from "native-base"

// internal dependencies
import Api from "../../Api"
import Session from "../../Session"
import Routes from "../../Routes"
import Scene from "../../Scene"
import Touchable from "../../Components/Touchable"
import { request } from "../../Requests"
import Logger from '../../Logger'

class DebugListIsas extends Scene {
  constructor(...params) {
    super(...params)

    this.state = {
      "isas": []
    }
  }

  componentDidMount() {
    Api.allISAs().then(data => {
      this.setState({ "isas": data.body.unacked })
    }).catch(error => { Logger.warn(error) })
  }

  render() {
    return (
      <Container>
        <ScrollView style={styles.scroll}>
          {this.state.isas.map((isa, i) => {
            return (
              <Touchable key={i} onPress={() => {
                  Session.update({
                    "currentIsa": isa
                  })

                  this.navigator.push(Routes.informationRequest)
              }}>
                <View>
                  <Text>{isa.id}</Text>
                </View>
              </Touchable>
            )
          })}
        </ScrollView>
      </Container>
    )
  }
}

const styles = {
  "content": {
    "backgroundColor": "#323a43"
  },
  "scroll": {
    "padding": 10
  }
}

export default DebugListIsas
