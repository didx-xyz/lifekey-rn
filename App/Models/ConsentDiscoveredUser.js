/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import Session from '../Session'

class ConsentDiscoveredUser {

  static storageKey = 'discovered_users'

  static add(id, did, nickname) {
    const discoveredUsers = Session.getState()[ConsentDiscoveredUser.storageKey]
    if (discoveredUsers) {
      const updatedDiscoveredUsers = discoveredUsers.concat(discoveredUsers, [{ id, did, nickname }])
      const update = {}[ConsentDiscoveredUser.storageKey] = updatedDiscoveredUsers
      Session.update(update)
    } else {
      // Create first record
      const update = {}[ConsentDiscoveredUser.storageKey] = [{ id, did, nickname }]
      Session.update(update)
    }
  }

  static remove(id) {
    const discoveredUsers = Session.getState()[ConsentDiscoveredUser.storageKey]
    if (discoveredUsers) {
      // Remove element with matching ID
      const updatedDiscoveredUsers = discoveredUsers.filter(element => element.id !== id)
      const update = {}[ConsentDiscoveredUser.storageKey] = updatedDiscoveredUsers
      Session.update(update)
    } else {
      throw 'No discoveredUsers exist yet'
    }
  }

  static get(id) {
    const discoveredUsers = Session.getState()[ConsentDiscoveredUser.storageKey]
    if (discoveredUsers) {
      const user = discoveredUsers.find(user => user.id === id)
      if (user) {
        return user
      } else {
        throw `No discovered user with id: ${id}`
      }
    } else {
      throw 'No discoveredUsers exist yet'
    }
  }

  static all() {
    const discoveredUsers = Session.getState()[ConsentDiscoveredUser.storageKey]
    if (discoveredUsers) {
      return discoveredUsers
    } else {
      throw 'No discoveredUsers exist yet'
    }
  }
}

export default ConsentDiscoveredUser
