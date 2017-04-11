/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React from 'react'
import Scene from '../../Scene'
import Api from '../../Api'
import ConsentUser from '../../Models/ConsentUser'
import Logger from '../../Logger'

import { Text, View } from 'react-native'
import * as Nachos from 'nachos-ui'
import * as Base from 'native-base'

import BackButton from '../../Components/BackButton'

export default class DebugRegister extends Scene {

  constructor(props) {
    super(props)
    this.state = {
      email: '',
      nickname: '',
      password: '',
      deleteByEmailEmail: '',
      keystoreLoaded: false,
      registered: false,
      loggedIn: false
    }
  }

  componentWillMount() {
    super.componentDidMount()
    Promise.all([
      ConsentUser.isRegistered(),
      ConsentUser.isLoggedIn(),
      ConsentUser.get()
    ])
    .then(result => {
      if (result[1] && result[2]) {
        console.log(result[2])
        this.setState({
          id: result[2].id,
          did: result[2].did,
          email: result[2].email,
          firebaseToken: result[2].firebaseToken
        })
      } else {
        this.setState({
          registered: result[0],
          loggedIn: result[1],
        })
      }
    })
  }

  register() {
    const email = this.state.email.trim()
    const nickname = this.state.nickname.trim()
    const password = this.state.password.trim()
    ConsentUser.register(nickname, email, password)
    .then(result => {
      this.setState({
        registered: true
      })
      Logger.info(`${nickname} registered. Don't forget to click the magic link`, this._fileName)
      alert(`${nickname} created. Click the magic link sent to ${email} to activate.`)
    })
    .catch(error => {
      Logger.error("Not so much registered", 'DebugRegister', error)
      alert('Could not register ' + JSON.stringify(error))
    })

  }

  login() {
    ConsentUser.login(this.state.password)
    .then(result => {
      this.setState({
        loggedIn: true
      })
    })
    .catch(error => {
      alert(JSON.stringify(error))
    })
  }

  logout() {
    ConsentUser.logout()
    .then(() => {
      this.setState({
        loggedIn: false
      })
    })
  }

  unregister() {
    ConsentUser.unregister()
    .then(() => {
      alert('User unregistered')
      Logger.info('User unregistered', this._fileName)
    })
    .catch(error => {
      Logger.error('Could not unregister', this._fileName, error)
    })
  }

  deleteByEmail(email) {
    if (email) {
      Api.unregister({ email: email })
      .then(result => {
        alert(JSON.stringify(result))
      })
      .catch(error => {
        alert(JSON.stringify(error))
      })
    } else {
      alert('Please enter an email address to delete the user for')
    }

  }

  render() {
    return (
      <Base.Container>
        <Base.Content>
          <BackButton navigator={this.navigator} />
          <View style={{ alignItems: 'center' }}>
            <Nachos.H1>Consent Account</Nachos.H1>
          </View>

          <Nachos.H3>Status</Nachos.H3>
          <Base.ListItem>
            <Base.Body>
              <Base.Text>Logged in</Base.Text>
            </Base.Body>
            <Base.Right>
              <Nachos.Checkbox checked={this.state.loggedIn}/>
            </Base.Right>
          </Base.ListItem>

          <Base.ListItem>
            <Base.Body>
              <Base.Text>Registered</Base.Text>
            </Base.Body>
            <Base.Right>
              <Nachos.Checkbox checked={this.state.registered}/>
            </Base.Right>
          </Base.ListItem>

          { (!this.state.registered) &&
            <View style={{ flex: 1 }}>

              <Nachos.H3>Register</Nachos.H3>

              <Nachos.Input
                placeholder="Email"
                value={this.state.email}
                onChangeText={email => this.setState({ email })}
              />

              <Nachos.Input
                placeholder="Nickname"
                value={this.state.nickname}
                onChangeText={nickname => this.setState({ nickname })}
              />

              <Nachos.Input
                placeholder="PIN"
                value={this.state.password}
                keyboardType={'numeric'}
                secureTextEntry={true}
                onChangeText={password => this.setState({ password })}
              />

              <Nachos.Button
                style={[styles.btn]}
                kind="squared"
                onPress={ () => this.register()}
              >
                Register
              </Nachos.Button>

            </View>
          }

          { (this.state.registered && !this.state.loggedIn) &&
            <View style={{ flex: 1 }}>
              <Nachos.H3>Log in</Nachos.H3>

              <Nachos.Input
                placeholder="PIN"
                value={this.state.password}
                keyboardType={'numeric'}
                secureTextEntry={true}
                onChangeText={password => this.setState({ password })}
              />

              <Nachos.Button
                disabled={this.state.password. length > 0 ? false : true }
                style={[styles.btn]}
                kind="squared"
                onPress={ () => this.login(this.state.password)}
              >
                Login
              </Nachos.Button>

              <Nachos.Button
                style={[styles.btn]}
                kind="squared"
                onPress={ () => this.unregister()}
              >
                Unregister
              </Nachos.Button>

            </View>
          }

          { (this.state.loggedIn) &&
            <View style={{ flex: 1 }}>

              <Nachos.H3>Log out</Nachos.H3>
              <Nachos.Button
                style={[styles.btn]}
                kind="squared"
                onPress={ () => this.logout()}
              >
                Logout
              </Nachos.Button>

              <Nachos.Button
                style={[styles.btn]}
                kind="squared"
                onPress={ () => this.unregister()}
              >
                Unregister
              </Nachos.Button>

            </View>
          }

          <Nachos.H3>Delete By Email</Nachos.H3>
          <Nachos.Input
            placeholder="Email"
            value={this.state.deleteByEmailEmail}
            onChangeText={email => this.setState({ deleteByEmailEmail: email })}
          />

          <Nachos.Button
            disabled={this.state.deleteByEmailEmail. length > 0 ? false : true }
            style={[styles.btn]}
            kind="squared"
            onPress={ () => this.deleteByEmail(this.state.deleteByEmailEmail)}
          >
            Delete
          </Nachos.Button>

        </Base.Content>
      </Base.Container>
    )
  }
}

const styles = {
  btn: {
    margin: 5
  }
}
