import React, { Component } from 'react'
import { View, Text } from 'react-native'
import VerifiedIcon from '../../Components/VerifiedIcon'
import PeriodIcon from '../../Components/PeriodIcon'
import MobileIcon from '../../Components/MobileIcon'
import MarketingIcon from '../../Components/MarketingIcon'
import LocationIcon from '../../Components/LocationIcon'
import LandlineIcon from '../../Components/LandlineIcon'
import InfoIcon from '../../Components/InfoIcon'
import HexagonIcon from '../../Components/HexagonIcon'
import HexagonDots from '../../Components/HexagonDots'
import HelpIcon from '../../Components/HelpIcon'
import ForwardIcon from '../../Components/ForwardIcon'
import EnvelopeIcon from '../../Components/EnvelopeIcon'
import BackIcon from '../../Components/BackIcon'
import Dots from '../../Components/Dots'

import * as Base from 'native-base'

class DebugSvg extends Component {
  render() {
    return (
      <Base.Container>
        <Base.Content>
          <View style={{ flex: 1, alignItems: 'center', padding: 10 }}>
            <VerifiedIcon width={50} height={50}/>
            <PeriodIcon width={50} height={50}/>
            <MobileIcon width={50} height={50}/>
            <MarketingIcon width={50} height={50}/>
            <LocationIcon width={50} height={50}/>
            <LandlineIcon width={50} height={50}/>
            <InfoIcon width={50} height={50}/>
            <HexagonIcon width={50} height={50}/>
            <HexagonDots current={4}/>
            <HelpIcon width={50} height={50}/>
            <ForwardIcon width={50} height={50}/>
            <EnvelopeIcon width={50} height={50}/>
            <BackIcon width={50} height={50}/>
            <Dots max={5}/>
          </View>
        </Base.Content>
      </Base.Container>
    )
  }
}

export default DebugSvg