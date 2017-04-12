// external dependencies
import React from "react"
import { Picker, Text, TextInput, View, ScrollView } from "react-native"
import { Container } from "native-base"
import ModalPicker from "react-native-modal-picker"
import DatePicker from "react-native-datepicker"

// internal dependencies
import BackButton from "../Components/BackButton"
import Scene from "../Scene"
import Touchable from "../Components/Touchable"
import Countries from "../Countries"
import Languages from "../Languages"

class EditResource extends Scene {
  constructor(...params) {
    super(...params)

    this.state = {
      "entities": []
    }

    this.onBoundPressCancel = this.onPressCancel.bind(this)
    this.onBoundPressSave = this.onPressSave.bind(this)
  }

  onPressCancel() {
    alert("cancel")
  }

  onPressSave() {
    alert("save")
  }

  componentDidMount() {
    fetch(this.props.form)
      .then(response => response.json())
      .then(data => this.handleData(data))
  }

  handleData(data) {
    // TODO: handle error conditions

    let state = {
      "entities": data.entities
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
          initValue="Select a country"
          onChange={(option) => {
            this.setState({
              [entity.name + "__label"]: option.label,
              [entity.name]: option.value
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
        "key": country["alpha-3-b"],
        "label": country["English"],
        "selected": this.state[entity.name] === country["alpha-3-b"]
      }
    })

    return (
      <ModalPicker
          data={data}
          initValue="Select a language"
          onChange={(option) => {
            this.setState({
              [entity.name + "__label"]: option.label,
              [entity.name]: option.value
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

  render() {
    return (
      <Container>
        <BackButton navigator={this.navigator} />
        <View style={styles.content}>
          <View style={styles.fields}>
            <ScrollView style={styles.scroll}>
              <View style={styles.card}>
                {this.state.entities.map((entity, i) => this.renderEntity(entity, i))}
              </View>
            </ScrollView>
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
  "form": React.PropTypes.string
}

EditResource.defaultProps = {
  "form": "http://schema.cnsnt.io/person_form"
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
  "formField": {
    "paddingTop": 15,
    "paddingBottom": 15,
    "borderBottomWidth": 1,
    "borderBottomColor": "#efefef",
    "flexDirection": "row"
  },
  "formFieldLabel": {
    "height": 20,
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
    "height": 20
  },
  "textInput": {
    "flex": 1,
    "color": "#666",
    "fontWeight": "100",
    "fontSize": 14
  },
  "countryLabel": {
    "color": "#666",
    "fontWeight": "100",
    "height": 20,
    "paddingTop": 10,
    "paddingBottom": 10,
    "fontSize": 14
  },
  "dateInput": {
    "dateTouchBody": {
      "width": "100%",
      "height": "100%"
    },
    "dateInput": {
      "borderWidth": 0,
      "alignItems": "flex-start",
      "justifyContent": "center",
      "padding": 0,
      "height": null
    },
    "dateText": {
      "color": "#666",
      "fontWeight": "100",
      "fontSize": 14
    },
    "placeholderText": {
      "color": "#666",
      "fontWeight": "100",
      "fontSize": 14
    }
  },
  "languageLabel": {
    "color": "#666",
    "fontWeight": "100",
    "height": 20,
    "paddingTop": 10,
    "paddingBottom": 10,
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
  }
}

export default EditResource
