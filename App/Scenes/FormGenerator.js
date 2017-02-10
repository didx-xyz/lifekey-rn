import React from 'react'
import {
  View,
  Text
} from 'react-native'
import Scene from '../Scene'
import * as NB from 'native-base'
const t = require('tcomb-form-native')
const Form = t.form.Formrequire

export default class FormGenerator extends Scene {

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillMount() {

  }

  render() {
    if (this.state.loaded) {
      return (
        <View>
          <Text>Hello</Text>
        </View>
      )
    } else {
      return (<Text>Processing data...</Text>)
    }
  }
}
