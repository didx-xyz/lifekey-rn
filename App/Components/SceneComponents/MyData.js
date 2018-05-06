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
import RcWrapperLight from "../ResourceComponents/rc-Wrapper-Light"
import ModalPicker from "react-native-modal-selector"
import LcAddCategoryButton from "../lc-AddCategoryButton"
import Touchable from "../Touchable"


class MyData extends Component {

  validResourceType(resourceType){
    return (!!resourceType && !!resourceType.items && !!resourceType.items.length)
  }

  RC_render(resourceType){
    
    if(!this.validResourceType(resourceType)) return

    if(this.props.light)
      return <RcWrapperLight resourceType={resourceType} includeResourceType={true}></RcWrapperLight>
    else
      return <RcWrapper onPressShare={this.props.onPressShare} 
                        onPressEdit={this.props.onPressEdit} 
                        onPressProfile={this.props.onPressProfile}
                        peerConnections={this.props.peerConnections}
                        resourceType={resourceType}></RcWrapper>
  }

  VC_render(resourceType) {
    if(!this.validResourceType(resourceType)) return
    return ( 
      <View style={styles.vcTextContainer}>
        { resourceType.items.map((resource, i) => {
         return (
            <Text key={i} style={styles.vcText}>VC: {resource.schema}</Text>
          ) 
        })}
      </View>
    )
  }

  DID_render(resourceType) {
    if(!this.validResourceType(resourceType)) return
    return (
      <Card style={styles.card}>
        <CardItem>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeadingText}>DECENTRALIZED IDENTIFIER</Text>
          </View>
        </CardItem>
        <CardItem>
          <Text>{ resourceType.items[0].decentralisedIdentifier }</Text>
        </CardItem>
      </Card>
    )
  }

  Malformed_render(resourceType) {
    if(!this.validResourceType(resourceType)) return
    return ( 
      <View>
        { resourceType.items.map((resource, i) => {
          return (
            <LifekeyCard key={i} headingText={"resource " + resource.id} onPressDelete={() => this.props.onPressDelete(resource.id)}>
              <Text>{resource.id} (malformed)</Text>
            </LifekeyCard>
          ) 
        })}
        <LcAddCategoryButton name={resourceType.name} form={resourceType.url + "Objectform"} onEditResource={this.context.onEditResource} />
      </View>
    )
  }

  addNewResource(option){
    this.context.onEditResource(`${option.key}_form`, null, option.label)
  }

  render() {

    const sortedResourceTypes = this.props.sortedResourceTypes

    const profile = sortedResourceTypes.find(rt => rt.name === "Public Profile")
    const person = sortedResourceTypes.find(rt => rt.name === "Person")
    const identity = sortedResourceTypes.find(rt => rt.name === "Identity")
    const email = sortedResourceTypes.find(rt => rt.name === "Email")
    const mobile = sortedResourceTypes.find(rt => rt.name === "Mobile Phone")
    const landline = sortedResourceTypes.find(rt => rt.name === "Landline")
    const address = sortedResourceTypes.find(rt => rt.name === "Address")
    const employment = sortedResourceTypes.find(rt => rt.name === "Employment")
    const poIdentity = sortedResourceTypes.find(rt => rt.name === "Proof Of Identity") 
    const poResidence = sortedResourceTypes.find(rt => rt.name === "Proof Of Residence")
    const verifiableClaims = sortedResourceTypes.find(rt => rt.name === "Verifiable Claims")
    const did = sortedResourceTypes.find(rt => rt.name === "Decentralized Identifier")
    const misc = sortedResourceTypes.find(rt => rt.name === "Miscellaneous")
    const malformed = sortedResourceTypes.find(rt => rt.name === "Malformed")

    const toggle = () => {
      if(!this.addButtonSelect.modalVisible)
        this.addButtonSelect.open()
      else
        this.addButtonSelect.open()
    }
    let selectData = {}
    selectData.initialValue = "ADD VALUE"
    selectData.data = this.props.sortedResourceTypes.map((resourceType, i) => {
      
      if(resourceType.name !== "Malformed" && 
         resourceType.name !== "Person" &&
         resourceType.name !== "Profile" && 
         resourceType.name !== "Verifiable Claims" &&
         resourceType.name !== "Decentralized Identifier" &&
         resourceType.name !== "Miscellaneous"){
        return {
          "key": resourceType.url,
          "label": resourceType.name,
          "selected": false
        }
      }
      else{
        return null
      }

    }).filter(rt => !!rt)

    return (
    
      <View style={ {"flex": 1, "alignItems": "stretch"} }>
        { !this.props.light &&
          <View style={styles.addHeadingContainer}>
            <Touchable onPress={ toggle } style={styles.addHeadingContainer}><Text style={styles.addHeading}>+ Add data</Text></Touchable>
          </View>
        }

        {/* You are just a number now 
        <View style={styles.groupContainer}>
          { this.DID_render(did) }
        </View>
        */}

        {/* Who you are */}
        <View style={styles.groupContainer}>
          { this.RC_render(profile) }
          { this.RC_render(person) }
          { this.RC_render(identity) }
          { this.RC_render(poIdentity) }
        </View>

        {/* How to reach you */}
        <View style={styles.groupContainer}>
          { this.RC_render(email) }
          { this.RC_render(mobile) }
          { this.RC_render(landline) }
        </View>

        {/* Where you are */}  
        <View style={styles.groupContainer}>
          { this.RC_render(address) }
          { this.RC_render(poResidence) }
        </View>

        {/* What you do */}  
        <View style={styles.groupContainer}>
          { this.RC_render(employment) }
        </View>

        {/* Verifiable Claims 
        <View style={styles.groupContainer}>
          { this.VC_render(verifiableClaims) }
        </View>
        */}  

        {/* Miscellaneous Items  
        <View style={styles.groupContainer}>
          { this.VC_render(misc) }
        </View> 
        */} 

        {/* Add additional items */}  
        <View style={styles.addItemContainer}>
          <View style={styles.modalHider}>
            <ModalPicker
              ref={(input) => { this.addButtonSelect = input }}
              data={selectData.data}
              style={styles.selectElement}
              selectStyle={styles.selectPickerWithValue}
              selectTextStyle={styles.addHeading}
              initValue={selectData.initialValue}
              onChange={(option) => { this.addNewResource(option) }} />
          </View>
        </View>
        
        {/* Delete malformed items */}  
        <View style={styles.malformedItemCntainer}>
        { 
          malformed && malformed.items.length ? 
          <View>
            <Text style={styles.addDataHeading}>Malformed</Text>
            { this.Malformed_render(malformed) }
          </View> 
          : null 
        }
        </View>
      </View>
    )
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
MyData.contextTypes = {
  // behavior
  "onEditResource": PropTypes.func,
  "onSaveResource": PropTypes.func,

  // state
  "getShouldClearResourceCache": PropTypes.func
}

export default MyData
