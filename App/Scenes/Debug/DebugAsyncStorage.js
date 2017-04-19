import React, { Component } from 'react'
import { View, Text, ListView, AsyncStorage } from 'react-native'
import DebugButton from '../../Components/DebugButton'
import Logger from '../../Logger'
import Touchable from '../../Components/Touchable'
import _ from 'lodash'
import * as Base from 'native-base'
import * as Nachos from 'nachos-ui'

class DebugAsyncStorage extends Component {

  constructor(props) {
    super(props)
    this.keys = [
      'user',
      'connection',
      'discovered_users'
    ]

    this.state = {
      keySelected: null,
      data: null
    }
  }


  selectKey(key) {
    AsyncStorage.getItem(key)
    .then(resultJSON => {
      if (resultJSON) {
        const result = JSON.parse(resultJSON)
        this.setState({
          data: result,
          keySelected: key
        })
      } else {
        alert(`${key} is empty`)
      }
    })
    .catch(error => {
      Logger.error(error)
    })
  }

  async deleteItem(key) {
    try {
      const newData = _.omit(this.state.data, key)
      const newDataJSON = JSON.stringify(newData)
      await AsyncStorage.setItem(this.state.keySelected, newDataJSON)
      alert(`deleted ${key}`)
      this.setState({
        data: newData
      })
    } catch (error) {
      Logger.error(error)
    }
  }

  render() {
    return (
      <Base.Container>
        <Base.Content>
          {this.state.keySelected ?
            <View style={{ flex: 1 }}>
              <Base.List>
                {_.keys(this.state.data).map((value, index) => {
                  const keyName = value
                  const keyValue = JSON.stringify(this.state.data[value])
                  return (
                    <Base.ListItem key={index}>
                      <Touchable onLongPress={() => this.deleteItem(value)}>
                        <Base.Body>
                          <Text>{keyName}</Text>
                          <Text style={{ color: '#888888' }}>
                            { typeof keyValue === 'object' ?
                                JSON.stringify(keyValue)
                              :
                                keyValue
                            }
                          </Text>
                        </Base.Body>
                      </Touchable>
                    </Base.ListItem>
                  )
                })}
              </Base.List>
            </View>
          :
            this.keys.map((key, i) =>
              <DebugButton
                key={i}
                text={key}
                onPress={() => this.selectKey(key)}
              />
            )
          }

        </Base.Content>
      </Base.Container>
    )
  }
}

export default DebugAsyncStorage


class MyComponent extends Component {
  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(['row 1', 'row 2']),
    };
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData) => <Text>{rowData}</Text>}
      />
    );
  }
}