// external dependencies
import React from "react"
import { Text, View, ScrollView } from "react-native"
import { Container, Content, Footer, Header } from "native-base"

// internal dependencies
import BackButton from "../Components/BackButton"
import HelpIcon from "../Components/HelpIcon"
import Scene from "../Scene"
import Routes from "../Routes"
import Design from '../DesignParameters'
import Palette from '../Palette'
import Touchable from "../Components/Touchable"
import ConsentMessage from '../Models/ConsentMessage'
import LifekeyFooter from '../Components/LifekeyFooter'
import ProgressIndicator from "../Components/ProgressIndicator"
import Logger from '../Logger'

const MESSAGES = 0
const ACTIVITY = 1

const helpScreens = [
  {
    "image": require("../Images/qr.png"),
    "heading": "Connect",
    "copy": "Qi Code connects me in a snap & replaces paperwork"
  }
]

class Messages extends Scene {
  constructor(props) {
    super(props)
    this.state = {
      activeTab: MESSAGES,
      messages: [],
      activities: [],
      asyncActionInProgress: true,
      progressCopy: "Loading messages..."
    }
  }

  componentDidFocus() {
    super.componentDidFocus()
    this.refreshMessages()
  }

  refreshMessages() {
    ConsentMessage.all()
      .then(messages => {
        messages.push({
          from_name: 'FROM',
          message_text: 'Dummy notification to check',
          timestamp: '2007-06-12T09:04:02.686Z'
        });

        messages.push({
          from_name: 'FROM',
          message_text: 'Dummy notification to check',
          timestamp: '2009-06-12T09:04:02.686Z'
        });

        messages.push({
          from_name: 'FROM',
          message_text: 'Dummy notification to check',
          timestamp: '2007-06-12T09:04:02.686Z'
        });

        messages.push({
          from_name: 'FROM',
          message_text: 'Dummy notification to check',
          timestamp: '2012-06-12T09:04:02.686Z'
        });
        
        return messages.map((element, index)=> {
          element['timestampN'] = new Date(element.timestamp).getTime();
          return element;
        });
      })
      .then(messages=> messages.sort((a, b) => a.timestampN > b.timestampN ? -1 : 1))
      .then(messages => {
        this.setState({ asyncActionInProgress: false, messages: messages });
      }).catch(err => {
        console.log(err)
        this.setState({ asyncActionInProgress: false, messages: [] })
      })
  }

  onPressActivity() {
    alert("go to activity")
  }

  onPressHelp() {
    this.navigator.push({
      ...Routes.helpGeneral,
      "destination": "messages",
      "screens": helpScreens,
      "navigationType": "pop"
    })
  }

  onPressDone() {
    this.navigator.pop()
  }

  renderMessages() {
    if (this.state.messages.length > 0) {
      return (
        <View style={{flex: 1}}>
          {this.state.messages.map(this.renderMessage)}
        </View>
      )
    } else {
      return (
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
          <Text>No Messages yet</Text>
        </View>
      )
    }
  }

  renderMessage(msg, idx, msgs) {

    const bottomLineColor = idx < msgs.length - 1 ? Palette.consentBlue : Palette.consentWhite

    return (
      <View style={styles.message} key={idx}>
        {/* series of divs forming a graphic */}
        <View style={styles.messageImage}>
          <View style={ Object.assign({}, styles.messageImageLine, {"flex": 3, "backgroundColor": Palette.consentBlue}) }></View> 
          <View style={styles.messageImageDot}></View>
          <View style={ Object.assign({}, styles.messageImageLine, {"flex": 5, "backgroundColor": bottomLineColor}) }></View> 
        </View>
        <View style={styles.messageContent}>
          <View style={styles.messageDescription}>
            <Text style={styles.messageDescriptionText}>
              <Text style={styles.bold}>{msg.from_name}</Text>
              
              {/*NOTE*/}
              {/*the whitespace character here is intentional*/}
              <Text> {msg.message_text}</Text>

            </Text>
          </View>
          <View style={styles.messageMeta}>
            <Text style={styles.messageMetaText}>
              {new Date(msg.timestamp).toDateString()}
            </Text>
          </View>
        </View>
      </View>
    )
  }

  renderActivities() {
    if (this.state.activities.length > 0) {
      return (
        <View style={{ flex: 1 }}>
          {this.state.activities.map((x, i) =>
            this.renderMessage(x.from_name, x.message_text, x.timestamp, i)
          )}
        </View>
      )
    } else {
      return (
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
          <Text>No notifications yet</Text>
        </View>
      )
    }
  }

  renderTop() {
    return (
      <View style={styles.top}>
        <View style={Object.assign({}, styles.messageImage, {"height": "100%"}) }>
          {/* image here */}
          { this.state.messages.length && <View style={ {"flex": 1, "width": 1, "marginBottom": -Design.paddingBottom, "backgroundColor": Palette.consentBlue} }></View> }
        </View>
      </View>
    )
  }

  render() {
    return (
      !this.state.asyncActionInProgress ? 
        <Container>
          <BackButton navigator={this.navigator} />
          <Content style={{flex: 1}}>
            <View style={{height: 80}}>
              {this.renderTop()}
            </View>
            <View style={{flex: 1}}>
              {this.state.activeTab === MESSAGES ? (
                this.renderMessages()
              ) : (
                this.renderActivities()
              )}
            </View>
          </Content>
          <LifekeyFooter
            color={ Palette.consentOffBlack }
            backgroundColor={ Palette.consentWhite }
            rightButtonText="Done"
            onPressRightButton={this.onPressDone.bind(this)}
          />
        </Container>
      :
        <ProgressIndicator progressCopy={ this.state.progressCopy }></ProgressIndicator>
    )
  }
}

const styles = {
  content: {
    backgroundColor: Palette.consentOffWhite
  },
  bold: {
    fontWeight: "bold"
  },
  top: {
    width: "100%",
    height: Design.lifekeyHeaderHeight,
    paddingLeft: Design.paddingLeft
  },
  topLine: {
    paddingTop: 30,
    paddingRight: 45,
    paddingBottom: 30,
    paddingLeft: 45
  },
  middle: {
    flex: 1,
    width: "100%",
    height: "74%",
    flexDirection: "column"
  },
  message: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: Design.paddingLeft,
    padding: Design.paddingRight,
  },
  messageImage: {
    width: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -Design.paddingRight, // Pull the image into the padded region of it's parent. 
    marginBottom: -Design.paddingRight
  },
  messageImageLine:{
    "width": 1
  },
  messageImageDot:{
    "width": 10,
    "height": 10,
    "borderRadius": 5,
    "backgroundColor": Palette.consentBlue
  },
  messageContent: {
    flex: 1
  },
  messageDescriptionText: {
    fontSize: 13,
    color: "#666"
  },
  messageMetaText: {
    fontSize: 11,
    color: "#999"
  },
  bottom: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  bottomLeft: {
    paddingTop: 30,
    paddingRight: 45,
    paddingBottom: 30,
    paddingLeft: 45
  },
  bottomRight: {
    paddingTop: 30,
    paddingRight: 45,
    paddingBottom: 30,
    paddingLeft: 45
  },
  bottomRightText: {
    color: "#666"
  }
}

export default Messages
