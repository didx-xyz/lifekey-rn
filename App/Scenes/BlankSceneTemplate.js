/**
 * Lifekey App
 * @copyright 2016 - 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React from 'react'
import Scene from '../Scene'

import {
  Text,
  View,
  StyleSheet
} from 'react-native'

import {
  Container,
  Content,
  Grid,
  Col,
  Row
} from 'native-base'

import BackButton from '../Components/BackButton'

export default class BlankSceneTemplate extends Scene {
  render() {
    return (
      <Container>
        <Content>
          <BackButton navigator={this.navigator} />
          <Grid>
            <Col style={[style.col, {"height": this.props.screenHeight}]}>
              <Row style={[style.row]}>
                <View>
                  <Text>Hello World</Text>
                </View>
              </Row>
            </Col>
          </Grid>
        </Content>
      </Container>
    )
  }
}

const style = StyleSheet.create({
  "col": {
    "backgroundColor": "#f9fafa",
    "flexDirection": "column"
  },
  "row": {
    "justifyContent": "center",
    "alignItems": "center"
  }
})
