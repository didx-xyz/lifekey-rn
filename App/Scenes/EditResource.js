// external dependencies
import React from "react"
import { Picker, Text, TextInput, View, ScrollView } from "react-native"
import { Container } from "native-base"
import ModalPicker from "react-native-modal-picker"
import DatePicker from "react-native-datepicker"
import PropTypes from "prop-types"
import ImagePicker from "react-native-image-picker"
import ActivityIndicator from "ActivityIndicator"

// internal dependencies
import Api from "../Api"
import BackButton from "../Components/BackButton"
import Scene from "../Scene"
import Touchable from "../Components/Touchable"
import Countries from "../Countries"
import Languages from "../Languages"
import Palette from "../Palette"
import Routes from "../Routes"

class EditResource extends Scene {
  constructor(...params) {
    super(...params)

    this.state = {
      "entities": [],
      "progressCopy": "Loading...",
      "asyncActionInProgress": true
    }

    this.onBoundPressCancel = this.onPressCancel.bind(this)
    this.onBoundPressSave = this.onPressSave.bind(this)
    this.onBoundSave = this.onSave.bind(this)
    this.onBoundForm = this.onForm.bind(this)
    this.onBoundResource = this.onResource.bind(this)
  }

  onPressCancel() {
    this.navigator.pop()
  }

  onPressSave() {
    const data = {}
    const keys = this.state.entities.map(entity => entity.name)
    const values = keys.map(key => this.state[key] || null)

    // combine keys and values into a single object
    keys.forEach((key, i) => data[key] = values[i])

    const options = {
      "value": JSON.stringify({
        "form": this.context.getEditResourceForm(),
        ...data
      }),
      "entity": this.state.label,
      "attribute": this.state.label,
      "alias": this.state.label,
      "schema": this.context.getEditResourceForm().split("_form")[0]
    }

    // Set UI state 
    const state = {   
      "progressCopy": "Saving...",
      "asyncActionInProgress": true
    }
    this.setState(state)
    //End set UI state
    
    if (this.state.id) {
      var id = this.context.getEditResourceId()
      return Api.updateResource({
        "id": this.state.id,
        ...options,
        entity: id,
        attribute: id,
        alias: id
      }).then(
        this.onBoundSave
      ).catch(console.log)
    }

    return Api.createResource(
      options
    ).then(
      this.onBoundSave
    ).catch(alert)
  }

  onSave() {
    this.context.onSaveResource()
    this.navigator.pop()
  }

  componentDidMount() {
    const form = this.context.getEditResourceForm()

    Api.getResourceForm(form)
       .then(this.onBoundForm)
       .catch(error => {
          console.log("Error in loading resource form: ", error)
        })

    this.loadResource()
  }

  componentWillFocus() {
    this.loadResource()
  }

  loadResource() {
    const id = this.context.getEditResourceId()

    if (id) {
      Api.getResource({ id })
        .then(this.onBoundResource)
        .catch(error => {
          console.log("Error in loading resource: ", error)
        })
    }
  }

  onResource(data) {
    const state = {
      "id": data.body.id,
      ...JSON.parse(data.body.value)
    }

    this.setState(state)
  }

  onForm(data) {
    // TODO: handle error conditions

    let state = {
      "asyncActionInProgress": false,
      "entities": [
        {"label": "Label", "name": "label", "type": "string"},
        ...data.entities
      ]
    }

    data.entities.forEach((entity) => {
      if (entity.type === "country") {
        state[entity.name + "__shown"] = false
        state[entity.name + "__label"] = "Select a country"
      }

      if (entity.type === "language") {
        state[entity.name + "__shown"] = false
        state[entity.name + "__label"] = "Select a language"
      }

      if (entity.type === "photograph") {
        state[entity.name + "__label"] = "Select a photograph"
      }
    })

    this.setState(state)
  }

  renderEntity(entity, i) {
    const formField = {
      ...styles.formField
    }

    if (i === 0) {
      formField.paddingTop = 5
    }

    if (i === this.state.entities.length - 1) {
      formField.paddingBottom = 5
      formField.borderBottomWidth = 0
    }

    return (
      <View style={formField} key={i}>
        <View style={styles.formFieldLabel}>
          <Text style={styles.formFieldLabelText}>
            {entity.label.toUpperCase()}
          </Text>
        </View>
        <View style={styles.formFieldInput}>
          {this.renderInput(entity, i)}
        </View>
      </View>
    )
  }

