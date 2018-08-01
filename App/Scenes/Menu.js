
// external dependencies
import React from "react"
import { Text, View, Image, ScrollView, InteractionManager, Dimensions, StatusBar, AsyncStorage} from "react-native"
import { Container } from "native-base"
import ConsentUser from '../Models/ConsentUser'
import Logger from '../Logger'

// internal dependencies
import Scene from "../Scene"
import Design from "../DesignParameters"
import Routes from "../Routes"
import Palette from "../Palette"
import LifekeyHeader from "../Components/LifekeyHeader"
import CircularImage from "../Components/CircularImage"
import Touchable from "../Components/Touchable"
import BackButton from "../Components/BackButton"
import BackIcon from "../Components/BackIcon"
import HelpIcon from "../Components/HelpIcon"
import GearIcon from "../Components/GearIcon"
import CrossIcon from "../Components/CrossIcon"
import AppLogo from '../Images/logo_big.png'

const helpScreens = [ 
  { "image": require("../Images/onboarding_test.png"), "heading": "Identify", "copy": "Qi Identity is my digital passport" }, 
  { "image": require("../Images/qr.png"), "heading": "Connect", "copy": "Qi Code connects me in a snap & replaces paperwork" }, 
  { "image": require("../Images/phone.png"), "heading": "Access", "copy": "Qi Access magically logs me in without usernames & passwords" }, 
  { "image": require("../Images/share.png"), "heading": "Secure", "copy": "Qi Safe secures my personal information under my control" }, 
  { "image": require("../Images/rewards.png"), "heading": "Rewards", "copy": "Qi Rewards give me Thanks Points and personalised offers" }
]

class Menu extends Scene {
  
  onPressHelp() {
    this.navigator.push({...Routes.helpGeneral, "destination": "menu", "screens": helpScreens, "navigationType": "pop" })
  }

  onDeregister() {
    ConsentUser.unregister()
    AsyncStorage.clear(() => {
      Logger.info('User data removed')
      this.navigator.replace({...Routes.main})
    });
  }

  render() {
    
    const icons = [
      {
        icon: <BackIcon width={Design.headerIconWidth} height={Design.headerIconHeight} stroke={Design.headerIconColour} />,
        onPress: () => this.navigator.pop(),
        borderColor: "white"
      },
      {
        icon: <Image style={{height: "100%", width: "100%"}} source={AppLogo}/>,
        borderColor: "white"
      },
      {
        icon: (
          <View width={38} height={38}></View>
        ),
        onPress: () => { },
        borderColor: "white"
      }
    ], tabs = [
      {
        text: "Settings",
        onPress: () => {},
        active: false
      }
    ]

    return (
      <Container>
        <View style={styles.headerWrapper}>
          <LifekeyHeader icons={icons} tabs={tabs} />
        </View>
        <ScrollView style={styles.contentContainer}>
          <View style={styles.content}>
            <Touchable onPress={this.onPressHelp.bind(this)}>
              <View style={styles.menuItem}>
                <View style={styles.menuItemImage}>
                  <HelpIcon width={Design.headerIconWidth} height={Design.headerIconHeight} stroke={Design.headerIconColour}></HelpIcon>
                </View>
                <View style={styles.menuItemContent}>
                  <View style={styles.menuItemName}>
                    <Text style={styles.menuItemNameText}>Help</Text>  
                    <Text style={styles.menuItemDescriptionText}>Help pages to learn more about Life Qi</Text>                      
                  </View>
                </View>
              </View>
            </Touchable>
            <Touchable onPress={this.onPressHelp.bind(this)}>
              <View style={styles.menuItem}>
                <View style={styles.menuItemImage}>
                  <GearIcon width={Design.headerIconWidth} height={Design.headerIconHeight} stroke={Design.headerIconColour}></GearIcon>
                </View>
                <View style={styles.menuItemContent}>
                  <View style={styles.menuItemName}>
                    <Text style={styles.menuItemNameText}>Legal</Text>  
                    <Text style={styles.menuItemDescriptionText}>Terms and Conditions</Text>                      
                  </View>
                </View>
              </View>
            </Touchable>
            <Touchable onPress={this.onPressHelp.bind(this)}>
              <View style={styles.menuItem}>
                <View style={styles.menuItemImage}>
                  <CrossIcon width={Design.headerIconWidth} height={Design.headerIconHeight} stroke={Design.headerIconColour}></CrossIcon>
                </View>
                <View style={styles.menuItemContent}>
                  <View style={styles.menuItemName}>
                    <Text style={styles.menuItemNameText}>Log Out</Text>  
                    <Text style={styles.menuItemDescriptionText}>Log out of the Life Qi app</Text>                      
                  </View>
                </View>
              </View>
            </Touchable>
            <Touchable onPress={() => this.onDeregister()}>
              <View style={styles.menuItem}>
                <View style={styles.menuItemImage}>
                  <CrossIcon width={Design.headerIconWidth} height={Design.headerIconHeight} stroke={Design.headerIconColour}></CrossIcon>
                </View>
                <View style={styles.menuItemContent}>
                  <View style={styles.menuItemName}>
                    <Text style={styles.menuItemNameText}>Deregister</Text>  
                    <Text style={styles.menuItemDescriptionText}>Deregisters and removes user data</Text>                      
                  </View>
                </View>
              </View>
            </Touchable>
          </View>
        </ScrollView>

      </Container>
    )
  }

}

const styles = {
  "content": { 
    "height": Dimensions.get('window').height - Design.lifekeyHeaderHeight - StatusBar.currentHeight,
    "flex": 1,
    "backgroundColor": Palette.consentWhite,
    "alignItems": "center",
    "justifyContent": "center",
    "paddingRight": Design.paddingRight / 2,
    "paddingLeft": Design.paddingLeft / 2,
  },
  "menuItem": {
    "width":Dimensions.get('window').width - Design.paddingLeft - Design.paddingRight,
    "flex": 1,
    "flexDirection": "row",
    "justifyContent": "center",
    "maxHeight": 75,
    "margin": 15,
    "marginBottom": 0,
    "paddingBottom": 15,
    "borderBottomWidth": 2,
    "borderBottomColor": Palette.consentGrayLight
  },
  "menuItemImage": {
    "flex": 1,
    "width": 50,
    "height": 50,
    "justifyContent": "center",
    "alignItems": "center"
  },
  "menuItemContent": {
    "flex": 5,
    "flexDirection": "column",
  },
  "menuItemName": {
    "flex": 1,
    "alignItems": "flex-start",
    "justifyContent": "center",
  },
  "menuItemNameText": {
    "fontWeight": "bold",
    "color": Palette.consentGrayDarkest
  },
  "menuItemDescriptionText":{
    "color": Palette.consentGrayDarkest
  }
}

export default Menu

