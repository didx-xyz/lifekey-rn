/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import Logger from './Logger'
import Api from './Api'
import Routes from './Routes'
import ConsentConnection from './Models/ConsentConnection'
import ConsentUser from './Models/ConsentUser'
import ConsentConnectionRequest from './Models/ConsentConnectionRequest'
import ConsentDiscoveredUser from './Models/ConsentDiscoveredUser'
import ConsentISA from './Models/ConsentISA'
// import EventEmitter from 'EventEmitter'

class Firebase {

  static messageReceived(message, eventEmitter) {
    Logger.firebase('Message Received', message)
    if (message.data && message.data.type) {
      switch (message.data.type) {

      case 'received_did':
        Logger.firebase('received_did')
        ConsentUser.setDid(message.data.did_value)
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
            user_connection_request_id: message.data.user_connection_request_id,
            accepted: true
          }),
          ConsentConnectionRequest.add(
            message.data.user_connection_request_id,
            message.data.from_id,
            message.data.from_did,
            message.data.from_nickname
          ),
          ConsentDiscoveredUser.add(
            message.data.from_id,
            message.data.from_did,
            message.data.from_nickname
          )
        ])
        .then(result => {
          const {
            response,
            connectionRequests,
            discoveredUsers
          } = result
          console.log('Promise.all', response, connectionRequests, discoveredUsers)
          Logger.info('Connection Request Accepted')
        })
        .catch(error => {
          Logger.error(error)
        })
        break

      case 'user_connection_created':
        Logger.firebase('user_connection_created')
        ConsentConnection.add(
          message.data.user_connection_id,
          message.data.to_did
        )
        .then(() => {
          Logger.info('Connection created')
          eventEmitter.emit('user_connection_created')
        })
        .catch(error => {
          Logger.error(error, this.filename, error)
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
        Logger.firebase('information_sharing_agreement_request')
        // Would you like to accept?
        // if yes:
        try {
          ConsentISA.update(
            message.data.isar_id,
            message.data.from_did
          )
        } catch (e) {
          Logger.error(e)
        }
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

export default Firebase
