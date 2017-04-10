import React from 'react'
import Scene from '../../Scene'
import Api from '../../Api'
import * as Base from 'native-base'
import * as Nachos from 'nachos-ui'
import { View } from 'react-native'

class DebugConnectionRequest extends Scene {

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    Api.allConnections()
    .then(response => {
      if (response.status === 400) {
        alert('not yet activated')
      }
      alert(JSON.stringify(response))
    })
    .catch(error => {
      alert(JSON.stringify(error))
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
                <Nachos.Input/>
                <Nachos.Input/>
                <Nachos.Input/>
                <Nachos.Input/>
                <Nachos.Input/>
              </View>
            </Base.Row>
          </Base.Grid>
        </Base.Content>
      </Base.Container>
    )
  }
}

export default DebugConnectionRequest
