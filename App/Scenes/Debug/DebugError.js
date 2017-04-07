/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za> et al.
 */
import React from 'react'
import { View } from 'react-native'
import Scene from '../../Scene'
import ConsentError, { ErrorCode } from '../../ConsentError'
import { Container, Content } from 'native-base'
import { Button, H1 } from 'nachos-ui'
import BackButton from '../../Components/BackButton'

class DebugError extends Scene {

  constructor(props) {
    super(props)
  }

  throwConsentError() {
    throw new ConsentError('Test throw', ErrorCode.E_UNKNOWN)
  }

  render() {
    return (
      <Container>
        <Content>
          <BackButton navigator={this.navigator} />
          <View style={{ alignItems: 'center' }}>
            <H1>Error Debug</H1>
          </View>
          <Button iconName="ios-alert" kind="squared" type="danger" style={[styles.btn]} onPress={() => this.throwConsentError()}>Throw ConsentError</Button>

        </Content>
      </Container>
    )
  }
}

export default DebugError

const styles = {
  btn: {
    margin: 5
  }
}