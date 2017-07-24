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
import ConsentUserConnectionMessage from './Models/ConsentUserConnectionMessage'
import {ToastAndroid} from 'react-native'
import ConsentMessage from './Models/ConsentMessage'

class FirebaseHandler {
  static humanReadableMessageType(message_type) {
    if (message_type === 'received_thanks') return 'Received Thanks'
    if (message_type === 'received_did') return 'Received a Decentralised Identifier'
    if (message_type === 'user_connection_request') return 'Received a User Connection Request'
    if (message_type === 'user_connection_created') return 'User Connection Created'
    if (message_type === 'sent_activation_email') return 'Account Activation Email Sent'
    if (message_type === 'app_activation_link_clicked') return 'Account was Activated'
    if (message_type === 'information_sharing_agreement_request') return 'Received Information Sharing Agreement Request'
    if (message_type === 'information_sharing_agreement_request_accepted') return 'Information Sharing Agreement Established'
    if (message_type === 'isa_ledgered') return 'Information Sharing Agreement Ledgered'
    if (message_type === 'resource_pushed') return 'Received Data Resource'
    if (message_type === 'user_message_received') return 'Received User Connection Message'
    return 'Unknown Message Type'
  }
  static messageReceived(eventEmitter, message) {
    if (message && message.type) {
      Logger.firebase('message.type', message.type)
      
      new Promise(function(resolve) {
        if (!message.from_did) return resolve()
        ConsentDiscoveredUser.get(
          message.from_did
        ).then(
          resolve
        ).catch(
          resolve.bind(resolve, null)
        )
      }).then(function(from_user) {
        var nickname = from_user ? (from_user.nickname || from_user.display_name) : 'LifeQi'
        return Promise.all([
          nickname,
          ConsentMessage.add(
            nickname,
            FirebaseHandler.humanReadableMessageType(message.type),
            new Date
          )
        ])
      }).then(function(res) {
        var [nickname] = res
        
        switch (message.type) {
          case 'received_thanks':
            return ConsentThanksMessage.add(
              new Date,
              nickname,
              message.amount,
              message.reason
            ).then(function() {
              ToastAndroid.show('added new thanks message record', ToastAndroid.SHORT)
            }).catch(function(err) {
              Logger.warn('Unable to access app storage. Thanks not saved.', err)
            })
          case 'received_did':
            ConsentUser.setDid(
              message.did_value
            ).then(did => {
              Logger.info(`DID set to ${did}`, this.filename)
              eventEmitter.emit('received_did')
            }).catch(error => {
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
            ]).then(result => {
              const {
                response,
                connectionRequests,
                discoveredUsers
              } = result
              Logger.info('Connection Request Accepted')
            }).catch(error => {
              Logger.error(error)
            })
          break
          case 'user_connection_created':
            Api.profile({
              did: message.other_user_did
            }).then(function(profile) {
              console.log('profile', profile)
              return Promise.all([
                ConsentConnection.add(
                  message.user_connection_id,
                  message.other_user_did
                ),
                ConsentDiscoveredUser.add(
                  message.other_user_did,
                  profile.body.user.display_name,
                  profile.body.user.colour,
                  profile.body.user.image_uri,
                  profile.body.user.display_name,
                  profile.body.user.address,
                  profile.body.user.tel,
                  profile.body.user.email
                )
              ])
            }).then(_ => {
              Logger.info('Connection added successfully')
              eventEmitter.emit('user_connection_created')
            }).catch(error => {
              Logger.warn("Could not add user connection", error)
            })
          break
          case 'sent_activiation_email':
          break
          case 'app_activation_link_clicked':
            eventEmitter.emit('app_activation_link_clicked')
          break
          case 'information_sharing_agreement_request':
            eventEmitter.emit('information_sharing_agreement_request', message)
          break
          case 'resource_pushed':
            message.resource_ids = JSON.parse(message.resource_ids)
            Promise.all(
              message.resource_ids.map(id => Api.getResource({id: id}))
            ).then(results => {
              return Promise.resolve(
                results.find(
                  result => result.body.schema.indexOf('schema.cnsnt.io/verified_identity') > -1
                )
              )
            }).then(verified_identity => {
              Session.update({has_verified_identity: !!verified_identity})
            }).catch(console.log)
          break
          case 'user_message_received':
            ConsentUserConnectionMessage.add(
              message.from_did,
              message.message,
              new Date
            ).catch(console.log)
          break
          default:
            // Logger.firebase(JSON.stringify(message))
            // if (message.notification) {
            //   Logger.info(message.notification.title + ' - ' + message.notification.body, this.filename)
            // }
          break
        }
      }).catch(Logger.warn)
    } else if (message.notification) {
      Logger.firebase(JSON.stringify(message))
    } else {
      Logger.error('Unexpected firebase message format')
    }
  }
}

export default FirebaseHandler
