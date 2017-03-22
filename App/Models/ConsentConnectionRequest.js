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
      Session.update({ connectionRequests: [{ id, from_id, from_did, from_nickname }] })
    }
  }
}

export default ConsentConnectionRequest
