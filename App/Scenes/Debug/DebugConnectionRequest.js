import React from 'react'
import Scene from '../../Scene'
import Api from '../../Api'
import * as Base from 'native-base'
import * as Nachos from 'nachos-ui'
import { View, Text } from 'react-native'
import ConsentConnection from '../../Models/ConsentConnection'

class DebugConnectionRequest extends Scene {

  constructor(props) {
    super(props)
    this.state = {
      connections: []
    }
  }

  componentDidMount() {
    ConsentConnection.all()
    .then(connections => {
      this.setState({
        connections: connections
      }, () => {
        console.log('no connections', connections)
      })
    })
  }


  render() {
    return (
      <Base.Container>
        <Base.Content>
          <Base.Grid>
            <Base.Row>
              <View style={{ flex: 1 }}>
                <Nachos.H2>Delete</Nachos.H2>
                <Text>Hello</Text>
                <Text>Hello</Text>
                <Text>Hello</Text>
                <Text>Hello</Text>
                <Text>Hello</Text>
              </View>
            </Base.Row>
          </Base.Grid>
        </Base.Content>
      </Base.Container>
    )
  }
}

export default DebugConnectionRequest
