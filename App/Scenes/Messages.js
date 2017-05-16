// external dependencies
import React from "react"
import { Text, View, ScrollView } from "react-native"
import { Container, Content, Footer, Header } from "native-base"

// internal dependencies
import BackButton from "../Components/BackButton"
import HelpIcon from "../Components/HelpIcon"
import Scene from "../Scene"
import Touchable from "../Components/Touchable"
const MESSAGES = 0
const ACTIVITY = 1

class Messages extends Scene {
  constructor(props) {
    super(props)
    this.state = {
      activeTab: MESSAGES,
      messages: [
        { from_name: 'Vocacom', message_text: 'Hello world', timestamp: '12 Jan 2020' },
        { from_name: 'Vocacom', message_text: 'Hello world', timestamp: '12 Jan 2020' },
        { from_name: 'Vocacom', message_text: 'Hello world', timestamp: '12 Jan 2020' },
        { from_name: 'Vocacom', message_text: 'Hello world', timestamp: '12 Jan 2020' },
        { from_name: 'Vocacom', message_text: 'Hello world', timestamp: '12 Jan 2020' },
        { from_name: 'Vocacom', message_text: 'Hello world', timestamp: '12 Jan 2020' },
        { from_name: 'Vocacom', message_text: 'Hello world', timestamp: '12 Jan 2020' },
        { from_name: 'Vocacom', message_text: 'Hello world', timestamp: '12 Jan 2020' },
        { from_name: 'Vocacom', message_text: 'Hello world', timestamp: '12 Jan 2020' },
        { from_name: 'Vocacom', message_text: 'Hello world', timestamp: '12 Jan 2020' },
        { from_name: 'Vocacom', message_text: 'Hello world', timestamp: '12 Jan 2020' },
        { from_name: 'Vocacom', message_text: 'Hello world', timestamp: '12 Jan 2020' },
        { from_name: 'Vocacom', message_text: 'Hello world', timestamp: '12 Jan 2020' },
        { from_name: 'Vocacom', message_text: 'Hello world', timestamp: '12 Jan 2020' },
        { from_name: 'Vocacom', message_text: 'Hello world', timestamp: '12 Jan 2020' },
        { from_name: 'Vocacom', message_text: 'Hello world', timestamp: '12 Jan 2020' },
        { from_name: 'Vocacom', message_text: 'Hello world', timestamp: '12 Jan 2020' },
        { from_name: 'Vocacom', message_text: 'Hello world', timestamp: '12 Jan 2020' },
        { from_name: 'Vocacom', message_text: 'Hello world', timestamp: '12 Jan 2020' },
      ],
      activities: []
    }
  }

  onPressActivity() {
    alert("go to activity")
  }

  onPressHelp() {
    alert("help")
  }

  onPressDone() {
    this.navigator.pop()
  }

  renderMessages(messages) {
    return (
      <View style={{ flex: 1 }}>
        {messages.map((x, i) =>
          this.renderMessage(x.from_name, x.message_text, x.timestamp, i)
        )}
      </View>
    )
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
    return (
      <View>
        <Text> Activities</Text>
      </View>
    )
  }

  renderTop() {
    return (
      <View style={styles.top}>
        <View style={styles.topLeft}>
          <Touchable onPress={() => this.setState({ activeTab: MESSAGES })}>
            <Text style={styles.topLeftText}>MESSAGES</Text>
          </Touchable>
        </View>
        <View style={styles.topRight}>
          <Touchable onPress={() => this.setState({ activeTab: ACTIVITY })}>
            <Text style={styles.topRightText}>ACTIVITY</Text>
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
            <HelpIcon width={24} height={24} stroke="#666" />
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
              this.renderMessages(this.state.messages)
            :
              this.renderActivities()
            }
          </View>
        </Content>
        <View style= {{ height: 80 }}>
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
  topLeft: {
    paddingTop: 30,
    paddingRight: 45,
    paddingBottom: 30,
    paddingLeft: 45
  },
  topLeftText: {
    color: "#1e76ff",
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
