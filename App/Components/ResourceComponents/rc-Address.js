import React, { Component } from 'react'
import PropTypes from "prop-types"
import { View } from 'react-native'

//Internal dependencies 
import LifekeyCard from "../LifekeyCard"
import LcHomeAddress from "../lc-HomeAddress"


class RcAddress extends Component {

  constructor(props) {
    super(props)
    this.state = {
      "resourceType": props.resourceType,
      "onPressEdit" : props.onPressEdit,
      "onPressDelete": props.onPressDelete,
      "onEditResource": props.onEditResource
    }
  }

  render() {

    const { resourceType, onPressEdit, onPressDelete, onEditResource } = this.props
    return (
      <View>
        { resourceType.items.map((resource, i) => { 
          return (
            <LifekeyCard key={i} headingText={resourceType.name} onPressEdit={() => onPressEdit(resource.form, resource.id)} onPressDelete={() => onPressDelete(resource.id)} >
              <LcHomeAddress {...resource} expanded={ false }/>
            </LifekeyCard>
          )
        })}
      </View>
    )
  }
}

export default RcAddress