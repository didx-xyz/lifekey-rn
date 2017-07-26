
import React, { Component } from 'react'
import Design from '../DesignParameters'
import Palette from '../Palette'

import { View, Image, Text } from 'react-native'
import { ListItem } from 'native-base'

class LifekeyList extends Component {

  render(){
    return(   
      <View>
        { 
          this.props.list.map((connection, i) => (
            <ListItem key={i} style={style.listItem} onPress={this.props.onItemPress.bind(this, connection)}>
              <View style={style.listItemWrapper}>
                <Image style={style.listItemImage} source={{ uri: connection.image_uri }}/>
                <Text style={style.listItemText}>{connection.display_name}</Text>
              </View>
            </ListItem>
          ))
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
    marginLeft: 10
  },
  listItemImage: {
    width: 30,
    height: 30,
    borderRadius: 45,
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
