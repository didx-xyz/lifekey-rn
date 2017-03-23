/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */
import Session from '../Session'
import Storage from '../Storage'
import Config from '../Config'

class ConsentConnectionRequest {

  static storageKey = 'connection_requests'

  static add(id, from_id, from_did, from_nickname) {

    // Get the current connections
    const connectionRequests = Session.getState()[ConsentConnectionRequest.storageKey]
    if (connectionRequests) {
      // If some already exist, create an updated object
      const updatedConnections = connectionRequests.concat(connectionRequests, [{
        id, from_id, from_did, from_nickname
      }])

      // Update the session
      const update = {}[ConsentConnectionRequest.storageKey] = updatedConnections
      Session.update(update)
    } else {
      // Create and add first one
      const update = {}[ConsentConnectionRequest] = [{ id, from_id, from_did, from_nickname }]
      Session.update(update)
    }
  }

  static remove(id) {
    const connectionRequests = Session.getState()[ConsentConnectionRequest.storageKey]
    if (connectionRequests) {
      const updatedConnectionRequest = connectionRequests.filter(element => element.id === id)
      const update = {}[ConsentConnectionRequest] = updatedConnectionRequest
      Session.update(update)
    } else {
      throw 'No connectionRequests exist yet'
    }
  }

  static get(id) {
    const connectionRequests = Session.getState()[ConsentConnectionRequest.storageKey]
    if (connectionRequests) {
      const connectionRequest = connectionRequests.find(connectionRequest => connectionRequest.id === id)
      if (connectionRequest) {
        return connectionRequest
      } else {
        throw `No connectionRequest with id: ${id}`
      }
    } else {
      throw 'No connectionRequest exist yet'
    }
  }

  static all() {
    const connectionRequest = Session.getState()[ConsentConnectionRequest.storageKey]
    if (connectionRequest) {
      return connectionRequest
    } else {
      throw 'No connectionRequest exist yet'
    }
  }

}

export default ConsentConnectionRequest