  renderInput(entity, i) {
    if (entity.type === "string") {
      return this.renderStringInput(entity, i)
    }

    if (entity.type === "country") {
      return this.renderCountryInput(entity, i)
    }

    if (entity.type === "date") {
      return this.renderDateInput(entity, i)
    }

    if (entity.type === "language") {
      return this.renderLanguageInput(entity, i)
    }

    if (entity.type === "photograph") {
      return this.renderPhotographInput(entity, i)
    }

    return (
      <Text>unknown type</Text>
    )
  }

  renderStringInput(entity, i) {
    return (
      <TextInput
        style={styles.textInput}
        value={this.state[entity.name]}
        onChangeText={text => this.setState({[entity.name]: text})}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="done"
        underlineColorAndroid="rgba(0, 0, 0, 0)"
      />
    )
  }

  renderCountryInput(entity, i) {
    const data = Countries.map((country) => {
      return {
        "key": country["alpha-2"],
        "label": country["name"],
        "selected": this.state[entity.name] === country["alpha-2"]
      }
    })

    return (
      <ModalPicker
        data={data}
        style={styles.countryPicker}
        initValue="Select a country"
        onChange={(option) => {
          this.setState({
            [entity.name + "__label"]: option.label,
            [entity.name]: option.key
          })
        }}
      >
        <TextInput
          style={styles.countryLabel}
          editable={false}
          placeholder="Select a country"
          value={this.state[entity.name + "__label"]}
        />
      </ModalPicker>
    )
  }

  renderDateInput(entity, i) {
    return (
      <DatePicker
        date={this.state[entity.name]}
        mode="date"
        placeholder="Select a date"
        format="YYYY-MM-DD"
        minDate="1916-01-01"
        maxDate="2017-01-01"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        showIcon={false}
        customStyles={styles.dateInput}
        onDateChange={date => {this.setState({[entity.name]: date})}}
      />
    )
  }

  renderLanguageInput(entity, i) {
    const data = Languages.map((country) => {
      return {
        "key": country["alpha3-b"],
        "label": country["English"],
        "selected": this.state[entity.name] === country["alpha3-b"]
      }
    })

    return (
      <ModalPicker
        data={data}
        initValue="Select a language"
        onChange={(option) => {
          this.setState({
            [entity.name + "__label"]: option.label,
            [entity.name]: option.key
          })
        }}
      >
        <TextInput
          style={styles.languageLabel}
          editable={false}
          placeholder="Select a language"
          value={this.state[entity.name + "__label"]}
        />
      </ModalPicker>
    )
  }

  renderPhotographInput(entity, i) {
    const pick = () => {
      ImagePicker.showImagePicker({
        maxWidth: 1000,
        maxHeight: 1000,
        quality: 0.6
      }, (response) => {
        if (response.fileSize > 1024 /* b → kb */ * 1024 /* kb → mb */ * 7.5) {
          alert("file is too big")
          return
        }

        this.setState({
          [entity.name + "__label"]: response.fileName,
          [entity.name]: response.data
        })
      })
    }


    return (
      <Touchable onPress={pick}>
        <View style={styles.photographLabel}>
          <Text style={styles.photographLabelText}>
            {this.state[entity.name + "__label"]}
          </Text>
        </View>
      </Touchable>
    )
  }

