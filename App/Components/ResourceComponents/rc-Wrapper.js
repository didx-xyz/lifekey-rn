import React, { Component } from 'react'
import PropTypes from "prop-types"
import { View } from 'react-native'

import LifekeyCard from "../LifekeyCard"
import LcHomeAddress from "../lc-HomeAddress"
import LcContactDetail from "../lc-ContactDetail"
import LcEmployment from "../lc-Employment"
import LcIdentity from "../lc-Identity"
import LcPerson from "../lc-Person"
import LcProfile from "../lc-Profile"
import LcImageDocument from "../lc-ImageDocument"

class RcWrapper extends Component {

  renderComponent(resource, resourceType, index){

    switch (resourceType.name) {
      case('Public Profile'):
        return <LcProfile {...resource} />
      case('Person'):
        return <LcPerson {...resource} />
      case('Identity'):
        return  <LcIdentity {...resource} />
      case('Mobile Phone'):
        return <LcContactDetail listCardHeading={resource.label} listCardPrimaryDetail={resource.email ? resource.email : resource.telephone} listCardSecondaryDetails={[]} expanded={index === 0} />
      case('Landline'):
        return <LcContactDetail listCardHeading={resource.label} listCardPrimaryDetail={resource.email ? resource.email : resource.telephone} listCardSecondaryDetails={[]} expanded={index === 0} />
      case('Email'):
        return <LcContactDetail listCardHeading={resource.label} listCardPrimaryDetail={resource.email ? resource.email : resource.telephone} listCardSecondaryDetails={[]} expanded={index === 0} />
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

    const { resourceType, onPressEdit, onPressDelete, onPressProfile, onEditResource } = this.props
    
    return (
      <View>
        { 
          resourceType.items.map((resource, i) => {  

            const pendingState = resource.pending ? { "opacity": 0.3 } : {}
            const onEdit = resourceType.name === "Public Profile" ? onPressProfile  : onPressEdit.bind(this, resource.form, resource.id, resourceType.name)
            const onDelete = resourceType.name === "Public Profile" ? null  : onPressDelete.bind(this, resource.id)
            const heading = resourceType.name === "Public Profile" ? "Public Profile" : resource.label

            return (
              <View key={i} style={pendingState}>
                <LifekeyCard  headingText={heading} expandable={false} onPressEdit={onEdit} onPressDelete={onDelete} >
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
