// external dependencies
import React, { Component } from "react"
import { Text, TextInput, View, ToastAndroid, Image } from "react-native"
import ModalPicker from "react-native-modal-selector"
import DatePicker from "react-native-datepicker"
import PropTypes from "prop-types"
import ImagePicker from "react-native-image-picker"

// internal dependencies
import Touchable from "../../Components/Touchable"
import Countries from "../../Countries"
import Languages from "../../Languages"
import Common from "../../Common"
import Palette from "../../Palette"
import Toast from '../../Utils/Toast'
import TrashIcon from "../../Components/TrashIcon"
import DesignParameters from "../../DesignParameters";
import style from "react-native-modal-selector/style";

class EditForm extends Component {
  state = {
    identificationType: '',
    issuingCountry: '',
    country: ''
  }

  render() {
    return (
      <View style={Object.assign({}, styles.content, { backgroundColor: this.props.backgroundColor })}>
        <View style={styles.card}>
          <View style={styles.heading}>
            <Text style={styles.headingText}>{this.context.getEditResourceName()}</Text>
            {!!this.context.getEditResourceId() && this.context.getEditResourceName() !== "Person" &&
              <Touchable onPress={this.props.onDelete} hitSlop={Common.touchableArea}>
                <View style={styles.deleteContainer}>
                  <TrashIcon width={30} height={30} stroke={Palette.consentGrayDark}></TrashIcon>
                </View>
              </Touchable>
            }
          </View>
          {this.props.error !== "" &&
            <View style={styles.error}>
              <Text style={styles.errorText}>
                {this.props.error}
              </Text>
            </View>
          }
          {this.props.entities.map((entity, i) => this.renderEntity(entity, i))}
        </View>
      </View>
    )
  }

  renderEntity(entity, i) {

    const formField = {
      ...styles.formField
    }

    if (i === 0) {
      formField.paddingTop = 5
    }

    if (i === this.props.entities.length - 1) {
      formField.paddingBottom = 5
      formField.borderBottomWidth = 0
    }

    return (
      <View style={formField} key={i}>
        <View style={styles.formFieldLabel} >
          <Text style={entity.type === "photograph" ? Object.assign({}, styles.formFieldLabelText, { "marginTop": -50 }) : styles.formFieldLabelText}>
            {entity.label.toUpperCase()}
          </Text>
        </View>
        <View style={entity.type === "photograph" ? Object.assign({}, styles.formFieldInput, { "height": 95, "paddingTop": 10 }) : styles.formFieldInput}>
          {this.renderInput(entity, i)}
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

    const keyboardType = this.determineKeyboardType(entity)

    return (
      <TextInput
        style={styles.textInput}
        value={this.props.formTarget[entity.name]}
        onChangeText={text => this.props.setStringInputStateValue(entity, text)}
        placeholder={entity.initialValue}
        autoCapitalize="sentences"
        autoCorrect={false}
        keyboardType={keyboardType}
        returnKeyType="done"
        underlineColorAndroid="rgba(0, 0, 0, 0)"
      />
    )
  }

  determineKeyboardType(entity) {

    let keyboardType

    switch (entity.name) {
      case ("email"):
        keyboardType = "email-address"
        break
      case ("contactEmail"):
        keyboardType = "email-address"
        break
      case ("contactTelephone"):
        keyboardType = "numeric"
        break
      case ("mobile"):
        keyboardType = "numeric"
        break
      case ("telephone"):
        keyboardType = "numeric"
        break
      case ("postOfficeBoxNumber"):
        keyboardType = "numeric"
        break
      case ("postalCode"):
        keyboardType = "numeric"
        break
      default:
        keyboardType = "default"
    }

    return keyboardType
  }

  renderDateInput(entity, i) {
    return (
      <DatePicker
        date={this.props.formTarget[entity.name]}
        mode="date"
        placeholder="Select a date"
        format="YYYY-MM-DD"
        minDate="1916-01-01"
        maxDate="2099-01-01"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        showIcon={false}
        customStyles={styles.dateInput}
        onDateChange={date => this.props.setDateInputStateValue(entity, date)}
      />
    )
  }

  renderPhotographInput(entity, i) {
    const pick = () => {
      ImagePicker.showImagePicker({
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.6
      }, (response) => {
        if (response.data && response.data.length > 65535) { // (2^16 - 1)) {
          Toast.show('Image is too large. Please try again...', ToastAndroid.LONG)
          return
        }
        if (response.data && response.data.length)
          this.props.setImageInputStateValue(entity, response)
      })
    }

    const imageUri = Common.ensureDataUrlHasContext(this.props.formTarget[entity.name])

    console.log("IMAGE URI IN FORM: ", imageUri)

    // A text element is used to display a picture - TODO: change this.props.formTarget[entity.name + "__label"]
    return (
      <Touchable onPress={pick}>
        <View style={styles.photographLabel}>
          <Image style={styles.fullImage} width={50} height={85} source={{ uri: imageUri, scale: 1 }} />
        </View>
      </Touchable>
    )
  }

  renderCountryInput(entity, i) {
    const data = Countries.map((country) => {
      return {
        "key": country["alpha-2"],
        "label": country["name"],
        "selected": this.props.formTarget[entity.name] === country["alpha-2"]
      }
    })

    return this.renderSelectInput(entity, data, entity.initialValue)

  }

  renderLanguageInput(entity, i) {
    const data = Languages.map((country) => {
      return {
        "key": country["alpha3-b"],
        "label": country["English"],
        "selected": this.props.formTarget[entity.name] === country["alpha3-b"]
      }
    })

    return this.renderSelectInput(entity, data, entity.initialValue)
  }

  renderNativeSelectDataInput(entity, i) {
    const data = entity.options.map((value) => {
      return {
        "key": value,
        "label": value,
        "selected": this.props.formTarget[entity.name] === value
      }
    })

    const initialValue = "Select an option"
    return this.renderSelectInput(entity, data, initialValue)
  }

  selectedVal(fieldName, val) {
    switch (fieldName) {
      case "identificationType":
        this.setState({ identificationType: val });
        break;
      case "issuingCountry":
        this.setState({ issuingCountry: val });
        break;
      case "country":
        this.setState({ country: val });
        break;
    }
  }

  renderSelectVal(fieldName) {
    switch (fieldName) {
      case "identificationType":
        return this.renderSelectVal1('identificationType', "Identification");
      case "issuingCountry":
        return this.renderSelectVal1('issuingCountry', "Country Name");
      case "country":
        return this.renderSelectVal1('country', "Country Name");
    }
  }

  renderSelectVal1(value, placeholder) {
    return (<TextInput
      style={styles.modalTextInput}
      editable={false}
      placeholder={placeholder}
      placeholderTextColor = "#666666"
      value={this.state[value]} />);
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
          this.selectedVal(entity.name, option.label);
          this.props.setSelectInputStateValue(entity, option)
        }} >
        {this.renderSelectVal(entity.name)}
      </ModalPicker>
    )
  }

}

