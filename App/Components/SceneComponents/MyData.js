// external dependencies
import React, { Component } from 'react'
import { Text, View, WebView } from "react-native"
import { Container, Content } from "native-base"
import PropTypes from "prop-types"
import _ from 'lodash'

// internal dependencies
import Api from "../../Api"
import Scene from "../../Scene"
import Session from "../../Session"
import Palette from "../../Palette"
import Design from "../../DesignParameters"
import Routes from "../../Routes"
import Config from "../../Config"
import Logger from "../../Logger"
import MvTemplate from "../mv-Template"
import LifekeyHeader from "../LifekeyHeader"
import LifekeyCard from "../LifekeyCard"

import RcPerson from "../ResourceComponents/rc-Person"
import RcIdentity from "../ResourceComponents/rc-Identity"
import RcContact from "../ResourceComponents/rc-Contact"
import RcAddress from "../ResourceComponents/rc-Address"
import RcEmployment from "../ResourceComponents/rc-Employment"
import RcProofOfResidence from "../ResourceComponents/rc-ProofOfResidence"
import RcProofOfIdentity from "../ResourceComponents/rc-ProofOfIdentity"
import LcAddCategoryButton from "../lc-AddCategoryButton"
import Touchable from "../Touchable"
import BackButton from "../BackButton"
import BackIcon from "../BackIcon"
import HelpIcon from "../HelpIcon"


class MyData extends Component {

  constructor(...params) {
    super(...params)

    this.state = {
      "data": this.props.data,
      "notifyParent": this.props.notifyParent
    }
  }

  componentWillReceiveProps(freshProps) {
    console.log("NEW PROPS: ", freshProps)
  }

  onPressDelete(id) {
    Api.deleteResource({ id })

    // refresh the list
    this.context.onSaveResource()
    this.state.notifyParent()
  }

  onPressEdit(form, id = null) {
    this.context.onEditResource(form, id)
  }

  validResourceType(resourceType){
    return (!!resourceType && !!resourceType.items && !!resourceType.items.length)
  }

  Person_render(resourceType) {
    if(!this.validResourceType(resourceType)) return
    return ( 
      	<RcPerson resourceType={resourceType} 
            onPressEdit={this.onPressEdit.bind(this)} 
            onPressDelete={this.onPressDelete.bind(this)} 
            onEditResource={this.context.onEditResource.bind(this)}></RcPerson> 
    )
  }

  Identity_render(resourceType) {
    if(!this.validResourceType(resourceType)) return
    return ( 
      	<RcIdentity resourceType={resourceType} 
            onPressEdit={this.onPressEdit.bind(this)} 
            onPressDelete={this.onPressDelete.bind(this)} 
            onEditResource={this.context.onEditResource.bind(this)}></RcIdentity> 
    )
  }

  Contact_render(resourceType) {
    if(!this.validResourceType(resourceType)) return
    return ( 
      	<RcContact resourceType={resourceType} 
            onPressEdit={this.onPressEdit.bind(this)} 
            onPressDelete={this.onPressDelete.bind(this)} 
            onEditResource={this.context.onEditResource.bind(this)}></RcContact> 
    )
  }

  Address_render(resourceType) {
    if(!this.validResourceType(resourceType)) return
    return ( 
      	<RcAddress resourceType={resourceType} 
            onPressEdit={this.onPressEdit.bind(this)} 
            onPressDelete={this.onPressDelete.bind(this)} 
            onEditResource={this.context.onEditResource.bind(this)}></RcAddress> 
    )
  }

  Employment_render(resourceType) {
    if(!this.validResourceType(resourceType)) return
    return ( 
      	<RcEmployment resourceType={resourceType} 
            onPressEdit={this.onPressEdit.bind(this)} 
            onPressDelete={this.onPressDelete.bind(this)} 
            onEditResource={this.context.onEditResource.bind(this)}></RcEmployment> 
    )
  }

