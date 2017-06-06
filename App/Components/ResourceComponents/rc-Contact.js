import React, { Component } from 'react'
import PropTypes from "prop-types"
import { View } from 'react-native'

//Internal dependencies 
import LifekeyCard from "../LifekeyCard"
import LcContactDetail from "../lc-ContactDetail"


class RcContact extends Component {

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

          const pendingState = resource.pending ? { "opacity": 0.3 } : {}
          const onEdit = !resource.pending ? () => onPressEdit(resource.form, resource.id, resourceType.name) : null
          const onDelete = !resource.pending ? () => onPressDelete(resource.id) : null

          return (
            <View key={i} style={pendingState}>
              <LifekeyCard  headingText={resourceType.name} onPressEdit={onEdit} onPressDelete={onDelete} >
                <LcContactDetail listCardHeading={resourceType.name} listCardPrimaryDetail={resource.email ? resource.email : resource.telephone} listCardSecondaryDetails={[]} expanded={i === 0} />
              </LifekeyCard>
            </View>
          )
        })}
      </View>
    )
  }
}

export default RcContact