EditForm.propTypes = {
  "onEditResource": PropTypes.func
}

// these are from Lifekeyrn
EditForm.contextTypes = {
  // behavior
  "onSaveResource": PropTypes.func,

  // state
  "getEditResourceForm": PropTypes.func,
  "getEditResourceId": PropTypes.func,
  "getEditResourceName": PropTypes.func
}

const fontSize = 18
const styles = {
  "content": {
    "alignSelf": "center",
    "alignItems": "center",
    "justifyContent": "center",
    "width": "100%",
  },
  "card": {
    "backgroundColor": Palette.consentOffWhite,
    "margin": 10,
    "width": "100%",
    paddingLeft: 15,
    paddingRight: 15,
  },
  "heading": {
    "height": 40,
    "width": "100%",
    "flexDirection": "row",
    "alignItems": "flex-start",
    "justifyContent": "space-between",
    borderBottomWidth: 1,
    borderBottomColor: Palette.consentBlue,
  },
  "headingText": {
    "flex": 4,
    "textAlign": "left",
    "color": Palette.consentBlue,
    "fontSize": 20
  },
  "deleteContainer": {
    "flex": 1,
    "alignItems": "center",
    "justifyContent": "space-between",
  },
  "formField": {
    "paddingTop": 5,
    "paddingBottom": 5,
    "borderBottomWidth": 1,
    "borderBottomColor": "#efefef",
    "flexDirection": "row",
    "alignItems": "center",
    "justifyContent": "center",
    "minHeight": 56
  },
  "formFieldLabel": {
    "height": 40,
    "width": "35%",
    "justifyContent": "center"
  },
  "formFieldLabelText": {
    "fontWeight": "bold",
    "fontSize": 11,
    color: "#888888"
  },
  "formFieldInput": {
    "flex": 1,
    "height": 40,
    "borderBottomWidth": 0
  },
  "selectPickerWithValue": {
    flex: 1,
    height: 40,
    "borderWidth": 0,
  },
  "textInput": {
    flex: 1,
    height: 40,
    color: "#666666",
    fontWeight: "100",
    fontSize: fontSize,
    textAlign: "left",
  },
  "selectElement": {
    "flex": 1,
    "flexDirection": "row",
    "justifyContent": "flex-start",
    "alignItems": "stretch"
  },
  "selectPickerWithoutValue": {
    "backgroundColor": Palette.consentGrayLightest
  },
  "selectPickerWithValue": {
    "borderWidth": 0
  },
  "countryPicker": {
    "paddingTop": 10,
    "height": 40
  },
  "countryLabel": {
    "flex": 1,
    "height": 40,
    color: "#666666",
    "fontWeight": "100",
    "paddingTop": 10,
    "paddingBottom": 10,
    "fontSize": fontSize,
    backgroundColor: "#009900"
  },
  "datePicker": {
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
      "flex": 1,
      "alignItems": "flex-start",
      "justifyContent": "center",
    },
    "dateText": {
      color: "#666666",
      "fontWeight": "100",
      "fontSize": fontSize,
    },
    "placeholderText": {
      color: "#666666",
      "fontWeight": "100",
      "fontSize": fontSize,
      // "textAlign": "left",
    }
  },
  "languagePicker": {
    "paddingTop": 10,
    "height": 40
  },
  "languageLabel": {
    "flex": 1,
    "height": 40,
    color: "#666666",
    "fontWeight": "100",
    "paddingTop": 10,
    "paddingBottom": 10,
    "fontSize": fontSize
  },
  "photographLabel": {
    "flex": 1,
    "minHeight": 80,
    "justifyContent": "center",
    "alignItems": "flex-start"
  },
  "fullImage": {
    "width": "100%",
    "height": "100%",
    "resizeMode": "cover",
  },
  "photographLabelText": {
    "fontWeight": "100",
    color: "#666666",
    "fontSize": fontSize
  },
  "error": {
    "flex": 1
  },
  "errorText": {
    "textAlign": "center",
    "color": "red"
  },
  "modalTextInput": {
    "height": 40,
    "color": "#666666",
    "paddingRight": 10,
    "fontWeight": "100",
    "fontSize": fontSize,
    "textAlign": "left"
  }
}

export default EditForm
