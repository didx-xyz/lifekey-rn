/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React from 'react'
import Scene from '../Scene'

import {
  Text,
  View,
  Animated,
  TouchableWithoutFeedback,
  PanResponder
} from 'react-native'

import {
  Container,
  Content
} from 'native-base'
import AndroidBackButton from 'react-native-android-back-button'

export default class Animation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pan: new Animated.ValueXY(), // inits to zero
    };
    this.state.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, {
        dx: this.state.pan.x, // x,y are Animated.Value
        dy: this.state.pan.y,
      }]),
      onPanResponderRelease: () => {
        Animated.spring(
          this.state.pan,         // Auto-multiplexed
          {toValue: {x: 0, y: 0}} // Back to zero
        ).start();
      },
    });
  }
  render() {
    return (
      <Animated.View
        {...this.state.panResponder.panHandlers}
        style={[this.state.pan.getLayout(),{flex: 1}]}>
        <View style={{ height: 100, width: 100, backgroundColor: 'blue', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 20, color: 'white'}}>:'(</Text>
        </View>
      </Animated.View>
    );
  }
}


  // render() {
  //   return (
  //     <View style={{flex: 1}}>
  //       <AndroidBackButton onPress={() => this._hardwareBackHandler()} />
  //       <Container>
  //         <Content>
  //           <TouchableWithoutFeedback onPress={() => this._animate()}>
  //             <Animated.View
  //               style={{
  //                 justifyContent: 'center',
  //                 alignItems: 'center',
  //                 flex: 1,
  //                 opacity: this.state.fadeAnim,
  //                 backgroundColor: 'red',
  //                 height: 200
  //               }}
  //             >
  //               <Text style={{ color: 'white' }}>Don't touch me :(</Text>
  //             </Animated.View>
  //           </TouchableWithoutFeedback>
  //           <Animated.View
  //             {...this.state.panResponder.panHandlers}
  //             style={[this.state.pan.getLayout(), { flex: 1, width: 200, height: 200, backgroundColor: 'blue' }]}>
  //             {this.props.children}
  //           </Animated.View>
  //         </Content>
  //       </Container>
  //     </View>
  //   )
  // }