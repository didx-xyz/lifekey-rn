// external dependencies
import React from "react"
import { View, Text, ToastAndroid, Dimensions, StatusBar, ScrollView } from "react-native"
import { Container, Content, Col } from "native-base"
import PropTypes from "prop-types"
import Toast from '../Utils/Toast'

// internal dependencies
import Api from "../Api"
import Scene from "../Scene"
import ConsentUser from "../Models/ConsentUser"
import EditForm from "../Components/SceneComponents/EditForm"
import LifekeyFooter from "../Components/LifekeyFooter"
import BackIcon from "../Components/BackIcon"
import LifekeyHeader from "../Components/LifekeyHeader"
import LifekeyHeaderWithTitle from "../Components/LifekeyHeaderWithTitle"
import ProgressIndicator from "../Components/ProgressIndicator"
import Countries from "../Countries"
import Languages from "../Languages"
import Design from "../DesignParameters"
import Common from "../Common"
import Palette from "../Palette"
import Routes from "../Routes"
import Logger from '../Logger'

class EditProfile extends Scene {

  constructor(...params) {
    super(...params)

    this.state = {
      "entities": [],
      "progressCopy": "Loading form and profile...",
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

      return Api.setProfile(data)
        .then(this.onBoundSave)
        .catch(console.log)
    })
    //End set UI state
  }

  onSave(response) {

    this.context.onSaveResource()

    ConsentUser.updateProfile(this.state.formTarget)
    ConsentUser.updateState(this.state.formTarget)

    Toast.show('Profile saved!', ToastAndroid.SHORT)

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

  initializeState(state, entities, resourcesByType) {

    let rtEmail = resourcesByType.find(rt => rt.name === "Email")
    const emailValue = (rtEmail && rtEmail.items.length) ? rtEmail.items[0].email : ''
    let rtAddress = resourcesByType.find(rt => rt.name === "Address")
    const addressValue = (rtAddress && rtAddress.items.length) ? `${rtAddress.items[0].streetAddress}, ${rtAddress.items[0].suburb}, ${rtAddress.items[0].province}` : ''
    let rtMobile = resourcesByType.find(rt => rt.name === "Mobile Phone")
    const mobileValue = (rtMobile && rtMobile.items.length) ? rtMobile.items[0].telephone : ''
    let rtPerson = resourcesByType.find(rt => rt.name === "Person")
    const personValue = (rtPerson && rtPerson.items.length) ? `${rtPerson.items[0].firstName}` : ''

    const profilePicValue = state.formTarget["image_uri"] ? state.formTarget["image_uri"] : 'Take a photo'

    console.log("*********************************** PROFILE PIC VALUE: ", profilePicValue)

    entities.forEach(entity => {

      console.log(" _____________________________________________________ ENTITY NAME: ", entity)

      if (entity.type === "string") {

        switch (entity.name) {
          case "label":
            state.formTarget[entity.name] = state.formTarget.label || "My profile"
            entity.initialValue = state.formTarget.label || "My profile"
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
          // case "profileImageUri":
          //   console.log("****************************************************** PIC ENTITY: ", entity)
          //   // state.formTarget["image_uri"] = state.formTarget["image_uri"] ? state.formTarget["image_uri"] : ''
          //   entity.initialValue = profilePicValue
          //   break
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

        switch (entity.name) {
          case "profileImageUri":
            // entity.initialValue = profilePicValue
            state.formTarget[entity.name] = profilePicValue
            entity.initialValue = profilePicValue
            break
          default:
            entity.initialValue = "Select a photograph"
            break
        }
      }
    })

    state.entities = [
      { "label": "Label", "name": "label", "type": "string" },
      ...entities
    ]
  }

  // This is necessary because the schema/form values of profile differ from the keys for the saved entity 
  matchProfileAndState(newValue, formTarget) {

    console.log("NEW VALUE: ", newValue)
    console.log("FORM TARGET: ", formTarget)

    Object.keys(newValue).map((key, i) => {
      switch (key) {
        case "label":
          formTarget["label"] = newValue["label"] || "My profile"
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
        case "profileImageUri":
          formTarget["image_uri"] = Common.ensureDataUrlIsCleanOfContext(newValue["profileImageUri"])
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

  setStringInputStateValue(entity, text) {
    let newResource = this.state.formTarget
    newResource[entity.name] = text
    this.setState({ resource: newResource })
  }
  setImageInputStateValue(entity, data) {
    let newResource = this.state.formTarget
    newResource[entity.name + "__label"] = data.fileName
    // newResource[entity.name] = data.data
    newResource[entity.name] = Common.ensureDataUrlHasContext(data.data)
    this.setState({ resource: newResource })
  }
  setDateInputStateValue(entity, date) {
    let newResource = this.state.formTarget
    newResource[entity.name] = date
    this.setState({ resource: newResource })
  }
  setSelectInputStateValue(entity, option) {
    let newResource = this.state.formTarget
    newResource[entity.name + "__label"] = option.label
    newResource[entity.name] = option.key
    this.setState({ resource: newResource })
  }



  render() {

    return (
      !this.state.asyncActionInProgress ?
        <Container>
          <View style={ styles.container }>
          <ScrollView style={ styles.formContainer }>
            <View style={ styles.formContent }>
              <EditForm 
                formTarget={this.state.formTarget}
                entities={this.state.entities}
                backgroundColor="transparent"
                onDelete={this.onBoundDelete}
                setStringInputStateValue={this.boundSetStringInputStateValue}
                setImageInputStateValue={this.boundSetImageInputStateValue}
                setDateInputStateValue={this.boundSetDateInputStateValue}
                setSelectInputStateValue={this.boundSetSelectInputStateValue}>
              </EditForm> 
            </View>
          </ScrollView>
          <View style={ styles.footerContainer }>
            <LifekeyFooter
              backgroundColor="transparent"
              leftButtonText="Cancel"
              onPressLeftButton={this.onBoundPressCancel} 
              rightButtonText="Save"
              onPressRightButton={this.onBoundPressSave} 
            />
          </View>
        </View>
        </Container>
        
      :
        <ProgressIndicator progressCopy={ this.state.progressCopy }></ProgressIndicator>
    )
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

const styles = {
  container: {
    "flex": 1,
    "paddingTop":15,
    "height": Dimensions.get('window').height - StatusBar.currentHeight,
    "width": "100%",
    "backgroundColor": Palette.consentOffBlack
  },
  "formContainer": {
    "margin": 10,
  },
  "formContent": {
    "borderRadius": 10,
    "backgroundColor": Palette.consentOffWhite
  },
  "footerContainer": {
    "height": Design.lifekeyFooterHeight,
    "width": "100%"
  }
}

export default EditProfile
