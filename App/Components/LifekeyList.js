
import React, { Component } from 'react'
import Design from '../DesignParameters'
import Palette from '../Palette'

import { View, Image, Text } from 'react-native'
import { ListItem } from 'native-base'
import TickIcon from "./TickIcon"

class LifekeyList extends Component {

  render(){
    return(   
      <View>
        { 
          this.props.list.map((connection, i) => 
          {
            const { image_uri = '' } = connection;
            return (
              <ListItem key={i} style={style.listItem} onPress={this.props.onItemPress.bind(this, connection)}>
                <View style={style.listItemWrapper}>
                  <Image style={style.listItemImage} source={{ uri: image_uri.replace('\{type\}', 'icon') }}/>
                  <Text style={style.listItemText}>{connection.display_name}</Text>
                  {this.props.cxn_unread_msgs && this.props.cxn_unread_msgs[connection.did] && (
                    <TickIcon width={ 20 } height={ 20 } stroke={Palette.consentWhite} fill={Palette.consentBlue} />
                  )}
                  {this.props.activelist === connection.did && (
                    <TickIcon width={ 20 } height={ 20 } stroke={Palette.consentWhite} fill={Palette.consentBlue} />
                  )}
                </View>
              </ListItem>
            )
          })
        }
      </View>
    )
  }
}

const style = {
  listItem: {
    marginLeft: -Design.paddingRight / 2.5,
    marginRight: -Design.paddingRight / 2.5,
    minHeight: 50
  },
  listItemWrapper: {
    flex: 1,
    marginLeft: Design.paddingRight,
    marginRight: Design.paddingRight,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  listItemText: {
    fontSize: 18,
    flex: 1,
    marginLeft: 10,
    color: Palette.consentOffBlack
  },
  listItemImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 10
  },
  "defaultFont":{
    fontFamily: Design.fonts.registration,
    fontWeight: Design.fontWeights.light,
    fontSize: 38,
    lineHeight: 48
  },
}

export default LifekeyList
