import React from 'react'
import {
  View,
  Text
} from 'react-native'
import Scene from '../Scene'
import * as NB from 'native-base'
const t = require('tcomb-form-native')
const Form = t.form.Formrequire

export default class DisplayForm extends Scene {

  constructor(props) {
    super(props)
    this.state = {
      formData: props.route.formData,
      parsable: null,
      loaded: true
    }
  }

  componentWillMount() {

  }

  render() {
    if (this.state.loaded) {
      return (
        <View>
          <Text>{ JSON.stringify(this.state.formData) }</Text>
        </View>
      )
    } else {
      return (<Text>Processing data...</Text>)
    }
  }
}
