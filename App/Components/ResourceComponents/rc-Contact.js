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
    console.log("resourceType: ", resourceType, "onPressEdit: ", onPressEdit, "onPressDelete: ", onPressDelete, "onEditResource:", onEditResource)
    
    // return (
    //   <LifekeyCard headingText={"Contact Details"}>
    //     { resourceType.items.map((resource, i) => { 
    //       return (
    //         <LifekeyCard key={i} headingText={resourceType.name} onPressEdit={() => onPressEdit(resource.form, resource.id)} onPressDelete={() => onPressDelete(resource.id)} >
    //           <LcContactDetail listCardHeading={resourceType.name} listCardPrimaryDetail={resource.email ? resource.email : resource.telephone} listCardSecondaryDetails={[]} expanded={false} />
    //         </LifekeyCard>
    //       )
    //     })}
    //   </LifekeyCard>
    // )

    return (
      <View>
        { resourceType.items.map((resource, i) => { 
          return (
            <LifekeyCard key={i} headingText={resourceType.name} onPressEdit={() => onPressEdit(resource.form, resource.id)} onPressDelete={() => onPressDelete(resource.id)} >
              <LcContactDetail listCardHeading={resourceType.name} listCardPrimaryDetail={resource.email ? resource.email : resource.telephone} listCardSecondaryDetails={[]} expanded={i === 0} />
            </LifekeyCard>
          )
        })}
      </View>
    )
  }
}

export default RcContact
