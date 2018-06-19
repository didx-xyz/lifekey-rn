// external dependencies
import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import SafeAreaView from './react-native-safe-area-view';
import { Container, Header, Content, Button, Icon, Text } from 'native-base';

class BackButton extends Component {
  constructor(props) {
    super(props);

    this.onPress = this.onPress.bind(this);
    this.showButton = props.navigator.getCurrentRoutes().length === 1;
  }

  onPress() {
    console.log('>>>>>>', this.props.navigator.getCurrentRoutes().length);
    if (this.props.onPress) {
      return this.props.onPress();
    }

    const navigator = this.props.navigator;
    navigator.pop.call(navigator);

    return true;
  }

  render() {
    if (this.showButton) {
      return null;
    }
    return (
      <SafeAreaView
        style={{
          ...StyleSheet.absoluteFillObject,
          bottom: undefined,
          right: undefined,
          width: 44,
          height: 60,
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1
        }}
      >
        <TouchableOpacity onPress={this.onPress}>
          <Icon
            style={{
              fontSize: 30,
              backgroundColor: 'transparent',
              color: this.props.color || 'black'
            }}
            name="arrow-back"
          />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

BackButton.propTypes = {
  onPress: PropTypes.func
};

export default BackButton;
