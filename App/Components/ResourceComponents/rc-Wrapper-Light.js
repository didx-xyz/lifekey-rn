import React, { Component } from 'react'
import PropTypes from "prop-types"
import { View, Text } from 'react-native'

import LifekeyCard from "../LifekeyCard"
import LcHomeAddress from "../lc-HomeAddress"
import LcContactDetail from "../lc-ContactDetail"
import LcEmployment from "../lc-Employment"
import LcIdentity from "../lc-Identity"
import LcPerson from "../lc-Person"
import LcProfile from "../lc-Profile"
import LcImageDocument from "../lc-ImageDocument"

import Design from "../../DesignParameters"
import Palette from "../../Palette"
import LifekeyFooter from "../LifekeyFooter"
import LifekeyList from '../LifekeyList'

class RcWrapperLight extends Component {

  renderComponent(resource, resourceType, index){

    switch (resourceType.name) {
      case('Public Profile'):
        return <LcProfile {...resource} />
      case('Person'):
        return <LcPerson {...resource} />
      case('Identity'):
        return  <LcIdentity {...resource} />
      case('Mobile Phone'):
        return <LcContactDetail listCardType={resourceType.name} listCardHeading={resource.label} listCardPrimaryDetail={resource.email ? resource.email : resource.mobile} listCardSecondaryDetails={[]} expanded={index === 0} />
      case('Landline'):
        return <LcContactDetail listCardHeading={resource.label} listCardPrimaryDetail={resource.email ? resource.email : resource.telephone} listCardSecondaryDetails={[]} expanded={index === 0} />
      case('Email'):
        return <LcContactDetail listCardHeading={resource.label} listCardPrimaryDetail={resource.email ? resource.email : resource.mobile} listCardSecondaryDetails={[]} expanded={index === 0} />
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

    const { resourceType, includeResourceType } = this.props //onEditResource

    return (
      <View>
        { 
          resourceType.items.map((resource, i) => {  

            let heading = resourceType.name === "Public Profile" ? "Public Profile" : resource.label
            heading = includeResourceType ? `${heading} (${resourceType.name})` : heading
            let id = resourceType.name === "Public Profile" ? "Public Profile" : resource.id

            return (
              <View key={id}>
                <LifekeyCard  headingText={heading} expandable={false} >
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

RcWrapperLight.defaultProps = {
  "includeResourceType": false
}

export default RcWrapperLight
