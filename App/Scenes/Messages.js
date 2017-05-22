// external dependencies
import React from "react"
import { Text, View, ScrollView } from "react-native"
import { Container, Content, Footer, Header } from "native-base"

// internal dependencies
import BackButton from "../Components/BackButton"
import HelpIcon from "../Components/HelpIcon"
import Scene from "../Scene"
import Routes from "../Routes"
import Touchable from "../Components/Touchable"
import ConsentMessage from '../Models/ConsentMessage'
import Logger from '../Logger'

const MESSAGES = 0
const ACTIVITY = 1

const helpScreens = [ 
  { "image": require("../Images/qr.png"), "heading": "Connect", "copy": "Qi Code connects me in a snap & replaces paperwork" }
]

class Messages extends Scene {
  constructor(props) {
    super(props)
    this.state = {
      activeTab: MESSAGES,
      messages: [],
      activities: []
    }
  }

  componentDidFocus() {
    super.componentDidFocus()
    ConsentMessage.all()
    .then(messages => {
      this.setState({ messages })
    })
  }

  onPressActivity() {
    alert("go to activity")
  }

  onPressHelp() {
    this.navigator.push({...Routes.helpGeneral, "destination": "messages", "screens": helpScreens, "navigationType": "pop" })
  }

  onPressDone() {
    this.navigator.pop()
  }

  renderMessages() {
    if (this.state.messages.length > 0) {
      return (
        <View style={{ flex: 1 }}>
          {this.state.messages.map((x, i) =>
            this.renderMessage(x.from_name, x.message_text, x.timestamp, i)
          )}
        </View>
      )
    } else {
      return (
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
          <Text>No Messages yet</Text>
        </View>
      )
    }
  }

  renderMessage(from_name, message_text, timestamp, key) {
    return (
      <View style={styles.message} key={key}>
        <View style={styles.messageImage}>
          {/* image here */}
          <Text>+</Text>
        </View>
        <View style={styles.messageContent}>
          <View style={styles.messageDescription}>
            <Text style={styles.messageDescriptionText}>
              <Text style={styles.bold}>{from_name}</Text>
              <Text> {message_text}</Text>
            </Text>
          </View>
          <View style={styles.messageMeta}>
            <Text style={styles.messageMetaText}>
              {timestamp}
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
          <Text>No notifications yet yet</Text>
        </View>
      )
    }
  }

  renderTop() {
    return (
      <View style={styles.top}>

      { /* Left Tab Button */ }
        <View style={styles.topButton}>
          <Touchable onPress={() => this.setState({ activeTab: MESSAGES })}>
            <Text
              style={[
                styles.topButtonText,
                this.state.activeTab === MESSAGES ? { color: "#1e76ff" } : {}
            ]}>
              MESSAGES
            </Text>
          </Touchable>
        </View>

        { /* Right Tab Button */ }
        <View style={styles.topButton}>
          <Touchable onPress={() => this.setState({ activeTab: ACTIVITY })}>
            <Text
              style={[
                styles.topButtonText,
                this.state.activeTab === ACTIVITY ? { color: "#1e76ff" } : {}
            ]}>
              ACTIVITY
            </Text>
          </Touchable>
        </View>
      </View>
    )
  }

  renderBottom() {
    return (
      <View style={styles.bottom}>
        <View style={styles.bottomLeft}>
          <Touchable onPress={() => this.onPressHelp()}>
            {/* <HelpIcon width={24} height={24} stroke="#666" /> */}
            <Text style={styles.bottomRightText}>Help</Text>
          </Touchable>
        </View>
        <View style={styles.bottomRight}>
          <Touchable onPress={() => this.onPressDone()}>
            <Text style={styles.bottomRightText}>Done</Text>
          </Touchable>
        </View>
      </View>
    )
  }

  render() {
    return (
      <Container>
        <BackButton navigator={this.navigator} />
        <View style={{ height: 80 }}>
          {this.renderTop()}
        </View>
        <Content style={{ flex: 8 }}>
          <View style={{ flex: 8 }}>
            {this.state.activeTab === MESSAGES ?
              this.renderMessages()
            :
              this.renderActivities()
            }
          </View>
        </Content>
        <View style={{ height: 80 }}>
          <View style={{ flex: 1 }}>
            {this.renderBottom()}
          </View>
        </View>
      </Container>
    )
  }
}

const styles = {
  content: {
    backgroundColor: "#fff"
  },
  bold: {
    fontWeight: "bold"
  },
  top: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  topButton: {
    paddingTop: 30,
    paddingRight: 45,
    paddingBottom: 30,
    paddingLeft: 45
  },
  topButtonText: {
    fontSize: 12,
    fontWeight: "bold"
  },
  topRight: {
    paddingTop: 30,
    paddingRight: 45,
    paddingBottom: 30,
    paddingLeft: 45
  },
  topRightText: {
    color: "#999",
    fontSize: 12,
    fontWeight: "bold"
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
    padding: 15
  },
  messageImage: {
    width: 30,
    justifyContent: "center",
    alignItems: "center"
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
