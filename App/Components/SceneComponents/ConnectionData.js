// external dependencies
import React, { Component } from 'react'
import { Text, View } from "react-native"
import { Container, Content } from "native-base"
import PropTypes from "prop-types"

// internal dependencies
import Palette from "../../Palette"
import Design from "../../DesignParameters"
import LifekeyCard from "../LifekeyCard"
import { Card, CardItem } from "native-base"

import RcWrapper from "../ResourceComponents/rc-Wrapper"
import ModalPicker from "react-native-modal-picker"
import LcAddCategoryButton from "../lc-AddCategoryButton"
import Touchable from "../Touchable"

class TheirData extends Component {

  validResourceType(resourceType){
    return (!!resourceType && !!resourceType.items && !!resourceType.items.length)
  }

  RC_render(resourceType){
    console.log("RC RENDER: ", resourceType)
    if(!this.validResourceType(resourceType)) return
    return <RcWrapper onPressShare={this.props.onPressShare} 
                      onPressEdit={this.props.onPressEdit} 
                      onPressProfile={this.props.onPressProfile}
                      peerConnections={this.props.peerConnections}
                      resourceType={resourceType}></RcWrapper>
  }

  // fetchFullResource(resourceId){
  //   Api.getResource({ id: resourceId }).then(result => {

  //     // TODO - ASYNC STORAGE
  //     const fullResource = result.body
      
  //     this.state(
  //       { 
  //         fullResources: this.state.fullResources.push(fullResource), 
  //         connectionData: this.state.connectionData.filter(datum => datum.id !== resourceId) 
  //       })
  //   })
  //   .catch(error => {
  //     console.log("Error loading resource: ", error)
  //   })
  // }

  render() {

    const connectionData = this.props.connectionData
    const fullResources = this.props.fullResources

    console.log("FULL RESOURCES: ", fullResources, " | ", Array.isArray(fullResources))

    return (
      <View>
        <View>
        { 
          connectionData.map((datum, i) => {
            return (

              <Touchable key={datum.id} onPress={this.props.onFetchFullResource.bind(this, datum.id)}>
                <Text>{ datum.alias }</Text>
              </Touchable>

            )
          })
        }
        </View>
        <View>
        { 
          fullResources.map((datum, i) => {
            return (

              <Touchable key={datum.id}>
                <Text>FULL RESOURCE: { datum.alias }</Text>
              </Touchable>

            )
          })
        }
        </View>
      </View>
    )

    // const profile = connectionData.find(rt => rt.name === "Public Profile")
    // const person = connectionData.find(rt => rt.name === "Person")
    // const identity = connectionData.find(rt => rt.name === "Identity")
    // const email = connectionData.find(rt => rt.name === "Email")
    // const mobile = connectionData.find(rt => rt.name === "Mobile Phone")
    // const landline = connectionData.find(rt => rt.name === "Landline")
    // const address = connectionData.find(rt => rt.name === "Address")
    // const employment = connectionData.find(rt => rt.name === "Employment")
    // const poIdentity = connectionData.find(rt => rt.name === "Proof Of Identity") 
    // const poResidence = connectionData.find(rt => rt.name === "Proof Of Residence")

    // return (
    
    //   <View style={ {"flex": 1, "alignItems": "stretch"} }>
    //     <View style={styles.addHeadingContainer}>
    //       <Touchable onPress={ toggle } style={styles.addHeadingContainer}><Text style={styles.addHeading}>+ Add data</Text></Touchable>
    //     </View>

    //     {/* Who you are */}
    //     <View style={styles.groupContainer}>
    //       { this.RC_render(profile) }
    //       { this.RC_render(person) }
    //       { this.RC_render(identity) }
    //       { this.RC_render(poIdentity) }
    //     </View>

    //     {/* How to reach you */}
    //     <View style={styles.groupContainer}>
    //       { this.RC_render(email) }
    //       { this.RC_render(mobile) }
    //       { this.RC_render(landline) }
    //     </View>

    //     {/* Where you are */}  
    //     <View style={styles.groupContainer}>
    //       { this.RC_render(address) }
    //       { this.RC_render(poResidence) }
    //     </View>

    //     {/* What you do */}  
    //     <View style={styles.groupContainer}>
    //       { this.RC_render(employment) }
    //     </View>

    //   </View>
    // )
  }
}

const styles = {
  "addHeadingContainer":{
    "paddingTop": Design.paddingTop + 10,
    "paddingBottom": Design.paddingBottom + 10,
    "paddingLeft": Design.paddingLeft / 2,
    "paddingRight": Design.paddingRight / 2,
    "justifyContent": "center",
    "alignItems": "flex-end"
  },
  "addHeading": {  
    "textAlign": "center",
    "color": Palette.consentBlue,
    "fontSize": 18
  },
  "groupheading":{
    "textAlign": "left",
    "color": Palette.consentGrayDark
  },
  "groupHeadingContainer":{
    "paddingLeft": 15,
    "flex": 1,
    "height": 50,
    "justifyContent": "center",
    "alignItems": "flex-start"
  },
  "vcTextContainer":{
    "paddingLeft": 15,
  },
  "vcText":{
    "color": Palette.consentGrayDark
  },
  
  "modalHider":{
    "height": 0
  },
  "groupContainer": {
    "paddingTop": 0
  },
  // "card": {
  //   "marginTop": Design.paddingLeft / 2,
  //   "marginLeft": Design.paddingLeft / 2,
  //   "marginRight": Design.paddingRight / 2
  // },
  "cardHeader": {
    "flex": 1,
    "flexDirection": "row",
    "justifyContent": "space-between"
  },
  "cardHeadingText": {
    "fontSize": 10,
    "fontWeight": "bold"
  },
  "selectElement":{
    "flex": 1,
    "flexDirection": "row",
    "justifyContent": "flex-start",
    "alignItems": "stretch"
  }
}

// these are from Lifekeyrn
TheirData.contextTypes = {
  // behavior
  "onEditResource": PropTypes.func,
  "onSaveResource": PropTypes.func,

  // state
  "getShouldClearResourceCache": PropTypes.func
}

export default TheirData