  render() {
    return (
      <Container>
        <BackButton navigator={this.navigator} />
        <View style={styles.content}>
                       
            <View style={styles.fields}>
            {
              !this.state.asyncActionInProgress ? 
                <ScrollView style={styles.scroll}>  
                  <View style={styles.card}>
                    {this.state.error !== "" &&
                      <View style={styles.error}>
                        <Text style={styles.errorText}>
                          {this.state.error}
                        </Text>
                      </View>
                    }
                    {this.state.entities.map((entity, i) => this.renderEntity(entity, i))}
                  </View> 
                </ScrollView>
              :
                <View style={styles.progressContainer}>
                  <ActivityIndicator color="white" style={styles.progressIndicator}/> 
                  <Text style={styles.progressText}>{this.state.progressCopy}</Text>
                </View>
            }
            </View> 
          <View style={styles.buttons}>
            <View style={styles.cancelButton}>
              <Touchable onPress={this.onBoundPressCancel}>
                <Text style={styles.cancelButtonText}>
                  Cancel
                </Text>
              </Touchable>
            </View>
            <View style={styles.saveButton}>
              <Touchable onPress={this.onBoundPressSave}>
                <Text style={styles.saveButtonText}>
                  Save
                </Text>
              </Touchable>
            </View>
          </View>
        </View>
      </Container>
    )
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
  "getEditResourceId": PropTypes.func
}

const styles = {
  "content": {
    "backgroundColor": "#323a43"
  },
  "fields": {
    "height": "90%",
    "width": "100%"
  },
  "scroll": {
    "padding": 10
  },
  "card": {
    "backgroundColor": "#fff",
    "padding": 10
  },
  "progressContainer": {
    // "backgroundColor": Palette.consentBlue,
    "flex": 1,
    "alignItems": "center",
    "justifyContent": "center"
  },
  "progressIndicator": {
    "width": 75,
    "height": 75 
  },
  "progressText":{
    "color": "white"
  },
  "formField": {
    "paddingTop": 5,
    "paddingBottom": 5,
    "borderBottomWidth": 1,
    "borderBottomColor": "#efefef",
    "flexDirection": "row",
    "alignItems": "center",
    "justifyContent": "center",
  },
  "formFieldLabel": {
    "height": 40,
    "width": "35%",
    "justifyContent": "center",
    // "backgroundColor": "red"
  },
  "formFieldLabelText": {
    "fontWeight": "bold",
    "fontSize": 11,
    "color": "#888"
  },
  "formFieldInput": {
    "flex": 1,
    "height": 40,
    "borderBottomWidth": 0
  },
  "textInput": {
    "flex": 1,
    "height": 40,
    "color": "#666",
    "fontWeight": "100",
    "fontSize": 14,
    "height": 40
  },
  "countryPicker":{
    "paddingTop": 10,
    "height": 40,
    // "backgroundColor": "orange"
  },
  "countryLabel": {
    "flex": 1,
    "height": 40,
    "color": "#666",
    "fontWeight": "100",
    "paddingTop": 10,
    "paddingBottom": 10,
    "fontSize": 14,
    // "backgroundColor": "green"
  },
  "dateInput": {
    "dateTouchBody": {
      "width": "100%",
      "height": "100%",
      // "backgroundColor": "blue"
    },
    "dateInput": {
      "borderWidth": 0,
      "alignItems": "center",
      "padding": 0,
      "height": null,
      "alignItems": "center",
      "justifyContent": "center",
    },
    "dateText": {
      "flex": 1,
      "height": 40,
      "color": "#666",
      "fontWeight": "100",
      "fontSize": 14,
    },
    "placeholderText": {
      "flex": 1,
      "marginTop": 10,
      // "backgroundColor": "yellow",
      // "height": 20,
      "color": "#666",
      "fontWeight": "100",
      "fontSize": 14,
      "textAlign": "left",
    }
  },
  "languageLabel": {
    "flex": 1,
    "height": 40,
    "color": "#666",
    "fontWeight": "100",
    "paddingTop": 10,
    "paddingBottom": 10,
    "fontSize": 14
  },
  "photographLabel": {
    "flex": 1,
    "height": 40,
    "justifyContent": "center"
  },
  "photographLabelText": {
    "fontWeight": "100",
    "color": "#666",
    "fontSize": 14
  },
  "buttons": {
    "height": "10%",
    "width": "100%",
    "flexDirection": "row",
    "paddingBottom": 10
  },
  "cancelButton": {
    "flex": 1,
    "justifyContent": "center",
    "paddingLeft": 45
  },
  "cancelButtonText": {
    "color": "#fff",
    "fontSize": 16,
    "textAlign": "left"
  },
  "saveButton": {
    "flex": 1,
    "justifyContent": "center",
    "alignItems": "flex-end",
    "paddingRight": 45
  },
  "saveButtonText": {
    "color": "#fff",
    "fontSize": 16,
    "textAlign": "right"
  },
  "error": {
    "flex": 1
  },
  "errorText": {
    "textAlign": "center",
    "color": "red"
  }
}

export default EditResource
