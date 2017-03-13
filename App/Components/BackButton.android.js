import AndroidBackButton from 'react-native-android-back-button'

class BackButton extends React.Component {
  constructor(...params) {
    super(...params)
    this._handlePress = this._handlePress.bind(this)
  }

  _handlePress() {
    if (this.props.onPress) {
      return this.props.onPress()
    }

    this.navigator.pop()
    return true
  }

  render() {
    return (
      <AndroidBackButton onPress={this._handlePress} />
    )
  }
}

export default BackButton
