// external dependencies
import React, { Component } from "react"
import { View, Text } from "react-native"
import { Card, CardItem } from "native-base"
import Icon from "react-native-vector-icons/FontAwesome"
import PropTypes from "prop-types"

// internal dependencies
import Design from "../DesignParameters"
import Palette from "../Palette"
import Touchable from "../Components/Touchable"

class LifekeyCard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      "expanded": false
    }

    this.onBoundPressSwitchExpand = this.onPressSwitchExpand.bind(this)
  }

  onPressSwitchExpand(event) {
    this.setState({
      "expanded": !this.state.expanded
    })
  }

  render() {
    
    const childrenWithExpandedProp = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        "expanded": this.state.expanded
      })
    })

    if (this.state.expanded) {
      return (
        <Card style={styles.card}>
          <CardItem>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeadingText}>{this.props.headingText.toUpperCase()}</Text>
              <Touchable onPress={this.onBoundPressSwitchExpand}>
                <View style={styles.buttonContainer}>
                  <Icon style={Object.assign({}, styles.cardHeadingIcon, styles.cardHeadingIconLarge)} name="angle-down"  />
                </View>
              </Touchable>
            </View>
          </CardItem>
          <CardItem style={styles.cardBody}>
            { childrenWithExpandedProp }
          </CardItem>
          <CardItem>
            <View style={styles.cardFooter}>
              {this.props.onPressEdit &&
                <Touchable onPress={this.props.onPressEdit}>
                  <Text style={Object.assign({}, styles.cardFooterText, styles.cardFooterEditText)}>EDIT</Text>
                </Touchable>
              }
              {this.props.onPressDelete &&
                <Touchable onPress={this.props.onPressDelete}>
                  <Text style={Object.assign({}, styles.cardFooterText, styles.cardFooterDeleteText)}>DELETE</Text>
                </Touchable>
              }
              {this.props.onPressShare &&
                <Touchable onPress={this.props.onPressShare}>
                  <Text style={Object.assign({}, styles.cardFooterText, styles.cardFooterShareText)}>SHARE</Text>
                </Touchable>
              }
            </View>
          </CardItem>
        </Card>
      )
    }

    return(
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardHeadingText}>{this.props.headingText.toUpperCase()}</Text>
          { this.props.expandable &&
            <Touchable onPress={this.onBoundPressSwitchExpand}>
              <View style={styles.buttonContainer}>  
                <Icon style={Object.assign({}, styles.cardHeadingIcon, styles.cardHeadingIconSmall)}  name="angle-right"  />
              </View>
            </Touchable>
          }
        </View>
        <View style={styles.cardBody}>
          { childrenWithExpandedProp }
        </View>
        <View style={styles.cardFooter}>
          { this.props.onPressDelete &&
            <Touchable onPress={this.props.onPressDelete}>
              <Text style={Object.assign({}, styles.cardFooterText, styles.cardFooterDeleteText)}>DELETE</Text>
            </Touchable>
          }
          <View style={ {"flex": 1 } }></View>
          { this.props.onPressEdit &&
            <Touchable onPress={this.props.onPressEdit}>
              <Text style={Object.assign({}, styles.cardFooterText, styles.cardFooterEditText)}>EDIT</Text>
            </Touchable>
          }
        </View>
      </Card>
    )
  }
}

const styles = {
  "card": {
    "marginLeft": Design.paddingLeft / 2,
    "marginRight": Design.paddingRight / 2,
    "backgroundColor": Palette.consentOffWhite,
    "paddingLeft": Design.paddingLeft,
    "paddingRight": Design.paddingRight
  },
  "cardHeader": {
    "height": 40,
    "justifyContent": "center"
  },
  "cardHeadingText": {
    "fontSize": 10,
    "fontWeight": "bold"
  },
  "cardHeadingIcon": {
    "color": Palette.consentGrayDark
  },
  "buttonContainer":{
    "justifyContent": "center",
    "alignItems": "center",
    "backgroundColor": Palette.consentGrayLightest,
    "borderRadius": 18,
    "width": 36,
    "height": 36
  },
  "cardBody": {
    "flex": 1,
    "paddingTop": 0,
    "paddingBottom": Design.paddingLeft / 2 
  },
  "cardFooter": {
    "flex": 1,
    "height": 40,
    "flexDirection": "row",
    "justifyContent": "space-between",
    "alignItems": "center",
    "paddingLeft": Design.paddingLeft / 2,
    "paddingRight": Design.paddingRight / 2,
    "borderTopWidth": 1,
    "borderColor": Palette.consentGrayLight
  },
  "cardFooterText": {
    "fontWeight": "bold",
    "fontSize": 12
  },
  "cardFooterEditText": {
    "color": Palette.consentBlue
  },
  "cardFooterDeleteText": {
    "color": Palette.consentGrayDark
  }
}

LifekeyCard.defaultProps = {
  "headingText": "heading not set"
}

LifekeyCard.propTypes = {
  "expandable": PropTypes.bool,
  "headingText": PropTypes.string,
  "onPressEdit": PropTypes.func,
  "onPressDelete": PropTypes.func,
  "onPressShare": PropTypes.func
}

export default LifekeyCard



// // external dependencies
// import React, { Component } from "react"
// import { View, Text } from "react-native"
// import { Card, CardItem } from "native-base"
// import Icon from "react-native-vector-icons/FontAwesome"
// import PropTypes from "prop-types"

