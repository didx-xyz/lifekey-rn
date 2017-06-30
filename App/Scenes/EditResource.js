// external dependencies
import React, { Component } from "react"
import { ToastAndroid } from "react-native"
import PropTypes from "prop-types"

// internal dependencies
import Api from "../Api"
import Scene from "../Scene"
import ConsentUser from "../Models/ConsentUser"
import Common from "../Common"
import EditForm from "./Forms/EditForm"
import Countries from "../Countries"
import Languages from "../Languages"
import Routes from "../Routes"
import Logger from '../Logger'

class EditResource extends Scene {
  
  constructor(...params) {
    super(...params)

    this.state = {
      "entities": [],
      "progressCopy": "Loading form and resources...",
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
    const values = keys.map(key => this.state.formTarget[key] || null)
    const id = this.context.getEditResourceId()
    const form = this.context.getEditResourceForm()

    // combine keys and values into a single object
    keys.forEach((key, i) => data[key] = values[i])

    const options = {
      "value": JSON.stringify({
        "form": form,
        ...data
      }),
      "entity": this.state.formTarget.label,
      "attribute": this.state.formTarget.label,
      "alias": this.state.formTarget.label,
      "schema": this.context.getEditResourceForm().split("_form")[0]
    }
 
    const newResource = {
      "id": id,
      ...options,
      entity: id,
      attribute: id,
      alias: id
    }

    // Check that label is not already used 

    // Set UI state
    const state = {
      "progressCopy": "Saving...",
      "asyncActionInProgress": true,
      "newResource": newResource
    }

    this.setState(state, () => {
      if (this.state.formTarget.id) {
        return Api.updateResource(newResource).then(
          this.onBoundSave
        ).catch(console.log)
      }
      else {
        return Api.createResource(
          options
        ).then(
          this.onBoundSave
        ).catch(alert)
      }
    })
    //End set UI state
  }

  onSave(response) {
    
    this.context.onSaveResource()

    let newResource = Object.assign(this.state.newResource, JSON.parse(this.state.newResource.value))

    newResource.id = newResource.id ? newResource.id : response.body.id // edited or saved

    ConsentUser.updateState(newResource)

    ToastAndroid.show('Resource saved!', ToastAndroid.SHORT)

    this.navigator.pop()
  }

  componentDidMount() {

    const id = this.context.getEditResourceId()
    const form = this.context.getEditResourceForm()
    
    Promise.all([
      Api.getResourceForm(form),
      this.loadResource(id)
    ]).then(values => {

      let formData = values[0]
      let resource = values[1]
      let state = { formTarget: resource ? resource : { "label" : `My ${this.context.getEditResourceName()}` } }

      this.initializeState(state, formData.entities)

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

  componentWillFocus() {

    this.setState({"asyncActionInProgress": true, "progressCopy": "Loading existing resources..."}, async () => {
      
      const resource = await this.loadResource(this.context.getEditResourceId())
      const state = { formTarget: resource ? resource : { "label" : `My ${this.context.getEditResourceName()}` } }
      this.setState(state)

    })

  }

  async loadResource(id) {     
    if (id) {
      return Api.getResource({ id })
    }
    else{
      return Promise.resolve()
    }  
  }

  initializeState(state, entities){
    
    entities.forEach(entity =>  {

      if(entity.type === "string"){
        entity.initialValue = (!state.formTarget[entity.name] && entity.name === "label") ? state.formTarget.label : state.formTarget[entity.name]
      }
      if (entity.type === "country") {

        const country = Countries.find(c => c["alpha-2"] === state.formTarget[entity.name])

        state.formTarget[entity.name + "__shown"] = false
        state.formTarget[entity.name + "__label"] = "Select a country"
        entity.initialValue = country ? country.name : "Select a country"

      }

      if (entity.type === "language") {

        const language = Languages.find(l => l["alpha3-b"] === state.formTarget[entity.name])
        state.formTarget[entity.name + "__shown"] = false
        state.formTarget[entity.name + "__label"] = "Select a language"
        entity.initialValue = language ? language.English : "Select a language"
      }

      if (entity.type === "photograph") {
        state.formTarget[entity.name + "__label"] = "Select a photograph"
        entity.initialValue = "Select a photograph"
      }

    })

    // Push all relevant form data into state 
    state.entities = [
      {"label": "Label", "name": "label", "type": "string"},
      ...entities
    ]

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

EditResource.propTypes = {
  "onEditResource": PropTypes.func
}

// these are from Lifekeyrn
EditResource.contextTypes = {
  // behavior
  "onSaveResource": PropTypes.func,

  // state
  "getEditResourceForm": PropTypes.func,
  "getEditResourceId": PropTypes.func,
  "getEditResourceName": PropTypes.func
}

export default EditResource
