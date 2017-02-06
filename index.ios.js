/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React, { Component } from 'react'
import {
  AppRegistry,
  Platform
} from 'react-native';
import Lifekey from './Lifekey'

export default class Lifekeyrn extends Component {

  render() {
    return (<Lifekey os={Platform.OS}/>)
  }
}

AppRegistry.registerComponent('Lifekeyrn', () => Lifekeyrn)

