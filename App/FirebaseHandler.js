/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import Logger from './Logger'
import Api from './Api'
import ConsentConnection from './Models/ConsentConnection'
import ConsentUser from './Models/ConsentUser'
import ConsentConnectionRequest from './Models/ConsentConnectionRequest'
import ConsentDiscoveredUser from './Models/ConsentDiscoveredUser'
import ConsentISA from './Models/ConsentISA'

class FirebaseHandler {

  static messageReceived(message, eventEmitter) {
    // Logger.firebase('Message Received', message)
    if (message && message.type) {
      switch (message.type) {

      case 'received_did':
        Logger.firebase('received_did')
        ConsentUser.setDid(message.did_value)
        .then(did => {
          Logger.info(`DID set to ${did}`, this.filename)
        })
        .catch(error => {
          Logger.error('Could not set DID', this.filename, error)
        })
        break

      case 'user_connection_request':
        Promise.all([
          Api.respondConnectionRequest({
            user_connection_request_id: message.user_connection_request_id,
            accepted: true
          }),
          ConsentDiscoveredUser.add(
            message.from_id,
            message.from_did,
            message.from_nickname
          )
        ])
        .then(result => {
          const {
            response,
            connectionRequests,
            discoveredUsers
          } = result
          Logger.info('Connection Request Accepted')
        })
        .catch(error => {
          Logger.error(error)
        })
        break

      case 'user_connection_created':
        Logger.firebase('user_connection_created', message)
        ConsentConnection.add(
          message.user_connection_id,
          message.to_did
        )
        .then(() => {
          Logger.info('Connection added successfully')
          eventEmitter.emit('user_connection_created')
        })
        .catch(error => {
          Logger.warn("Could not add user connection", error)
        })
        break

      case 'sent_activiation_email':
        Logger.firebase('sent_activiation_email')
        alert(`${message.notification.title} - ${message.notification.body}`)
        break

      case 'app_activation_link_clicked':
        Logger.firebase('app_activation_link_clicked')
        eventEmitter.emit('app_activation_link_clicked')
        break

      case 'information_sharing_agreement_request':
        Logger.firebase('information_sharing_agreement_request', message)
        eventEmitter.emit('information_sharing_agreement_request', message)
        break

      default:
        Logger.firebase(JSON.stringify(message))
        if (message.notification) {
          Logger.info(message.notification.title + ' - ' + message.notification.body, this.filename)
        }
        break

      }

    } else {
      // Just a normal notification
      if (message.notification) {
        Logger.firebase(JSON.stringify(message))
      } else {
        Logger.error('Unexpected firebase message format')
      }
    }
  }
}

export default FirebaseHandler
