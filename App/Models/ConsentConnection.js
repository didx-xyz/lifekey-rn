/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */
import Session from '../Session'
import Storage from '../Storage'
import Config from '../Config'

class ConsentConnection {

  static storageKey = 'connections'

  static add(id, userId) {

    // Get the current connections
    const connections = Session.getState()[ConsentConnection.storageKey]
    if (connections) {
      // If some already exist, create an updated object
      const updatedConnections = connections.concat(connections, [{
        id, userId
      }])

      // Update the session
      const update = {}[ConsentConnection.storageKey] = updatedConnections
      Session.update(update)
    } else {
      // Create and add first one
      const update = {}[ConsentConnection.storageKey] = [{ id, userId }]
      Session.update(update)
    }
  }

  static remove(id) {
    const connections = Session.getState()[ConsentConnection.storageKey]
    if (connections) {
      // Create new array excluding the connection
      const updatedConnections = connections.filter(element => element.id !== id)
      const update = {}[ConsentConnection.storageKey] = updatedConnections
      Session.update(update)
    } else {
      throw 'No connections exist yet'
    }
  }

  static get(id) {
    const connections = Session.getState()[ConsentConnection.storageKey]
    if (connections) {
      const connection = connections.find(connection => connection.id === id)
      if (connection) {
        return connection
      } else {
        throw `Connectiontion with id ${id} does not exist`
      }
    } else {
      throw 'No connections exist yet'
    }
  }

  static all() {
    const connections = Session.getState()[ConsentConnection.storageKey]
    if (connections) {
      return connections
    } else {
      throw 'No connections exist yet'
    }
  }
}

export default ConsentConnection
