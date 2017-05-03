class Util {

  static ucfirst(value) {
    if (value && value.length > 0) {
      return value.charAt(0).toUpperCase() + value.substring(1)
    } else {
      return ''
    }
  }

  static checkParameters(requiredKeys, receivedObject) {
    // It must be an object
    if (typeof receivedObject !== 'object') {
      throw new Error(`Expected 'object', received '${typeof receivedObject}'`)
    }

    // Get the keys of the parameter object and sort them
    const receivedObjectKeys = Object.keys(receivedObject)

    // Maybe we can save CPU cycles (before we crash... )
    if (receivedObjectKeys.length !== requiredKeys.length) {

      const error = 'Expected an object containing the keys:\n'
                  + requiredKeys.reduce((p, c) => `${p}, '${c}'`, '').slice(2)
                  + '\nbut recieved an object containing:\n'
                  + receivedObjectKeys.reduce((p, c) => `${p}, '${c}'`, '').slice(2)

      throw new Error(error)
    }

    // We need these sorted, now
    const recievedObjectKeysSorted = receivedObjectKeys.sort()
    const requiredKeysSorted = requiredKeys.sort()

    // kickn' it oldskool
    for (let i = 0; i < requiredKeys.length; i++) {

      // Compare one by one
      if (recievedObjectKeysSorted[i] !== requiredKeysSorted[i]) {
        const error = 'Expected an object containing the keys:\n'
                    + requiredKeys.reduce((p, c) => `${p}, '${c}'`, '').slice(2)
                    + '\nbut recieved an object containing:\n'
                    + receivedObjectKeys.reduce((p, c) => `${p}, '${c}'`, '').slice(2)
        throw new Error(error)
      }

      // null is not allowed
      if (receivedObject[requiredKeys[i]] === null ||
          typeof receivedObject[requiredKeys[i]] === 'undefined') {
        throw new Error(`${receivedObject[requiredKeys[i]]} cannot be 'null' or 'undefined'`)
      }
    }

    // We're good to go
    return true

  }
}

export default Util
