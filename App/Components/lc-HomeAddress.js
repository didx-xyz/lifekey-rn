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

// internal dependencies
import Api from "../Api"
import Design from "../DesignParameters"
import Palette from "../Palette"
import RcItemDetail from "./ResourceComponents/rc-DetailView"

class LcHomeAddress extends Component {

  render () {

    const { expanded, streetAddress, suburb, province, country, postOfficeBoxNumber, postalCode } = this.props
    const astreetAddress = streetAddress ? streetAddress.replace(/ /g, '+') : null
    const asuburb = suburb ? suburb.replace(/ /g, '+') : null
    const aprovince = province ? province.replace(/ /g, '+') : null
    const acountry = country ? country.replace(/ /g, '+') : null
    
    let address = `https://maps.googleapis.com/maps/api/staticmap?center=${astreetAddress},${asuburb},${aprovince},${acountry}&zoom=14&size=400x400&${get_static_style(mapStyle)}&key=AIzaSyBRbL0z5NgbnbMRFWxRPUTO2RCr-2vNnkY`

    if(expanded)
      return (
        <View style={styles.unexpandedListCard}>
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
          <Image style={styles.map} source={{ uri: `${address}` }} />
          <View style={styles.innerFrame}>
            <Text style={styles.imageText}> {streetAddress},{suburb},{province},{country} </Text>
          </View>
        </View>    
      )
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

function get_static_style(styles) {
    var result = [];
    styles.forEach(function(v, i, a){
        
        var style='';
        if( v.stylers ) { // only if there is a styler object
            if (v.stylers.length > 0) { // Needs to have a style rule to be valid.
                style += (v.hasOwnProperty('featureType') ? 'feature:' + v.featureType : 'feature:all') + '|';
                style += (v.hasOwnProperty('elementType') ? 'element:' + v.elementType : 'element:all') + '|';
                v.stylers.forEach(function(val, i, a){
                    var propertyname = Object.keys(val)[0];
                    var propertyval = val[propertyname].toString().replace('#', '0x');
                    style += propertyname + ':' + propertyval + '|';
                });
            }
        }
        result.push('style='+encodeURIComponent(style));
    });
    
    return result.join('&');
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
