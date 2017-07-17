import React, { Component } from 'react'
import PropTypes from "prop-types"
import { View, Text, Image, Modal, TouchableHighlight } from 'react-native'

//Internal dependencies 
import Design from "../DesignParameters"
import Palette from "../Palette"
import RcItemDetail from "./ResourceComponents/rc-DetailView"
import LifekeyFooter from "./LifekeyFooter"
// import LcSummary from "./LcSummary"


class LcImageDocument extends Component {

  constructor(props) {
    super(props)

    this.state = {
      modalVisible: false,
    }
  }

  setModalVisible(visible) {
    this.setState({modalVisible: !this.state.modalVisible});
  }

  render() {

    const { expanded, title, documentIdentifier } = this.props
    const documentUri = `data:image/jpg;base64,${this.props[documentIdentifier]}`
    
    if(expanded)
      return (
        <View style={styles.fullImageContainer}>
          <Image style={styles.fullImage} source={{ uri: documentUri, scale: 1 }}></Image>
        </View>
      )
    else
      return (
        <View style={styles.listCard}>
          <Modal
            animationType={"fade"}
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {alert("Modal has been closed.")}}
            >
           <View style={{ "flex": 1 }}>
              <View style={ styles.modalBackdrop }></View>
              <View style={styles.fullImageContainer}>
                <Image style={styles.fullImage} source={{ uri: documentUri, scale: 1 }}></Image>
              </View>

              <LifekeyFooter
                color={Palette.consentWhite}
                backgroundColor="transparent"
                rightButtonText="Close"
                onPressRightButton={this.setModalVisible.bind(this)} 
              />

           </View>
          </Modal>
          <View style={styles.listImage}>
            <Image style={styles.image} source={{ uri: documentUri, scale: 1 }}></Image>
          </View>
          <View style={styles.listBody}>
            <TouchableHighlight onPress={() => { this.setModalVisible(!this.state.modalVisible) }}>
              {/* NOTE: Rudimentary solution to RN android not being able to give text decoration a color: https://facebook.github.io/react-native/docs/text.html  */}
              <View style={ {"borderBottomWidth": 1, "borderColor": Palette.consentGrayDark, "maxWidth": 140, "marginBottom": 5 } }> 
                <Text style={styles.listBodyTitle}>View Attachment</Text>
              </View>
            </TouchableHighlight>
            <Text style={styles.listBodySubtitle}>Last Updated: 24/24/24</Text>
          </View>
        </View>
      )
  }
}

const styles = {
  "listCard":{
    "width": "100%",
    "minHeight": 90,
    "flexDirection": "row"
  },
  "listImage":{
    "flex": 1,
    "marginRight": Design.paddingRight,
    "justifyContent": "center",
    "alignItems": "center"
  },
  "image":{
    "height": "100%",
    "width": "100%",
    "minHeight": 90,
    "resizeMode": "contain",
  },
  "listBody":{
    "flex": 4,
    "justifyContent": "center",  
    "paddingTop": 5,
    "paddingBottom": 5, 
  },
  "listBodyTitle":{
    "fontSize": 18,
    "color": Palette.consentGrayDark
  },
  "listBodySubtitle":{
    "fontSize": 12,
    "color": Palette.consentGrayMedium
  },
  "listBodyContent":{
    "fontSize": 25,
    "color": Palette.consentGray
  },
  "unexpandedListCard": {
    "width": "100%",
    "flexDirection": "column"
  },
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
  "fullImageContainer":{
    "flex": 1,
    padding: Design.paddingRight,
    opacity: 1,
    "justifyContent": "center",
    "alignItems": "center"
  },
  "fullImage": {
    "width": "100%",
    "height": "100%",
    "resizeMode": "cover",
  }
}

export default LcImageDocument
