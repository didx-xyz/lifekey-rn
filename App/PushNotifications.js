
import Logger from './Logger'
import Routes from './Routes'
import ConsentUser from './Models/ConsentUser'
import ConsentConnection from './Models/ConsentConnection'
import ConsentConnectionRequest from './Models/ConsentConnectionRequest'
import ConsentDiscoveredUser from './Models/ConsentDiscoveredUser'
import ConsentISA from './Models/ConsentISA'

export default {
  handlers: {
    received_did: function(msg) {
      Logger.firebase('received_did')
      ConsentUser.setDid(
        msg.data.did_value
      ).then(did => {
        Logger.info(`DID set to ${did}`, this.filename)
      }).catch(error => {
        Logger.error('Could not set DID', this.filename, error)
      })
    },
    user_connection_request: function(msg) {
      Logger.firebase('user_connection_request')
      ConsentConnectionRequest.add(
        msg.data.user_connection_request_id,
        msg.data.from_id,
        msg.data.from_did,
        msg.data.from_nickname
      ).then(connectionRequests => {
        Logger.firebase('ConsentConnectionRequest updated')
        console.log(connectionRequests)
      }).catch(error => {
        Logger.error('Error writing to ConsentConnectionRequest', this.filename, error)
      })
      ConsentDiscoveredUser.add(
        msg.data.from_id,
        msg.data.from_did,
        msg.data.from_nickname
      ).then(discoveredUsers => {
        Logger.firebase("ConsentDiscoveredUser updated")
        console.log(discoveredUsers)
      }).catch(error => {
        Logger.error('Error writing to ConsentDiscoveredUser ')
      })
    },
    user_connection_created: function(msg) {
      Logger.firebase('user_connection_created')
      ConsentConnection.add(
        msg.data.user_connection_id,
        msg.data.to_id
      ).then(() => {
        Logger.info('Connection created')
        this.forceUpdate()
        Logger.info('Force update')
      }).catch(error => {
        Logger.error(error, this.filename, error)
      })
    },
    sent_activation_email: function(msg) {
      Logger.firebase('sent_activiation_email')
      alert(`${msg.notification.title} - ${msg.notification.body}`)
    },
    app_activation_link_clicked: function(msg) {
      Logger.firebase('app_activation_link_clicked')
      this.navigator.replace(Routes.main)
    },
    information_sharing_agreement_request: function(msg) {
      Logger.firebase('information_sharing_agreement_request')
      ConsentISA.add(
        msg.data.isar_id,
        msg.data.from_id
      ).then(_ => {
        Logger.info('ISA Added')
      }).catch(error => {
        Logger.error(error, this.filename, error)
      })
    }
  },
  error: function(msg) {
    Logger.firebase(JSON.stringify(msg))
    if (msg.notification) {
      Logger.info(msg.notification.title + ' - ' + msg.notification.body, this.filename)
    }
  }
}
