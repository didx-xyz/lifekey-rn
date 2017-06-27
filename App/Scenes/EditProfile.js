// external dependencies
import React from "react"
import { ToastAndroid } from "react-native"
import PropTypes from "prop-types"

// internal dependencies
import Api from "../Api"
import Scene from "../Scene"
import ConsentUser from "../Models/ConsentUser"
import EditForm from "./Forms/EditForm"
import Countries from "../Countries"
import Languages from "../Languages"
import Palette from "../Palette"
import Routes from "../Routes"
import Logger from '../Logger'

class EditProfile extends Scene {
  
  constructor(...params) {
    super(...params)

    this.state = {
      "entities": [],
      "progressCopy": "Loading form and state.formTarget...",
      "asyncActionInProgress": true
    }

    this.onBoundPressCancel = this.onPressCancel.bind(this)
    this.onBoundPressSave = this.onPressSave.bind(this)
    this.onBoundSave = this.onSave.bind(this)

    this.boundSetStringInputStateValue = this.setStringInputStateValue.bind(this)
    this.boundSetImageInputStateValue = this.setImageInputStateValue.bind(this)
    this.boundSetDateInputStateValue = this.setDateInputStateValue.bind(this)
    this.boundSetSelectInputStateValue = this.setSelectInputStateValue.bind(this)
  }

  onPressCancel() {
    this.navigator.pop()
  }

  onPressSave() {
    const data = {}
    const keys = this.state.entities.map(entity => entity.name)
    const values = keys.map(key => this.state.formTarget[key] || '')

    keys.forEach((key, i) => data[key] = values[i])

    let formTarget = this.state.formTarget
    this.matchProfileAndState(data, formTarget)

    const state = {
      "progressCopy": "Saving...",
      "asyncActionInProgress": true,
      "formTarget": formTarget
    }

    this.setState(state, () => {

      return Api.setProfile(data).then(
        this.onBoundSave
      ).catch(console.log)
    })
    //End set UI state
  }

  onSave(response) {

    this.context.onSaveResource()

    ConsentUser.updateProfile(this.state.formTarget)

    ToastAndroid.show('Profile saved!', ToastAndroid.SHORT)

    this.navigator.pop()
  }

  componentDidMount() {

    const id = this.context.getEditResourceId()
    const form = this.context.getEditResourceForm()
    
    Promise.all([
      Api.getResourceForm(form),
      Api.myProfile(),
      Api.getMyData()
    ]).then(values => {

      let formData = values[0]
      let profile = values[1]
      let resourcesByType = values[2].resourcesByType

      let state = { formTarget: profile, entities: [] }  

      this.initializeState(state, formData.entities, resourcesByType)

      // Switch off loading state 
      state.asyncActionInProgress = false

      //Set state 
      this.setState(state)

    }).catch(error => {
      Logger.warn("Error in loading resource form: ", error)
      if (form == 'http://schema.cnsnt.io/verified_identity_form') {
        alert('Please get verified_identity from Trust Bot first')
        this.navigator.pop()
      } else {
        Logger.warn('Unexpected resource format')
      }
    })
  }