  ProofOfResidence_render(resourceType) {
    if(!this.validResourceType(resourceType)) return
    return ( 
      	<RcProofOfResidence resourceType={resourceType} 
            onPressEdit={this.onPressEdit.bind(this)} 
            onPressDelete={this.onPressDelete.bind(this)} 
            onEditResource={this.context.onEditResource.bind(this)}></RcProofOfResidence> 
    )
  }

  ProofOfIdentity_render(resourceType) {
    if(!this.validResourceType(resourceType)) return
    return ( 
      	<RcProofOfIdentity resourceType={resourceType} 
            onPressEdit={this.onPressEdit.bind(this)} 
            onPressDelete={this.onPressDelete.bind(this)} 
            onEditResource={this.context.onEditResource.bind(this)}></RcProofOfIdentity> 
    )
  }

  Malformed_render(resourceType) {
    if(!this.validResourceType(resourceType)) return

    return ( 
      <View>
        { resourceType.items.map((resource, i) => {
			return (
				<LifekeyCard key={i} headingText={"resource " + resource.id} onPressDelete={() => this.onPressDelete(resource.id)}>
					<Text>{resource.id} (malformed)</Text>
				</LifekeyCard>
			) 
        })}
        <LcAddCategoryButton name={resourceType.name} form={resourceType.url + "_form"} onEditResource={this.context.onEditResource} />
      </View>
    )
  }

  render() {

  	const person = this.state.data.find(rt => rt.name === "Person"); 
    const identity = this.state.data.find(rt => rt.name === "Identity"); 
    const email = this.state.data.find(rt => rt.name === "Email"); 
    const mobile = this.state.data.find(rt => rt.name === "Mobile Phone"); 
    const landline = this.state.data.find(rt => rt.name === "Landline"); 
    const address = this.state.data.find(rt => rt.name === "Address"); 
    const employment = this.state.data.find(rt => rt.name === "Employment"); 
    const poIdentity = this.state.data.find(rt => rt.name === "Proof Of Identity"); 
    const poResidence = this.state.data.find(rt => rt.name === "Proof Of Residence"); 

    const malformed = this.state.data.find(rt => rt.name === "Malformed"); 

    return (
    
		<View>
			{/* Who you are */}
			<View style={_.assign({}, styles.groupContainer, styles.groupContainerLight)}>
				<View style={styles.groupHeadingContainer}><Text style={styles.groupheading}>IDENTITY</Text></View>
				{ this.Person_render(person) }
				{ this.Identity_render(identity)}
        { this.ProofOfIdentity_render(poIdentity) }
			</View>

			{/* How to reach you */}
			<View style={_.assign({}, styles.groupContainer, styles.groupContainerDark)}> 
				<View style={styles.groupHeadingContainer}><Text style={styles.groupheading}>CONTACT</Text></View>    
				{ this.Contact_render(email) }
				{ this.Contact_render(mobile) }
				{ this.Contact_render(landline) }
			</View>

			{/* Where you are */}  
			<View style={_.assign({}, styles.groupContainer, styles.groupContainerLight)}>
				<View style={styles.groupHeadingContainer}><Text style={styles.groupheading}>RESIDENCE</Text></View>
				{ this.Address_render(address) }  
				{ this.ProofOfResidence_render(poResidence) }
			</View>

			{/* What you do */}  
			<View style={_.assign({}, styles.groupContainer, styles.groupContainerDark)}>
				<View style={styles.groupHeadingContainer}><Text style={styles.groupheading}>EMPLOYMENT</Text></View>
				{ this.Employment_render(employment) }
			</View>

			{/* Add additional items */}  
			<View style={styles.addItemContainer}>
				<View style={styles.addHeadingContainer}><Text style={styles.addHeading}>ADD DATA</Text></View>
				{this.state.data.map((resourceType, i) => {
				  if(resourceType.name !== "Malformed")
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
    "paddingTop": "5%",
    "paddingBottom": "5%"
  },
  "groupContainerLight": {
    "backgroundColor": Palette.consentGrayLight
  },
  "groupContainerDark": {
    "backgroundColor": Palette.consentGrayMedium
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
