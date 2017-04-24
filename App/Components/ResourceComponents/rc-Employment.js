import React, { Component } from 'react'
import PropTypes from "prop-types"
import { Text, View } from 'react-native'

//Internal dependencies 
import LifekeyCard from "../LifekeyCard"
import LcEmployment from "../lc-Employment"


class RcEmployment extends Component {

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
    console.log("resourceType: ", resourceType, "onPressEdit: ", onPressEdit, "onPressDelete: ", onPressDelete, "onEditResource:", onEditResource)
    return (
      <View>
        { resourceType.items.map((resource, i) => { 
          return (
            <LifekeyCard key={i} headingText={resourceType.name} onPressEdit={() => onPressEdit(resource.form, resource.id)} onPressDelete={() => onPressDelete(resource.id)} >
              <LcEmployment {...resource}></LcEmployment>
            </LifekeyCard>
          )
        })}
      </View>
    )
  }
}

RcEmployment.propTypes = {
  resourceType: PropTypes.object,
  onPressEdit: PropTypes.func,
  onPressDelete: PropTypes.func,
  onEditResource: PropTypes.func
}

export default RcEmployment