  initializeState(state, entities, resourcesByType){

    let rtEmail = resourcesByType.find(rt => rt.name === "Email")
    const emailValue = (rtEmail && rtEmail.items.length) ? rtEmail.items[0].email : ''
    let rtAddress = resourcesByType.find(rt => rt.name === "Address")
    const addressValue = (rtAddress && rtAddress.items.length) ? `${rtAddress.items[0].streetAddress}, ${rtAddress.items[0].suburb}, ${rtAddress.items[0].province}` : ''
    let rtMobile = resourcesByType.find(rt => rt.name === "Mobile Phone")
    const mobileValue = (rtMobile && rtMobile.items.length) ? rtMobile.items[0].telephone : ''
    let rtPerson = resourcesByType.find(rt => rt.name === "Person")
    const personValue = (rtPerson && rtPerson.items.length) ? `${rtPerson.items[0].firstName} ${rtPerson.items[0].lastName}` : ''
    const profilePicValue = (rtPerson && rtPerson.items.length) ? rtPerson.items[0].identityPhotograph : ''

    entities.forEach(entity => {

      if(entity.type === "string"){
        
        console.log("STRING ENTITY: ", entity, " | ", state.formTarget)

        switch(entity.name){
          case "label":
            state.formTarget[entity.name] =  this.state.formTarget.label || "My profile"
            entity.initialValue = this.state.formTarget.label || "My profile"
            break
          case "contactEmail":
            state.formTarget[entity.name] = state.formTarget["email"] ? state.formTarget["email"] : emailValue
            entity.initialValue = state.formTarget["email"] ? state.formTarget["email"] : emailValue
            break
          case "profileColour":
            state.formTarget[entity.name] = state.formTarget["colour"] ? state.formTarget["colour"] : ''
            entity.initialValue = state.formTarget["colour"] ? state.formTarget["colour"] : ''
            break
          case "displayName":
            state.formTarget[entity.name] = state.formTarget["display_name"] ? state.formTarget["display_name"] : personValue
            entity.initialValue = state.formTarget["display_name"] ? state.formTarget["display_name"] : personValue
            break
          case "contactAddress":
            state.formTarget[entity.name] = state.formTarget["address"] ? state.formTarget["address"] : addressValue
            entity.initialValue = state.formTarget["address"] ? state.formTarget["address"] : addressValue
            break
          case "contactTelephone":
            state.formTarget[entity.name] = state.formTarget["tel"] ? state.formTarget["tel"] : mobileValue
            entity.initialValue = state.formTarget["tel"] ? state.formTarget["tel"] : mobileValue
            break
          default:
            entity.initialValue = ""
            break
        }

      }
      if (entity.type === "country") {
        state.formTarget[entity.name + "__shown"] = false
        state.formTarget[entity.name + "__label"] = "Select a country"
      }

      if (entity.type === "language") {
        state.formTarget[entity.name + "__shown"] = false
        state.formTarget[entity.name + "__label"] = "Select a language"
        entity.initialValue = "Select a language"
      }

      if (entity.type === "photograph") {
        state.formTarget[entity.name + "__label"] = "Select a photograph"

        switch(entity.name){
          case "profileImageUri":
            state.formTarget[entity.name] = state.formTarget["profileImageUri__label"] ? state.formTarget["profileImageUri__label"] : state.formTargetPicValue
            entity.initialValue = state.formTarget["profileImageUri__label"] ? state.formTarget["profileImageUri__label"] : state.formTargetPicValue
            break
          default:
            entity.initialValue = "Select a photograph"
            break
        } 
      }
    })

    state.entities = [
      {"label": "Label", "name": "label", "type": "string"},
      ...entities
    ]
  }

  // This is necessary because the schema/form values of profile differ from the keys for the saved entity 
  matchProfileAndState(newValue, formTarget){
    
    Object.keys(newValue).map((key, i) => {
      switch(key){
        case "label":
          formTarget["label"] =  newValue["label"] || "My profile"
          break
        case "contactEmail":
          formTarget["email"] = newValue["contactEmail"]
          break
        case "profileColour":
          formTarget["colour"] = newValue["profileColour"]
          break
        case "displayName":
          formTarget["display_name"] = newValue["displayName"] 
          break
        case "contactAddress":
          formTarget["address"] = newValue["contactAddress"]
          break
        case "contactTelephone":
          formTarget["tel"] = newValue["contactTelephone"] 
          break
        default:
          break
      }
    })
  }

  setStringInputStateValue(entity, text){
    let newResource = this.state.formTarget
    newResource[entity.name] = text
    this.setState({resource: newResource})
  }
  setImageInputStateValue(entity, data){
    let newResource = this.state.formTarget
    newResource[entity.name + "__label"] = data.fileName
    newResource[entity.name] = data.data
    this.setState({resource: newResource})
  }
  setDateInputStateValue(entity, date){
    let newResource = this.state.formTarget
    newResource[entity.name] = date
    this.setState({resource: newResource})
  }
  setSelectInputStateValue(entity, option){
    let newResource = this.state.formTarget
    newResource[entity.name + "__label"] = option.label
    newResource[entity.name] = option.key
    this.setState({resource: newResource})
  }

  render() {
    return (<EditForm 
      formTarget={this.state.formTarget}
      entities={this.state.entities}
      onPressSave={this.onBoundPressSave} 
      onPressCancel={this.onBoundPressCancel} 
      setStringInputStateValue={this.boundSetStringInputStateValue}
      setImageInputStateValue={this.boundSetImageInputStateValue}
      setDateInputStateValue={this.boundSetDateInputStateValue}
      setSelectInputStateValue={this.boundSetSelectInputStateValue}
      asyncActionInProgress={this.state.asyncActionInProgress}
      progressCopy={this.state.progressCopy}></EditForm>)
  }
}

EditProfile.propTypes = {
  "onEditResource": PropTypes.func
}

// these are from Lifekeyrn
EditProfile.contextTypes = {
  // behavior
  "onSaveResource": PropTypes.func,

  // state
  "getEditResourceForm": PropTypes.func,
  "getEditResourceId": PropTypes.func,
  "getEditResourceName": PropTypes.func
}

export default EditProfile
