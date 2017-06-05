// external dependencies
import React, { Component } from 'react'
import { Text, View, WebView} from "react-native"
import { Container, Content } from "native-base"
import PropTypes from "prop-types"
// import Object from 'lodash'

// internal dependencies
// import Scene from "../../Scene"
// import Session from "../../Session"
import Palette from "../../Palette"
import Design from "../../DesignParameters"
// import Routes from "../../Routes"
// import Config from "../../Config"
// import Logger from "../../Logger"
// import MvTemplate from "../mv-Template"
// import LifekeyHeader from "../LifekeyHeader"
import LifekeyCard from "../LifekeyCard"
import { Card, CardItem } from "native-base"

// import RcPerson from "../ResourceComponents/rc-Person"
// import RcIdentity from "../ResourceComponents/rc-Identity"
// import RcContact from "../ResourceComponents/rc-Contact"
// import RcAddress from "../ResourceComponents/rc-Address"
// import RcEmployment from "../ResourceComponents/rc-Employment"
// import RcProofOfResidence from "../ResourceComponents/rc-ProofOfResidence"
// import RcProofOfIdentity from "../ResourceComponents/rc-ProofOfIdentity"
import RcWrapper from "../ResourceComponents/rc-Wrapper"
import LcAddCategoryButton from "../lc-AddCategoryButton"
// import Touchable from "../Touchable"
// import BackButton from "../BackButton"
// import BackIcon from "../BackIcon"
// import HelpIcon from "../HelpIcon"


class MyData extends Component {


  validResourceType(resourceType){
    return (!!resourceType && !!resourceType.items && !!resourceType.items.length)
  }

  RC_render(resourceType){
    if(!this.validResourceType(resourceType)) return
    return <RcWrapper onPressDelete={this.props.onPressDelete} onPressEdit={this.props.onPressEdit} resourceType={resourceType}></RcWrapper>
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

  render() {

    const sortedResourceTypes = this.props.sortedResourceTypes

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

    return (
    
    <View>
      {/* You are just a number now */}
      <View style={Object.assign({}, styles.groupContainer, styles.groupContainerDark)}>
        {/* <View style={styles.groupHeadingContainer}><Text style={styles.groupheading}>DID</Text></View> */}
        { this.DID_render(did) }
      </View>

      {/* Who you are */}
      <View style={Object.assign({}, styles.groupContainer, styles.groupContainerLight)}>
        {/* <View style={styles.groupHeadingContainer}><Text style={styles.groupheading}>IDENTITY</Text></View> */}
        { this.RC_render(person) }
        { this.RC_render(identity) }
        { this.RC_render(poIdentity) }
      </View>

      {/* How to reach you */}
      <View style={Object.assign({}, styles.groupContainer, styles.groupContainerDark)}> 
        {/* <View style={styles.groupHeadingContainer}><Text style={styles.groupheading}>CONTACT</Text></View> */}
        { this.RC_render(email) }
        { this.RC_render(mobile) }
        { this.RC_render(landline) }
      </View>

      {/* Where you are */}  
      <View style={Object.assign({}, styles.groupContainer, styles.groupContainerLight)}>
        {/* <View style={styles.groupHeadingContainer}><Text style={styles.groupheading}>RESIDENCE</Text></View> */}
        { this.RC_render(address) }
        { this.RC_render(poResidence) }
      </View>

      {/* What you do */}  
      <View style={Object.assign({}, styles.groupContainer, styles.groupContainerDark)}>
        {/* <View style={styles.groupHeadingContainer}><Text style={styles.groupheading}>EMPLOYMENT</Text></View> */}
        { this.RC_render(employment) }
      </View>

      {/* Verifiable Claims */}  
      <View style={Object.assign({}, styles.groupContainer, styles.groupContainerLight)}>
        {/* <View style={styles.groupHeadingContainer}><Text style={styles.groupheading}>VERIFIABLE CLAIMS</Text></View> */}
        { this.VC_render(verifiableClaims) }
      </View>

    {/* Miscellaneous Items */}  
      <View style={Object.assign({}, styles.groupContainer, styles.groupContainerDark)}>
        {/* <View style={styles.groupHeadingContainer}><Text style={styles.groupheading}>MISCELLANEOUS</Text></View> */}
        { this.VC_render(misc) }
      </View>

      {/* Add additional items */}  
      <View style={styles.addItemContainer}>
        <View style={styles.addHeadingContainer}><Text style={styles.addHeading}>ADD DATA</Text></View>
        {this.props.sortedResourceTypes.map((resourceType, i) => {
          if(resourceType.name !== "Malformed" && 
             resourceType.name !== "Person" && 
             resourceType.name !== "Verifiable Claims" &&
             resourceType.name !== "Decentralized Identifier" &&
             resourceType.name !== "Miscellaneous")
            return (
              <LcAddCategoryButton  key={i} name={resourceType.name} form={resourceType.url + "_form"} onEditResource={this.context.onEditResource} />
            )
        })}
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
  "addHeading": {  
    "textAlign": "center",
    "color": Palette.consentBlue
  },
  "addHeadingContainer":{
    "flex": 1,
    "height": 50,
    "justifyContent": "center",
    "alignItems": "center"
  },
  "groupContainer": {
    "paddingTop": "2%",
    // "paddingTop": "5%",
    // "paddingBottom": "5%"
  },
  "groupContainerLight": {
    // "backgroundColor": Palette.consentGrayLight
    "backgroundColor": "white"
  },
  "groupContainerDark": {
    // "backgroundColor": Palette.consentGrayMedium
    "backgroundColor": "white"
  },
  "card": {
    "marginTop": Design.paddingLeft / 2,
    "marginLeft": Design.paddingLeft / 2,
    "marginRight": Design.paddingRight / 2
  },
  "cardHeader": {
    "flex": 1,
    "flexDirection": "row",
    "justifyContent": "space-between"
  },
  "cardHeadingText": {
    "fontSize": 10,
    "fontWeight": "bold"
  },
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
