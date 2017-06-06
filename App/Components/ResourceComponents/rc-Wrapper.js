import React, { Component } from 'react'
import PropTypes from "prop-types"
import { View } from 'react-native'

import LifekeyCard from "../LifekeyCard"
import LcHomeAddress from "../lc-HomeAddress"
import LcContactDetail from "../lc-ContactDetail"
import LcEmployment from "../lc-Employment"
import LcIdentity from "../lc-Identity"
import LcPerson from "../lc-Person"
import LcImageDocument from "../lc-ImageDocument"

class RcWrapper extends Component {

  renderComponent(resource, resourceType, index){
    switch (resourceType.name) {
      case('Person'):
        return <LcPerson {...resource} />
      case('Identity'):
        return  <LcIdentity {...resource} />
      case('Mobile Phone' || 'Landline' || 'Email'):
        return <LcContactDetail listCardHeading={resourceType.name} listCardPrimaryDetail={resource.email ? resource.email : resource.telephone} listCardSecondaryDetails={[]} expanded={index === 0} />
      case('Address'):
        return <LcHomeAddress {...resource} expanded={ false }/>
      case('Employment'):
        return <LcEmployment {...resource}></LcEmployment>
      case('Proof Of Identity'):
        return <LcImageDocument title={"Proof Of Identity"} documentIdentifier={"proofOfIdentity"} {...resource} expanded={ false }/>
      case('Proof Of Residence'):
        return <LcImageDocument title={"Proof Of Residence"} documentIdentifier={"proofOfResidence"} {...resource} expanded={ false }/>
    }
  }

  render() {

    const { resourceType, onPressEdit, onPressDelete, onEditResource } = this.props
    
    return (
      <View>
        { 
          resourceType.items.map((resource, i) => {  

            const pendingState = resource.pending ? { "opacity": 0.3 } : {}
            const onEdit = !resource.pending ? () => this.props.onEdit.bind(this) : null
            const onDelete = !resource.pending ? () => this.props.onDelete.bind(this) : null

            return (
              <View key={i} style={pendingState}>
                <LifekeyCard  headingText={resourceType.name} onPressEdit={() => onPressEdit(resource.form, resource.id, resourceType.name)} onPressDelete={() => onPressDelete(resource.id)} >
                  { this.renderComponent(resource, resourceType, i) }
                </LifekeyCard>
              </View>
            )
          })
        }
      </View>
    )

  }
}

export default RcWrapper