// // internal dependencies
// import Design from "../DesignParameters"
// import Palette from "../Palette"
// import Touchable from "../Components/Touchable"

// class LifekeyCard extends Component {
//   constructor(props) {
//     super(props)

//     this.state = {
//       "expanded": false
//     }

//     this.onBoundPressSwitchExpand = this.onPressSwitchExpand.bind(this)
//   }

//   onPressSwitchExpand(event) {
//     this.setState({
//       "expanded": !this.state.expanded
//     })
//   }

//   render() {
//     const childrenWithExpandedProp = React.Children.map(this.props.children, (child) => {
//       return React.cloneElement(child, {
//         "expanded": this.state.expanded
//       })
//     })


//     // console.log("PENDING ===========================> ", this.props.pending)
//     // const pendingState = this.props.pending ? { "opacity": 0.3 } : {}
//     // console.log("PENDING STATE ===========================> ", pendingState) <Card style={Object.assign({}, styles.card, pendingState)}>

//     if (this.state.expanded) {
//       return (
//         <Card style={styles.card}>
//           <CardItem>
//             <View style={styles.cardHeader}>
//               <Text style={styles.cardHeadingText}>{this.props.headingText.toUpperCase()}</Text>
//               <Touchable onPress={this.onBoundPressSwitchExpand}>
//                 <View style={styles.buttonContainer}>
//                   <Icon style={Object.assign({}, styles.cardHeadingIcon, styles.cardHeadingIconLarge)} name="angle-down"  />
//                 </View>
//               </Touchable>
//             </View>
//           </CardItem>
//           <CardItem style={styles.cardBody}>
//             { childrenWithExpandedProp }
//           </CardItem>
//           <CardItem>
//             <View style={styles.cardFooter}>
//               {this.props.onPressEdit &&
//                 <Touchable onPress={this.props.onPressEdit}>
//                   <Text style={Object.assign({}, styles.cardFooterText, styles.cardFooterEditText)}>EDIT</Text>
//                 </Touchable>
//               }
//               {this.props.onPressDelete &&
//                 <Touchable onPress={this.props.onPressDelete}>
//                   <Text style={Object.assign({}, styles.cardFooterText, styles.cardFooterDeleteText)}>DELETE</Text>
//                 </Touchable>
//               }
//               {this.props.onPressShare &&
//                 <Touchable onPress={this.props.onPressShare}>
//                   <Text style={Object.assign({}, styles.cardFooterText, styles.cardFooterShareText)}>SHARE</Text>
//                 </Touchable>
//               }
//             </View>
//           </CardItem>
//         </Card>
//       )
//     }

//     return(
//       <Card style={styles.card}>
//         <CardItem>
//           <View style={styles.cardHeader}>
//             <Text style={styles.cardHeadingText}>{this.props.headingText.toUpperCase()}</Text>
//             <Touchable onPress={this.onBoundPressSwitchExpand}>
//               <View style={styles.buttonContainer}>  
//                 <Icon style={Object.assign({}, styles.cardHeadingIcon, styles.cardHeadingIconSmall)}  name="angle-right"  />
//               </View>
//             </Touchable>
//           </View>
//         </CardItem>
//         <CardItem style={styles.cardBody}>
//           { childrenWithExpandedProp }
//         </CardItem>
//       </Card>
//     )
//   }
// }

// const styles = {
//   "card": {
//     "marginTop": Design.paddingLeft / 2,
//     "marginLeft": Design.paddingLeft / 2,
//     "marginRight": Design.paddingRight / 2
//   },
//   "cardHeader": {
//     "flex": 1,
//     "flexDirection": "row",
//     "justifyContent": "space-between"
//   },
//   "cardHeadingText": {
//     "fontSize": 10,
//     "fontWeight": "bold"
//   },
//   "cardHeadingIcon": {
//     // "marginTop": -10,
//     "color": Palette.consentGrayDark
//   },
//   "buttonContainer":{
//     "justifyContent": "center",
//     "alignItems": "center",
//     "backgroundColor": Palette.consentGrayLightest,
//     "borderRadius": 18,
//     "width": 36,
//     "height": 36
//   },
//   "cardHeadingIconSmall": {
//     "marginLeft": 4,
//     "fontSize": 30
//   },
//   "cardHeadingIconLarge": {
//     "fontSize": 32
//   },
//   "cardBody": {
//     "flex": 1,
//     "paddingTop": 0,
//     "marginTop": -10
//   },
//   "cardFooter": {
//     "flex": 1,
//     "flexDirection": "row",
//     "justifyContent": "space-between",
//     "paddingTop": Design.paddingTop,
//     "borderTopWidth": 1,
//     "borderColor": Palette.consentGrayLightest
//   },
//   "cardFooterText": {
//     "fontWeight": "bold",
//     "fontSize": 12
//   },
//   "cardFooterEditText": {
//     "color": Palette.consentGrayDark
//   },
//   "cardFooterDeleteText": {
//     "color": Palette.consentRed
//   },
//   "cardFooterShareText": {
//     "color": Palette.consentBlue
//   }
// }

// LifekeyCard.defaultProps = {
//   "headingText": "heading not set"
// }

// LifekeyCard.propTypes = {
//   "headingText": PropTypes.string,
//   "onPressEdit": PropTypes.func,
//   "onPressDelete": PropTypes.func,
//   "onPressShare": PropTypes.func
// }

// export default LifekeyCard
