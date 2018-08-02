/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Hein <hein@io.co.za>
 */

import React, { Component } from 'react'
import _ from 'lodash'
import moment from 'moment'
import titleCase from 'title-case'
import Session from '../../Session'
import Routes from '../../Routes'
import Api from '../../Api'
import Logger from "../../Logger"
import Config from '../../Config'
import Touchable from '../../Components/Touchable'
import ConsentUser from '../../Models/ConsentUser'

import { Text, View, ScrollView, Image, Dimensions, StatusBar, TouchableOpacity } from 'react-native'
import { Container, Content } from 'native-base'

// internal dependencies
import Design from "../../DesignParameters"
import Palette from '../../Palette'
import BackIcon from "../../Components/BackIcon"
import HelpIcon from "../../Components/HelpIcon"
import LifekeyHeader from "../../Components/LifekeyHeader"
import LifekeyCard from "../../Components/LifekeyCard"
import ProgressIndicator from "../ProgressIndicator"

class Badges extends Component  {
  state = {
    badges: this.props.badges,
  };

  componentDidMount() {
    
  }

  async toggleCard(id) {
    const badges = this.state.badges;
    const badge = badges.find(i => i.id === id);
    if (badge) {
      const { open = false } = badge;
      badge.open = !open;
      badge.loading = !open;
      this.setState({ badges });
      if (badge.open) {
        try {
          response = await Api.getResource({id})
          const { claim: { additional_fields = {}, created_at = '' } } = response;
          badge.fields = additional_fields;
          badge.issued = moment(created_at,"YYYY-MM-DD hh:mm:ss").format('YYYY-MM-DD');
          badge.expires = moment(created_at,"YYYY-MM-DD hh:mm:ss").add(3, 'months').format('YYYY-MM-DD');
          badge.loading = false;
          this.setState({ badges });
        } catch (error) {
          Logger.error('ERROR: fetching badge resource', error);
        }
      }
    }
  }

  render() {
    return (
       this.state.badges ?  
         <ScrollView contentContainerStyle={{ flex: 1 }}>
            {
              Object.values(this.state.badges).map((b, i) => {
                const { open = false, loading = false, fields = {}, issued = '', expires = '' } = b;
                console.log("BADGE CHECKER", b);
                return (
                  <View key={i} style={{ backgroundColor: "#FFF", margin: 10 }}>
                  <TouchableOpacity style={[styles.badge]} onPress={() => this.toggleCard(b.id)}>
                    <View style={styles.badge}>
                      <View style={styles.badgeImage}>
                        <Image style={{"width" : 50, "height": 55}} source={(typeof b.image === 'string') ? { uri: b.image } : b.image} />
                        <Image style={{"width" : 20, "height": 20, position: 'absolute', right: 10, top: 20 }} source={require('../../../App/Images/tick.png')} />
                      </View>
                      <View style={styles.badgeContent}>
                        <View style={styles.badgeName}>
                          <Text style={styles.badgeNameText}>{b.name}</Text>                      
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                    {(open) &&
                    <View style={{ padding: 10 }}>
                      {(loading) ?
                      <ProgressIndicator progressCopy={'Loading...'} /> :
                        <View>
                          <View style={styles.datesRowWrapper}>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                              <Text style={styles.date}>DATE</Text>
                              <Text style={{ color: Palette.consentGrayDarkest }}> {issued}</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                              <Text style={styles.expires}>EXPIRES</Text>
                              <Text style={{ color: Palette.consentGrayDarkest }}> {expires}</Text>
                            </View>
                            </View>
                            <View style={styles.isaDetails}>
                            {
                              Object.keys(fields).map((key, index) => {
                                return (
                                  <Text style={{ color: Palette.consentGrayDarkest, fontSize: 15 }} key={index}>{`${'\u2713'} ${titleCase(key)}: ${fields[key]}`}</Text>
                                )
                              })
                            }
                            </View>
                        </View>
                      }
                    </View>
                    }
                    </View>
                )
               }) 
            }
          </ScrollView>
        :
          <Text>NO BADGES YET</Text>
      )
  }
}

const styles = {
  "content": { 
    "height": Dimensions.get('window').height - Design.lifekeyHeaderHeight - StatusBar.currentHeight,
    "flex": 1,
    "backgroundColor": Palette.consentGrayLightest,
    "alignItems": "center",
    "flexDirection": "column",
    "justifyContent": "flex-start",
    "paddingRight": Design.paddingRight / 2,
    "paddingLeft": Design.paddingLeft / 2,
  },
  "badge": {
    "flex": 1,
    "flexDirection": "row",
    "justifyContent": "center",
    "alignItems": "center",
    "maxHeight": 75,
    padding: 10,
    "marginBottom": 0,
    "backgroundColor": "#FFF"
  },
  "badgeImage": {
    "flex": 1,
    "width": 50,
    "height": 50,
    "justifyContent": "center",
    "alignItems": "center"
  },
  "badgeContent": {
    "flex": 4,
    "flexDirection": "column",
  },
  "badgeName": {
    "flex": 1,
    "paddingLeft": 20,
    "alignItems": "flex-start",
    "justifyContent": "center",
  },
  "badgeNameText": {
    "fontWeight": "bold",
    "color": "#333"
  },
  "badgeDescription": {
    "flex": 1
  },
  "badgeDescriptionText": {
    "color": "#666"
  },
  isaCardWrapper: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingTop: 14,
    paddingBottom: 14,
    paddingRight: 18,
    paddingLeft: 18,
    borderRadius: Design.borderRadius,
    marginBottom: 20
  },
  datesRowWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: Palette.consentGrayMedium
  },
  isaDetails: {
    flex: 1,
    paddingVertical: 15
  },
}

export default Badges
