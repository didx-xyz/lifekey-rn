import React, { Component } from 'react'
import { View } from 'react-native'
import Palette from '../Palette'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Input } from 'native-base'
import Touchable from '../Components/Touchable'

class SearchBox extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={style.searchBox}>
          <Icon
            style={style.searchBoxSearchIcon}
            name="search" size={20}
            color={Palette.consentGrayDark}
          />
          <Input
            value={this.props.text}
            onChangeText={(text) => this.props.onChangeText(text)}
            style={Object.assign(
              style.searchBoxInput,
              { borderTopRightRadius: this.props.text ? null : 10,
                borderBottomRightRadius: this.props.text ? null : 10 }
            )}
            placeholder="Search"
          />
          { this.props.text !== '' &&
            <Touchable onPress={() => this.clearSearch()}>
              <Icon
                style={style.searchBoxCloseIcon}
                name="times-circle"
                size={25}
                color={Palette.consentGrayDark}
              />
            </Touchable>
          }
      </View>
    )
  }
}

export default SearchBox


const style = {
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    margin: 5,
    borderWidth: 2,
    borderColor: Palette.consentGrayMedium,
    borderRadius: 10,
  },
  searchBoxInput: {
    flex: 1,
    backgroundColor: 'white',
    fontSize: 17,
    padding: 2
  },
  searchBoxSearchIcon: {
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 5,
    paddingTop: 10,
    paddingLeft: 10,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0
  },
  searchBoxCloseIcon: {
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 5,
    paddingTop: 8,
    paddingRight: 10,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0
  },
}