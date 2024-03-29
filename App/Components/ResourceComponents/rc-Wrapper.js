import React, { Component } from 'react'
import PropTypes from "prop-types"
import { View, Text, Modal } from 'react-native'

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

class RcWrapper extends Component {

  constructor(props) {
    super(props)

    this.state = {
      modalVisible: false,
    }
    this.renderComponent = this.renderComponent.bind(this);
  }

  onWrapperShareIntent(resourceId) {
    this.setState({
      modalVisible: true,
      resourceId: resourceId
    });
    console.log("SHARED IN WRAPPER! ", resourceId)
  }

  onPeerSelection(peer){
    console.log("PICKED PEER: ", peer.did)
    this.setState({
      peerId: peer.did,
      isa_id: peer.isa_id
    });
  }

  onShareConfirm(next) {
    if(!this.state.isa_id || !this.state.peerId || !this.state.resourceId) return 
    this.props.onPressShare(this.state.isa_id, this.state.peerId, this.state.resourceId)
    this.setState({
      modalVisible: false,
      isa_id: null,
      resourceId: null,
      peerId: null
    });
  }

  onShareDeny() {
    this.setState({
      modalVisible: false,
      isa_id: null,
      resourceId: null,
      peerId: null
    });
    // console.log("CANCELLED SHARE!")
  }

  renderComponent(resource, resourceType, index){

    // console.log("RENDER COMPONENT: ", resource)

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
        return <LcContactDetail listCardType={resourceType.name} listCardHeading={resource.label} listCardPrimaryDetail={resource.email ? resource.email : resource.telephone} listCardSecondaryDetails={[]} expanded={index === 0} />
      case('Email'):
        return <LcContactDetail listCardType={resourceType.name} listCardHeading={resource.label} listCardPrimaryDetail={resource.email ? resource.email : resource.mobile} listCardSecondaryDetails={[]} expanded={index === 0} />
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

    const { resourceType, onPressEdit, onPressShare, onPressDelete, onPressProfile } = this.props //onEditResource

    return (
      <View>
        { 
          resourceType.items.map((resource, i) => {  

            const pendingState = resource.pending ? { "opacity": 0.3 } : {}
            const onEdit = resourceType.name === "Public Profile" ? onPressProfile  : onPressEdit.bind(this, resource.form, resource.id, resourceType.name)
            // const onDelete = resourceType.name === "Public Profile" ? null  : onPressDelete.bind(this, resource.id)
            const onShare = resourceType.name === "Public Profile" ? null  : this.onWrapperShareIntent.bind(this, resource.id ) //
            const heading = resourceType.name === "Public Profile" ? "Public Profile" : resource.label

            return (
              <View key={i} style={pendingState}>
                {/*<LifekeyCard  headingText={heading} expandable={false} onPressEdit={onEdit} onPressDelete={onDelete} > */}
                <LifekeyCard  headingText={heading} expandable={false} onPressEdit={onEdit} onPressShare={onShare} >
                  { this.renderComponent(resource, resourceType, i) }
                  
                  <Modal
                    animationType={"fade"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => { this.setModalVisible(false) }}
                    >
                   <View style={{ "flex": 1 }}>
                      <View style={ styles.modalBackdrop }/>
                      <View style={ styles.modalListContainer }>
                        <View style={ styles.modalListContainerHeading }>
                          <View style={styles.description}>
                            <Text style={styles.descriptionText}>
                              Who would you like to share this resource with? 
                            </Text>
                          </View>
                        </View>  
                        <LifekeyList list={this.props.peerConnections} activelist={this.state.peerId} onItemPress={this.onPeerSelection.bind(this)}/>
                        { /*  this.renderConnections(this.props.peerConnections) */ }
                      </View>
                      <LifekeyFooter
                        color={Palette.consentWhite}
                        backgroundColor="transparent"
                        leftButtonText="Close"
                        onPressLeftButton={this.onShareDeny.bind(this)} 
                        rightButtonText="Share"
                        onPressRightButton={this.onShareConfirm.bind(this)} 
                      /> 

                   </View>
                  </Modal>

                </LifekeyCard>
              </View>
            )
          })
        }
      </View>
    )

  }

}

const styles= {
  "modalBackdrop":{
    "position": "absolute",
    "top": 0,
    "bottom": 0,
    "left": 0,
    "right": 0,
    "zIndex": 0,
    "opacity": 0.9,
    "backgroundColor": Palette.consentOffBlack
  },
  "modalListContainer":{
    "flex": 1,
    "margin": Design.paddingLeft,
    "marginBottom": 0,
    "backgroundColor": Palette.consentGrayLightest,
    "borderRadius": 10
  },
  "modalListContainerHeading":{
    "height": 100,
    "borderBottomWidth": 1,
    "borderColor": Palette.consentGrayLight,
    "alignItems": "center",
    "justifyContent": "center"
  },
  "description": {
    // minHeight: 50,
    width: "60%",
    paddingTop: 0
  },
  "descriptionText": {
    color: Palette.consentGrayDark,
    fontSize: 15,
    textAlign: "center"
  },
}

export default RcWrapper
