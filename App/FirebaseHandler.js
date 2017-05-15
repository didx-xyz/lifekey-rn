/**
 * Lifekey App
 * @copyright 2017 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */

import Logger from './Logger'
import Api from './Api'
import Session from './Session'
import ConsentConnection from './Models/ConsentConnection'
import ConsentUser from './Models/ConsentUser'
import ConsentConnectionRequest from './Models/ConsentConnectionRequest'
import ConsentDiscoveredUser from './Models/ConsentDiscoveredUser'
import ConsentISA from './Models/ConsentISA'
import ConsentThanksMessage from './Models/ConsentThanksMessage'
import ToastAndroid from 'react-native'


class FirebaseHandler {

  static messageReceived(message, eventEmitter) {

    // Logger.firebase('Message Received', message)
    if (message && message.type) {
      switch (message.type) {

      case 'received_thanks':
        Logger.firebase('received_thanks')
        ConsentDiscoveredUser.get(
          message.from_did
        ).then(function(from_user) {
          ConsentThanksMessage.add(
            new Date,
            message.amount,
            message.reason,
            from_user.nickname
          )
        }).then(function() {
          ToastAndroid.show('added new thanks message record', ToastAndroid.SHORT)
        }).catch(function(err) {
          Logger.warn('Unable to access app storage. Thanks not saved.', err)
        })
      break
      case 'received_did':
        Logger.firebase('received_did')
        ConsentUser.setDid(message.did_value)
        .then(did => {
          Logger.info(`DID set to ${did}`, this.filename)
          eventEmitter.emit('received_did')
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
        // Session.update({
        //   isas: {
        //     unacked: [{ id: message.isar_id }]
        //   }
        // })
        break

      case 'resource_pushed':
      // {"type":"resource_pushed","resource_ids":"[784,785,786]","isa_id":"138","fcm":{"action":null,"tag":null,"icon":null,"color":null,"body":"One or more resources were pushed to you","title":"ISA Resources Pushed"}}
      // console.log('$$$$$$$$$$$$$', message)
        message.resource_ids = JSON.parse(message.resource_ids)
        let verified_identity = null
        Promise.all(message.resource_ids.map(id =>
          Api.getResource({ id })
        ))
        .then(results => {
          verified_identity = results.find(result => result.body.schema === "http://schema.cnsnt.io/verified_identity")
        })
        if (verified_identity) {
          Session.update({
            has_verified_identity: true
          })
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

export default FirebaseHandler
