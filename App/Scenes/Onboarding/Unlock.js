import React from 'react'
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Keyboard,
  Platform,
  Image
} from 'react-native'
import { Container, Content, Grid, Col, Row } from 'native-base'

import Scene from '../../Scene'
import Logger from '../../Logger'
import Routes from '../../Routes'
import BackButton from '../../Components/BackButton'
import ConsentUser from '../../Models/ConsentUser'
import Touchable from '../../Components/Touchable'
import Dots from '../../Components/Dots'

class Unlocked extends Scene {
  constructor(...params) {
    super(...params)

    this.state = {
      screenHeight: this.props.screenHeight,
      keyboardVisible: false,
      characters: ''
    }

    this.onFocus = this.onFocus.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onKeyboardWithShow = this.onKeyboardWithShow.bind(this)
    this.onKeyboardDidHide = this.onKeyboardDidHide.bind(this)
    this.onPressForgot = this.onPressForgot.bind(this)
  }

  onFocus(event) {
    this.refs.input.focus()
  }

  onChangeText(text) {
    this.setState({
      characters: text
    })

    setTimeout(() => {
      if (this.state.characters.length >= 5) {
        this.onSubmit()
      }
    }, 250)
  }

  onSubmit() {
    if (!this.submitted) {
      this.submitted = true
      ConsentUser.login(this.state.characters)
      .then(() => {
        // logged in
        this.navigator.push(Routes.onboarding.unlocked)
      })
      .catch(error => {
        Logger.error('Could not log in', this._fileName, error)
        alert('Wrong password')
        this.setState({
          characters: ''
        })
      })
    }
    Keyboard.dismiss()
  }

  onKeyboardWithShow(event) {
    const change = event.endCoordinates.height

    this.setState({
      screenHeight: this.props.screenHeight - change,
      keyboardVisible: true
    })
  }

  onKeyboardDidHide(event) {
    this.setState({
      screenHeight: this.props.screenHeight,
      keyboardVisible: false
    })
  }

  onPressForgot(event) {
    alert('forgot')

    event.preventDefault()
    event.stopPropagation()
  }

  componentWillReceiveProps(props) {
    this.setState({
      screenHeight: this.props.screenHeight
    })
  }

  componentDidMount() {
    super.componentDidMount()
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.onKeyboardWithShow)
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.onKeyboardDidHide)
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.onKeyboardWithShow)
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.onKeyboardDidHide)
  }

  componentWillUnmount() {
    super.componentWillUnmount()
    this.keyboardWillShowListener.remove()
    this.keyboardWillHideListener.remove()
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  _goToDebug() {
    Keyboard.dismiss()
    this.navigator.push(Routes.debug)
  }

  render() {
    return (
      <Container onTouchStart={this.onFocus} style={[style.container]}>
        <BackButton navigator={this.navigator} />
        <Content>
          <Grid>
            <Col style={[style.col, { height: this.state.screenHeight }]}>
              <Row style={[style.firstRow]}>
              <Touchable onLongPress={() => this._goToDebug()}>
                <Text style={[style.firstText]}>
                  Unlock
                </Text>
              </Touchable>
              </Row>
              <Row style={[style.secondRow]}>
                <Text style={[style.secondText]}>
                  Enter your 5-digit key PIN.
                </Text>
              </Row>
              <Row style={[style.thirdRow]}>
                <Touchable onPress={this.onPressForgot}>
                  <View>
                    <Text style={[style.thirdText]}>
                      I forgot
                    </Text>
                  </View>
                </Touchable>
              </Row>
              <Row style={[style.fourthRow]}>
                <Image style={{ height: 67, resizeMode: 'contain' }} source={require('../../Images/grey_dots_1.png')} />
              </Row>
              <Row style={[style.fifthRow]}>
                <View>
                  <Dots
                    current={this.state.characters.length}
                    strokeColor="#3f484e"
                    fullFill="#3f484e"
                    emptyFill="#eceeee"
                  />
                  <TextInput
                    ref="input"
                    autoFocus={true}
                    returnKeyType="done"
                    keyboardType="phone-pad"
                    onChangeText={(text) => this.onChangeText(text)}
                    style={[style.input]}
                  />
                </View>
              </Row>
            </Col>
          </Grid>
        </Content>
      </Container>
    )
  }
}

const textStyle = {
  textAlign: 'center',
  fontFamily: Platform.select({
    ios: 'Helvetica',
    android: 'Arial'
  }),
  fontWeight: '300'
}

const style = StyleSheet.create({
  container: {
    backgroundColor: '#eceeee'
  },
  col: {
    flexDirection: 'column'
  },
  firstRow: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40
  },
  firstText: Object.assign(Object.create(textStyle), {
    color: '#4b5359',
    fontSize: 30
  }),
  secondRow: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  secondText: Object.assign(Object.create(textStyle), {
    color: '#a2acb2',
    fontSize: 16
  }),
  thirdRow: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  thirdText: Object.assign(Object.create(textStyle), {
    color: '#3f8efa',
    fontSize: 16
  }),
  input: {
    position: 'absolute',
    top: -1000
  },
  fourthRow: {
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default Unlocked
