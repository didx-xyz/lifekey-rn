// external dependencies
import React, { Component } from "react"
import { View, Text } from "react-native"
import { Card, CardItem } from "native-base"
import Icon from "react-native-vector-icons/FontAwesome"
import PropTypes from "prop-types"

// internal dependencies
import Touchable from "../Components/Touchable"
import Design from "../DesignParameters"
import Palette from "../Palette"

class FormComponent extends Component {
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

  }

  // onPressCancel() {
  //   this.props.onPressCancel()
  // }

  // onPressSave() {
    
  // }

  // onSave(response) {
    
  //   this.context.onSaveResource()

  //   let newResource = Object.assign(this.state.newResource, JSON.parse(this.state.newResource.value))

  //   newResource.id = newResource.id ? newResource.id : response.body.id // edited or saved

  //   ConsentUser.updateState(newResource)

  //   ToastAndroid.show('Resource saved!', ToastAndroid.SHORT)

  //   this.navigator.pop()
  // }

  render(){
    return (
      <Container>
        <BackButton navigator={this.navigator} />
        <View style={styles.content}>
          <View style={styles.heading}>
            <Text style={styles.headingText}>{this.context.getEditResourceName().toUpperCase()}</Text>
          </View>
          <View style={styles.fields}>
            {
              !this.props.asyncActionInProgress ?
                <ScrollView style={styles.scroll}>
                  <View style={styles.card}>
                    {this.state.error !== "" &&
                      <View style={styles.error}>
                        <Text style={styles.errorText}>
                          {this.state.error}
                        </Text>
                      </View>
                    }
                    { /* this.state.entities.map((entity, i) => this.renderEntity(entity, i)) */ }
                    { this.props.entities.map((entity, i) => this.renderEntity(this, entity, i)) }
                  </View>
                </ScrollView>
              :
                <View style={styles.progressContainer}>
                  <ActivityIndicator color="white" style={styles.progressIndicator}/>
                  <Text style={styles.progressText}>{this.state.progressCopy}</Text>
                </View>
            }
          </View>
            {
              this.props.asyncActionInProgress ? null
              :
              (
                <View style={styles.buttons}>
                  <View style={styles.cancelButton}>
                    <Touchable onPress={this.props.onPressCancel}>
                      <Text style={styles.cancelButtonText}>
                        Cancel
                      </Text>
                    </Touchable>
                  </View>
                  <View style={styles.saveButton}>
                    <Touchable onPress={this.props.onPressSave}>
                      <Text style={styles.saveButtonText}>
                        Save
                      </Text>
                    </Touchable>
                  </View>
                </View>
              )
            }
        </View>
      </Container>
    )
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
            {/* entity.label.toUpperCase() */}
          </Text>
        </View>
        <View style={styles.formFieldInput}>
          { this.renderInput(entity, i) }
        </View>
      </View>
    )
  }

  renderInput(entity, i) {

    if (entity.type === "string") {
      return this.renderStringInput(entity, i)
    }

    if (entity.type === "date") {
      return this.renderDateInput(entity, i)
    }

    if (entity.type === "photograph") {
      return this.renderPhotographInput(entity, i)
    }

    if (entity.type === "country") {
      return this.renderCountryInput(entity, i)
    }

    if (entity.type === "language") {
      return this.renderLanguageInput(entity, i)
    }

    if (entity.type === "select") {
      return this.renderNativeSelectDataInput(entity, i)
    }

    return (
      <Text>unknown type</Text>
    )
  }

  renderStringInput(entity, i) {

    const value = (!this.state[entity.name] && entity.name === "label") ? this.state.label : this.state[entity.name]

    return (
      <TextInput
        style={styles.textInput}
        value={this.state[entity.name]}
        onChangeText={text => this.setState({[entity.name]: text})}
        placeholder={entity.initialValue}
        autoCapitalize="sentences"
        autoCorrect={false}
        returnKeyType="done"
        underlineColorAndroid="rgba(0, 0, 0, 0)"
      />
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
        maxDate="2099-01-01"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        showIcon={false}
        customStyles={styles.dateInput}
        onDateChange={date => {this.setState({[entity.name]: date})}}
      />
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

    // A text element is used to display a picture - TODO: change

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

  renderCountryInput(entity, i) {
    const data = Countries.map((country) => {
      return {
        "key": country["alpha-2"],
        "label": country["name"],
        "selected": this.state[entity.name] === country["alpha-2"]
      }
    })

    const country = Countries.find(c => c["alpha-2"] === this.state[entity.name])
    return this.renderSelectInput(entity, data, country  || entity.initialValue)

  }

  renderLanguageInput(entity, i) {
    const data = Languages.map((country) => {
      return {
        "key": country["alpha3-b"],
        "label": country["English"],
        "selected": this.state[entity.name] === country["alpha3-b"]
      }
    })

    const language = Languages.find(l => l["alpha3-b"] === this.state[entity.name])
    return this.renderSelectInput(entity, data, language || entity.initialValue)
  }

  renderNativeSelectDataInput(entity, i){
    const data = entity.options.map((value) => {
      return {
        "key": value,
        "label": value,
        "selected": this.state[entity.name] === value
      }
    })

    const initialValue = "Select an option"
    return this.renderSelectInput(entity, data, initialValue)
  }

  renderSelectInput(entity, data, initialValue) {
    return (
      <ModalPicker
          data={data}
          style={styles.selectElement}
          selectStyle={styles.selectPickerWithValue}
          selectTextStyle={styles.textInput}
          initValue={initialValue}
          onChange={(option) => {
            this.setState({
              [entity.name + "__label"]: option.label,
              [entity.name]: option.key
            })
          }} />
    )
  }
}

FormComponent.propTypes = {
  "onEditResource": PropTypes.func
}

// these are from Lifekeyrn
FormComponent.contextTypes = {
  // behavior
  "onSaveResource": PropTypes.func,

  // state
  "getEditResourceForm": PropTypes.func,
  "getEditResourceId": PropTypes.func,
  "getEditResourceName": PropTypes.func
}

const styles = {
  "content": {
    "height": "100%",
    "backgroundColor": Palette.consentOffBlack
  },
  "heading": {
    "height": "10%",
    "alignItems": "center",
    "justifyContent": "center"
  },
  "headingText": {
    "textAlign": "left",
    "color": "white",
    "fontSize": 16
  },
  "fields": {
    "height": "80%",
    "width": "100%"
  },
  "scroll": {
    "padding": 10
  },
  "card": {
    "backgroundColor": "#fff",
    "paddingLeft": 10,
    "paddingRight": 10,
  },
  "progressContainer": {
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
    "justifyContent": "center"
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
    "textAlign": "left"
  },
  "selectElement":{
    "flex": 1,
    "flexDirection": "row",
    "justifyContent": "flex-start",
    "alignItems": "stretch"
  },
  "selectPickerWithoutValue":{
    "backgroundColor": Palette.consentGrayLightest
  },
  "selectPickerWithValue":{
    "borderWidth": 0
  },
  "countryPicker":{
    "paddingTop": 10,
    "height": 40
  },
  "countryLabel": {
    "flex": 1,
    "height": 40,
    "color": "#666",
    "fontWeight": "100",
    "paddingTop": 10,
    "paddingBottom": 10,
    "fontSize": 14,
    "backgroundColor": "green"
  },
  "datePicker":{
    "backgroundColor": "magenta"
  },
  "dateInput": {
    "dateTouchBody": {
      "width": "100%",
      "height": "100%",
      "alignItems": "center",
      "justifyContent": "center",
    },
    "dateInput": {
      "borderWidth": 0,
      "alignItems": "center",
      "padding": 0,
      "flex": 1,
      "alignItems": "center",
      "justifyContent": "center",
    },
    "dateText": {
      "color": "#666",
      "fontWeight": "100",
      "fontSize": 14,
    },
    "placeholderText": {
      "color": "#666",
      "fontWeight": "100",
      "fontSize": 14,
      "textAlign": "left",
    }
  },
  "languagePicker":{
    "paddingTop": 10,
    "height": 40
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
    "justifyContent": "center",
    "alignItems": "center"
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
export default FormComponent
