import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native'
import Touchable from './Touchable'
import Design from '../DesignParameters'
import Palette from '../Palette'
import PropTypes from 'prop-types'
import ForwardIcon from '../Components/ForwardIcon'

class ISACard extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.isaCardWrapper}>
        <View style={{ flex: 1 }}>
          <View style={styles.datesRowWrapper}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.date}>DATE</Text>
              <Text style={{ color: Palette.consentGrayDarkest }}>{this.props.date}</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.expires}>EXPIRES</Text>
              <Text style={{ color: Palette.consentGrayDarkest }}>{this.props.expires}</Text>
            </View>
          </View>
          <View style={styles.isaDetails}>
            {/* <View style={styles.isaDetailsTitleWrapper}>
              <Text style={{ fontWeight: 'bold' }}>
                {this.props.title}
              </Text>
              <Touchable>
                <ForwardIcon width={16} height={16}/>
              </Touchable>
            </View> */}
            <View>
              {this.props.shared.map((share, i) => {
                return (
                  <Text style={{ color: Palette.consentGrayDarkest, fontSize: 15 }} key={i}>{`${'\u2713'} ` + share}</Text>
                )
              })}
            </View>
          </View>

          {/* <View style={styles.termsWrapper}>
            <View style={{ justifyContent: 'center' }}>
              <Text style={styles.termsLabelText}>
                TERMS
              </Text>
            </View>
            {this.props.terms.map((term, i) =>
              <View key={i} style={styles.term}>
                <View>{term.icon}</View>
                <Text style={{ color: Palette.consentGrayDarkest }}>{' ' + term.text}</Text>
              </View>
            )}
          </View> */}

          

          <View style={styles.revokeWrapper}>
            {/* <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={{ fontSize: 10 }}>{this.formatTx(this.props.transactionHash)}</Text>
            </View> */}
            <TouchableOpacity onPress={() => this.respondToActionableMessage(message_id, false)} style={[styles.rejectButton, { borderColor: this.props.colour }]}><Text style={[styles.messageActionableButtonsText, { color: "#000" }]}>Revoke</Text></TouchableOpacity>
          </View>

        </View>
      </View>
    )
  }

  formatTx(tx) {
    if (tx.length <= 0) {
      return "n/a"
    }
    const line1 = tx.substring(0, tx.length / 2)
    const line2 = tx.substring(tx.length / 2, tx.length)
    return "0x" + line1 + "\n" + line2
  }
}

const styles = {
  isaCardWrapper: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingTop: 14,
    paddingBottom: 14,
    paddingRight: 18,
    paddingLeft: 18,
    borderRadius: Design.borderRadius,
    marginBottom: 20
  },
  datesRowWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: Palette.consentGrayMedium
  },
  date: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingRight: 17
  },
  expires: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingRight: 15
  },
  revokeWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    // paddingTop: 10
  },
  revokeText: {
    color: Palette.consentBlue,
    fontSize: 17,
    paddingRight: 5
  },
  termsWrapper: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Palette.consentGrayMedium,
    paddingTop: 5,
    paddingBottom: 5
  },
  term: {
    paddingLeft: 4,
    paddingRight: 4,
    flexDirection: 'row',
    alignItems: 'center'
  },
  termsLabelText: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingRight: 5
  },
  isaDetails: {
    flex: 1,
    // borderBottomWidth: 1,
    // borderBottomColor: Palette.consentGrayMedium,
    paddingVertical: 15
  },
  isaDetailsTitleWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 5
  },
  messageActionableButtonsText: {
    padding: 20,
    color: Palette.consentWhite,
    fontWeight: "500",
    alignSelf: "center",
    fontSize: 15
  },
  rejectButton: {
    borderWidth: 1,
    borderRadius: 5,
    flex: 0.5,
    justifyContent: 'center',
    //margin: 10,
  }
}

ISACard.propTypes = {
  title: PropTypes.string,
  shared: PropTypes.array,
  terms: PropTypes.array,
  date: PropTypes.string,
  expires: PropTypes.string,
  colour: PropTypes.string,
}

ISACard.defaultProps = {
  title: "Default title",
  shared: [],
  terms: [],
  date: "00-00-0000",
  expires: "00-00-0000"
}

export default ISACard
