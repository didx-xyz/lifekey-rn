
import Logger from './Logger'
import Routes from './Routes'
import ConsentUser from './Models/ConsentUser'
import ConsentConnection from './Models/ConsentConnection'
import ConsentConnectionRequest from './Models/ConsentConnectionRequest'
import ConsentDiscoveredUser from './Models/ConsentDiscoveredUser'
import ConsentISA from './Models/ConsentISA'

export default {
  handlers: {
    received_did: function(message) {
      Logger.firebase('received_did')
      ConsentUser.setDid(
        message.data.did_value
      ).then(did => {
        Logger.info(`DID set to ${did}`, this.filename)
      }).catch(error => {
        Logger.error('Could not set DID', this.filename, error)
      })
    },
    user_connection_request: function(message) {
      Logger.firebase('user_connection_request')
      ConsentConnectionRequest.add(
        message.data.user_connection_request_id,
        message.data.from_id,
        message.data.from_did,
        message.data.from_nickname
      ).then(connectionRequests => {
        Logger.firebase('ConsentConnectionRequest updated')
        console.log(connectionRequests)
      }).catch(error => {
        Logger.error('Error writing to ConsentConnectionRequest', this.filename, error)
      })
      ConsentDiscoveredUser.add(
        message.data.from_id,
        message.data.from_did,
        message.data.from_nickname
      ).then(discoveredUsers => {
        Logger.firebase("ConsentDiscoveredUser updated")
        console.log(discoveredUsers)
      }).catch(error => {
        Logger.error('Error writing to ConsentDiscoveredUser ')
      })
    },
    user_connection_created: function(message) {
      Logger.firebase('user_connection_created')
      ConsentConnection.add(
        message.data.user_connection_id,
        message.data.to_did
      ).then(() => {
        Logger.info('Connection created')
        this.navigator.push(Routes.main)
      }).catch(error => {
        Logger.error(error, this.filename, error)
      })
    },
    sent_activation_email: function(message) {
      Logger.firebase('sent_activiation_email')
      alert(`${message.notification.title} - ${message.notification.body}`)
    },
    app_activation_link_clicked: function(message) {
      Logger.firebase('app_activation_link_clicked')
      this.navigator.push(Routes.main)
    },
    information_sharing_agreement_request: function(message) {
      Logger.firebase('information_sharing_agreement_request')
      // Would you like to accept?
      // if yes:§
      ConsentISA.add(
        message.data.isar_id,
        message.data.from_did
      ).then(() => {
        Logger.info('ISA Added')
        // respond
      }).catch(error => {
        Logger.error(error, this.filename, error)
      })
    }
  },
  error: function(message) {
    Logger.firebase(JSON.stringify(message))
    if (message.notification) {
      Logger.info(message.notification.title + ' - ' + message.notification.body, this.filename)
    }
  }
}
