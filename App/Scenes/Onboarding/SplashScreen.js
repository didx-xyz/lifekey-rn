/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import React from 'react';
import Scene from '../../Scene';
import Routes from '../../Routes';
import Logger from '../../Logger';
import Session from '../../Session';
import Touchable from '../../Components/Touchable';
import ConsentUser from '../../Models/ConsentUser';
import LifekeyFooter from '../../Components/LifekeyFooter';

import { Text, View, StatusBar, Image } from 'react-native';

import { Container, Content, Grid, Row, Col, Spinner } from 'native-base';

import BackButton from '../../Components/BackButton';
import Design from '../../DesignParameters';
import Palette from '../../Palette';

export default class SplashScreen extends Scene {
  constructor(props) {
    super(props);
    this.pushedRoute = false;
    this.state = {
      tokenAvailable: true,
      ready: false,
      tokenTries: 0,
    };
  }

  initialize() {
    setTimeout(() => {
      this.setState(
        {
          ready: true
        },
        () => {
          const userState = Session.getState().user;

          console.log('SESSIONSTATE: ', Session.getState());

          if (userState && userState.registered) {
            this.navigator.push({
              ...Routes.authenticationPrompt,
              auth_success_action: Promise.resolve,
              auth_success_destination: Routes.main
            });
          }
        }
      );
    }, 2000); // This works with 0, but doesn't work without the settimeout. Smells fishy...
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.booted && !this.pushedRoute) {
      this.pushedRoute = true;
      this.initialize();
    }
  }

  componentDidMount() {
    super.componentDidFocus();
    this.waitForToken();
  }

  waitForToken() {
    setTimeout(() => {
      ConsentUser.getToken()
        .then((result) => {
          if (result) {
            this.setState({
              tokenAvailable: true
            });
          } else {
            this.setState({
              tokenAvailable: false
            });
            let tokenTries = this.state.tokenTries
            if (tokenTries < 5) {
              this.setState({
                tokenTries:  tokenTries + 1
              });
              //try fetch a token again
              this.waitForToken();
            } else {
              Logger.info('no token yet', error);
              alert('Timeout fetching token');
            }
          }
        })
        .catch((error) => {
          this.setState({
            tokenAvailable: false
          });
          Logger.info('Error fetching token', error);
          alert('error fetching token');
        });
    }, 1000);

  }

  render() {
    return (
      <Container>
        <BackButton navigator={this.navigator} onPress={() => false} />
        <View style={style.contentContainer}>
          <View style={style.firstRow}>
            <Touchable
              delayLongPress={500}
              onLongPress={() => this.navigator.push(Routes.debug.main)}
            >
              <Image
                style={{ width: 150, height: 150 }}
                source={require('../../../App/Images/Qi1.gif')}
              />
            </Touchable>
            <Text style={style.text}>
              Securely store and verify personal information.
            </Text>
          </View>
          <LifekeyFooter
            backgroundColor={Palette.consentBlue}
            middleButtonText={this.state.ready && "Let's start"}
            middleButtonIcon={
              !this.state.ready && <Spinner color={Palette.consentWhite} />
            }
            onPressMiddleButton={() =>
              this.navigator.push(Routes.onboarding.register)
            }
          />
        </View>
      </Container>
    );
  }
}

const style = {
  contentContainer: {
    flex: 1,
    backgroundColor: Palette.consentBlue,
    alignItems: 'center',
    justifyContent: 'center'
  },
  firstRow: {
    width: '100%',
    backgroundColor: Palette.consentBlue,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    color: Palette.consentWhite,
    maxWidth: 200,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 64,
    marginBottom: -96 // To center image, negate the font size (over two lines) along with the top margin.
  }
};
