// external dependencies
import React, { Component } from "react"
import { ScrollView, View, Text, TextInput } from "react-native"
import { Container } from "native-base"

// internal dependencies
import Touchable from "../../Components/Touchable"
import { request } from "../../Requests"

const fields = [
  {
    "name": "to",
    "label": "To",
    "value": "example"
  },
  {
    "name": "purpose",
    "label": "Purpose",
    "value": "To test things"
  },
  {
    "name": "license",
    "label": "License",
    "value": "Some old gubbins"
  },
  {
    "name": "entity1",
    "label": "Entity 1",
    "value": JSON.stringify({
      "name": "Your identity",
      "address": "http://schema.cnsnt.io/person"
    })
  },
  {
    "name": "entity2",
    "label": "Entity 2",
    "value": JSON.stringify({
      "name": "The road on which you live",
      "address": "http://schema.cnsnt.io/address/streetAddress"
    })
  }
]

class DebugCreateIsa extends Component {
  constructor(...params) {
    super(...params)

    this.state = {}

    fields.forEach(field => {
      this.state[field.name] = field.value
    })
  }

  onCreate() {
    const options = {
      "method": "POST",
      "body": JSON.stringify({
        "to": this.state.to,
        "purpose": this.state.purpose,
        "license": this.state.license,
        "required_entities": [
          JSON.parse(this.state.entity1),
          JSON.parse(this.state.entity2)
        ]
      })
    }

    console.log(options)

    request("/management/isa", options).then(data => {
      console.log(data)
    }).catch(response => {
      console.log(response)
    })
  }

  render() {
    return (
      <Container>
        <ScrollView style={styles.scroll}>
          {fields.map((field, i) => {
            return (
              <View style={styles.formField} key={i}>
                <View style={styles.formFieldLabel}>
                  <Text style={styles.formFieldLabelText}>
                    {field.label}
                  </Text>
                </View>
                <View style={styles.formFieldInput}>
                  <TextInput
                    style={styles.textInput}
                    value={this.state[field.name]}
                    onChangeText={text => this.setState({[field.name]: text})}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                    underlineColorAndroid="rgba(0, 0, 0, 0)"
                  />
                </View>
              </View>
            )
          })}
          <Touchable onPress={() => this.onCreate()}>
            <View>
              <Text>Create</Text>
            </View>
          </Touchable>
        </ScrollView>
      </Container>
    )
  }
}

const styles = {
  "content": {
    "backgroundColor": "#323a43"
  },
  "scroll": {
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
    "height": 40,
    "borderBottomWidth": 0
  },
  "textInput": {
    "flex": 1,
    "color": "#666",
    "fontWeight": "100",
    "fontSize": 14,
    "height": 40
  },
  "error": {
    "flex": 1
  },
  "errorText": {
    "textAlign": "center",
    "color": "red"
  }
}

export default DebugCreateIsa
