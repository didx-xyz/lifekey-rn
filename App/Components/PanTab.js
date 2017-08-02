// external dependencies
import React, { Component } from "react"
import { Text, View, Image, ScrollView, Animated, InteractionManager, Dimensions, PanResponder, Easing } from "react-native"
import PropTypes from "prop-types"
import GestureView from 'react-native-gesture-view' // https://github.com/estate/react-native-gesture-view

// internal dependencies
import Design from "../DesignParameters"
import Palette from "../Palette"
import Touchable from "../Components/Touchable"

class PanTab extends Component {
  
  constructor(props) {
    super(props)

    this.state = {
      minusMargin: new Animated.Value(-(Dimensions.get('window').width*this.props.index)) //This could be tailored to take any position 
    }

    // console.log("PROPS: ", this.props)
  }

  componentDidMount() {
    console.log("PAN")
  }

  onScreenGesture(index) {

    const minusMargin = -(Dimensions.get('window').width*index) 

    if( index >= 0 && index <= this.props.length - 1 ){
      this.animateMargin(minusMargin)
      this.props.announceIndex(index)
    }
  }

  animateMargin(animatedValue) {
    
    //  Move
    Animated.timing(
      this.state.minusMargin,
      { toValue: animatedValue, duration: 200 }
    ).start()

  }

  bounceMargin(index){
    
    // const minusMargin = -50

    Animated.timing(
      this.state.minusMargin,
      {
        toValue: 100,
        easing: Easing.back,
        duration: 500,
      }                              
    ).start();
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!

        // gestureState.d{x,y} will be set to zero now
        console.log("onPanResponderGrant")
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}

        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
        console.log("onPanResponderMove: ", gestureState)
        Animated.event(
          [null, // ignore the native event
          // extract dx and dy from gestureState
          // like 'pan.x = gestureState.dx, pan.y = gestureState.dy'
          {dx: gestureState.moveX, dy: gestureState.moveY}
        ])
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
        console.log("onPanResponderRelease")
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
        console.log("onPanResponderTerminate")
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        console.log("onShouldBlockNativeResponder")
        return true;
      },
    });
  }

  render() {
    
    return(
      <GestureView
          style={ styles.gestureContainer }
          children={ this.renderScreens() }
          onSwipeRight={this.onScreenGesture.bind(this, ( this.props.index - 1 ))}
          onSwipeLeft={this.onScreenGesture.bind(this, ( this.props.index + 1 ))} />
    )
  }

  renderScreens() {
    return(

      <Animated.View style={ { 
                      "position": "absolute", 
                      "top": 0,
                      "left": 0,
                      "flexDirection": "row", 
                      "width": Dimensions.get('window').width*this.props.length, 
                      "height": "100%", 
                      "marginLeft": this.state.minusMargin } }>

        { 
          React.Children.map(this.props.children, (child, i) => {
            return (
              <View key={i} style={styles.innerContentContainer}>
                { child }
              </View>
            )
          })
        }    
        
      </Animated.View>  

    )
  }
}

const styles = {
  "gestureContainer": {
    "flex": 4,
    "alignItems": "stretch",
    "justifyContent": "center",
    "paddingRight": Design.paddingRight,
    "paddingLeft": Design.paddingLeft,
    "flexDirection": "row",
    // "borderColor": "orange",
    // "borderWidth": 1,
  },
  "contentContainer":{
    "flex": 1,
    "alignItems": "stretch",
    "justifyContent": "center",
    "paddingRight": Design.paddingRight,
    "paddingLeft": Design.paddingLeft,
    "flexDirection": "row"
  },
  "innerContentContainer":{
    "flex": 1,
    "alignItems": "stretch",
    "justifyContent": "center"
  },
  "copy":{
    "textAlign": "center",
    "fontSize": 18,
  }
}


export default PanTab
