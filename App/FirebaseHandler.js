import Logger from './Logger'
import Api from './Api'
import Session from './Session'
import ConsentConnection from './Models/ConsentConnection'
import ConsentUser from './Models/ConsentUser'
import ConsentUserShare from './Models/ConsentUserShare'
import ConsentShareLog from './Models/ConsentShareLog'
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
  
  static received_thanks(message, eventEmitter, nickname) {
    return ConsentThanksMessage.add(
      new Date,
      nickname,
      message.amount,
      message.reason
    ).catch(console.log.bind(console, 'error saving thanks'))
  }
  
  static user_connection_request(message, eventEmitter) {
    
    // Make this more intelligent 
    Logger.firebase('user_connection_request', message)
    console.log("USER_CONNECTION_REQUEST: ", message)

    ConsentConnectionRequest.add(
      message.user_connection_request_id,
      message.from_id,
      message.from_did,
      message.from_nickname
    ).then(_ => {
      Logger.info('Connection request added successfully')
      return Api.profile({did: message.from_did})
    }).then(profile => {
      profile = profile.body.user
      const newConnection = Object.assign(
        {},
        profile,
        {
          user_connection_request_id: message.user_connection_request_id,
          image_uri: `data:image/jpg;base64,${profile.image_uri}`
        }
      )
      ConsentUser.addNewPendingPeerConnection(newConnection)
      eventEmitter.emit('user_connection_request', message.from_nickname)
    }).catch(console.log)
  }
  
  static user_connection_created(message, eventEmitter) {

    Logger.firebase('user_connection_created', message)

    // Check human 
    ConsentConnection.add(message.user_connection_id, message.to_did)
                     .then( _ => {
                        Logger.info('Connection added successfully')
                        return Api.profile({did: message.other_user_did})
                     })
                     .then(profile => {

                          profile = profile.body.user

                          let newConnection = Object.assign({}, profile, 
                                              { 
                                                isa_id: message.sharing_isa_id, 
                                                user_connection_id: message.user_connection_id, 
                                                image_uri: profile.is_human ? 
                                                           `data:image/jpg;base64,${profile.image_uri}` : profile.image_uri
                                              })

                          if(profile.is_human){
                            // Sort resource types - TODO: fix confusing signature
                            newConnection = ConsentUser.sortConnectionData([newConnection])[0]
                            ConsentUser.addNewEnabledPeerConnection(newConnection)
                            ConsentUser.removePendingPeerConnection(newConnection)
                          }
                          else{
                            ConsentUser.addNewEnabledBotConnection(newConnection)
                            ConsentUser.removePendingBotConnection(newConnection)
                          }

                          eventEmitter.emit('user_connection_created', profile.display_name)

                      }).catch(console.log.bind(console, 'user_connection_created error'))

  }
  
  static user_connection_deleted(message, eventEmitter) {

    ConsentUser.removeEnabledPeerConnection(message.user_connection_id)

    // TODO: remove all cached and stored resources from the other party 
    ConsentShareLog.all_by_user(message.user_connection_id)
    ConsentUserShare.remove_all_by_user(message.user_connection_id)

    eventEmitter.emit('user_connection_deleted', message.user_connection_id)
  }
  
  static information_sharing_agreement_request(message, eventEmitter) {
    Logger.firebase('information_sharing_agreement_request', message)
    eventEmitter.emit('information_sharing_agreement_request', message)
  }
  
  static information_sharing_agreement_request_rejected(message, eventEmitter) {}
  
  static information_sharing_agreement_request_accepted(message, eventEmitter) {}
  
  static information_sharing_agreement_deleted(message, eventEmitter) {}
  
  static information_sharing_agreement_updated(message, eventEmitter) {}
  
  static resource_pushed(message, eventEmitter) {
    message.resource_ids = JSON.parse(message.resource_ids)
    return Promise.all(
      message.resource_ids.map(id => Api.getResource({id: id}))
    ).then(results => {
      
      /* Load connections to ascertain resource destinations */
      const allConnections = ConsentUser.getCached("myConnections")

      // FIXME add to storage and cache
      results.forEach(result => {
          ConsentUserShare.add(result.body)

          /* Prepare resource */          
          const resource = Api.shapeResource(result.body)

          /* If from human conneciton, add to connection data */
          if(!!allConnections && !!allConnections.peerConnections.some(c => c.did === resource.from_user_did)){
            console.log("FROM PEER")
            ConsentUser.updateConnectionState(resource)
          }
          
          /* If vc, add to user data and badges */
          if(!!resource.is_verifiable_claim){
            console.log("PASSED MUSTARD")
            ConsentUser.updateState(resource)
          }
        }
      )

      return Promise.resolve(
        results.find(
          result => result.body.schema.indexOf('schema.cnsnt.io/verified_identity') > -1
        )
      )
    }).then(verified_identity => {
      Session.update({has_verified_identity: !!verified_identity})
      eventEmitter.emit('resource_pushed', message.attribute)
    }).catch(error => {
      console.log("Hit this error in FB Handler: ", error)
    })
  }
  
  static sent_activation_email(message, eventEmitter) {
    Logger.firebase('sent_activiation_email')
  }
  
  static app_activation_link_clicked(message, eventEmitter) {
    Logger.firebase('app_activation_link_clicked')
    eventEmitter.emit('app_activation_link_clicked')
  }
  
  static received_did(message, eventEmitter) {
    Logger.firebase('received_did')
    ConsentUser.setDid(
      message.did_value
    ).then(did => {
      Logger.info(`DID set to ${did}`, this.filename)
      eventEmitter.emit('received_did')
    }).catch(error => {
      Logger.error('Could not set DID', this.filename, error)
    })
  }
  
  static user_message_received(message, eventEmitter) {
    return Promise.all([
      ConsentUserConnectionMessage.add(
        message.from_did,
        message.message,
        new Date
      )
    ]).then(function() {
      eventEmitter.emit('user_message_received', message.from_did)
    }).catch(console.log)
  }

  static isa_ledgered(message, eventEmitter) {}

  static messageReceived(eventEmitter, message) {
    if (message && message.type) {
      Logger.firebase('message', JSON.stringify(message))
      Logger.firebase('message.type', message.type)
      
      new Promise(function(resolve) {
        if (!message.from_did) return resolve({nickname: 'LifeQi'})
        ConsentDiscoveredUser.get(
          message.from_did
        ).then(
          resolve
        ).catch(
          resolve.bind(resolve, {nickname: 'LifeQi'})
        )
      }).then(function(from_user) {
        from_user = from_user || {}
        var nickname = (
          from_user.nickname ||
          from_user.display_name ||
          'LifeQi'
        )
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
        
        // invoke firebase message handler
        FirebaseHandler[message.type](message, eventEmitter, nickname)
        
      }).catch(Logger.warn)
    } else if (message.notification) {
      Logger.firebase(JSON.stringify(message))
    } else {
      Logger.error('Unexpected firebase message format')
    }
  }
}

export default FirebaseHandler
