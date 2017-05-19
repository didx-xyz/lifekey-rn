/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Hein <hein@io.co.za>
 */

// external dependencies
import React, { Component } from "react"
import { Text, View, Image } from "react-native"
import PropTypes from "prop-types"
import MapView from 'react-native-maps';

// internal dependencies
import Api from "../Api"
import Design from "../DesignParameters"
import Palette from "../Palette"
import RcItemDetail from "./ResourceComponents/rc-DetailView"

class LcHomeAddress extends Component {

  constructor() {
    super()

    this.state = {
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,  
    }
  }

  componentDidMount() {

    let { streetAddress, suburb, province, country, postOfficeBoxNumber, postalCode } = this.props
    streetAddress = streetAddress ? streetAddress.replace(/ /g, '+') : null
    suburb = suburb ? suburb.replace(/ /g, '+') : null
    province = province ? province.replace(/ /g, '+') : null
    country = country ? country.replace(/ /g, '+') : null
    
    const address = `${streetAddress},${suburb},${province},${country}`
    
    Api.geocodeRequest(address).then(res => {
      
      const results = JSON.parse(res._bodyInit)
      
      this.setState({ 
        latitude: results.results[0].geometry.location.lat, 
        longitude: results.results[0].geometry.location.lng
      })

      // const snapshot = this.refs.map.takeSnapshot({
      //   format: 'png',   // image formats: 'png', 'jpg' (default: 'png')
      //   quality: 0.8,    // image quality: 0..1 (only relevant for jpg, default: 1)
      //   result: 'file'   // result types: 'file', 'base64' (default: 'file')
      // });
      // console.log("SNAPSHOT: ", snapshot)
      // snapshot.then((uri) => {
      //   this.setState({ mapSnapshot: uri });
      //   console.log("SNAPSHOT: ", uri)
      // });
    })
  }

  render () {

    const { expanded, streetAddress, suburb, province, country, postOfficeBoxNumber, postalCode } = this.props

    if(expanded)
      return (
        <View style={styles.unexpandedListCard}>
          { /* <Text style={styles.unexpandedListCardCopy}> {streetAddress},{suburb},{province},{country} </Text> */}
          <RcItemDetail objKey={"Street Address"} value={streetAddress}></RcItemDetail>
          <RcItemDetail objKey={"Suburb"} value={suburb}></RcItemDetail>
          <RcItemDetail objKey={"Province"} value={province}></RcItemDetail>
          <RcItemDetail objKey={"Country"} value={country}></RcItemDetail>
          <RcItemDetail objKey={"PO Box"} value={postOfficeBoxNumber}></RcItemDetail>
          <RcItemDetail objKey={"Postal Code"} value={postalCode}></RcItemDetail>
        </View>
      )
    else
      return (
        <View style={styles.container}>
          { this.renderMap() }
          <View style={styles.innerFrame}>
            <Text style={styles.imageText}> {streetAddress},{suburb},{province},{country} </Text>
          </View>
             {/* 
              <Image source={{ uri: this.state.mapSnapshot.uri }} />
          <TouchableOpacity onPress={this.takeSnapshot}>
            Take Snapshot
          </TouchableOpacity>

             <<View style={styles.container}>
          <View style={styles.addressImageContainer}>
            <Image style={styles.image} source={{uri: "http://www.uwgb.edu/UWGBCMS/media/Maps/images/map-icon.jpg"}}> 
              <View style={styles.innerFrame}>
                <Text style={styles.imageText}> {streetAddress},{suburb},{province},{country} </Text>
              </View>
            </Image> 
            
          </View>
        </View>  */}
        </View>    
      )
  }

  renderMap(){
    if(this.state.latitude){
      return (
        <MapView
          ref="map"
          style={styles.map}
          initialRegion={ this.state }
          customMapStyle={mapStyle}
        >
        </MapView>
      )
    }
    else{
      return null
    }
  }
}

const styles = {
  "container": {
    "width": "100%",
    "flexDirection": "row",
    "height": 150,
    "justifyContent": "center",
    "alignItems": "center",
  },
  "map": {
    "position": "absolute",
    "top": 0,
    "bottom": -20,
    "right": -20,
    "left": -20
  },
  "innerFrame": {
      "flex": 1, 
      "alignItems": "center", 
      "justifyContent": "center",
      // "backgroundColor": "rgba(0, 0, 0, .5)", 
  },
  "image":{
    "height": "100%",
    "width": "100%" 
  },
  "imageText": {
    "color": Palette.consentBlue
  },
  "unexpandedListCard": {
    "width": "100%",
    "flexDirection": "column"
  },
  "unexpandedListCardCopy":{
    "fontSize": 12,
    "color": Palette.consentGrayDark
  }
}

const mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "administrative.neighborhood",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.business",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dadada"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c9c9c9"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  }
]

LcHomeAddress.propTypes = {
  "expanded": PropTypes.bool,
  "address": PropTypes.string
}

export default LcHomeAddress
