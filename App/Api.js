
// internal dependencies
import Config from './Config'
import Logger from './Logger'
import Common from './Common'
import ConsentUser from './Models/ConsentUser'
import ConsentConnectionRequest from './Models/ConsentConnectionRequest'
import ConsentShareLog from './Models/ConsentShareLog'
import {request, rejectionWithError} from './Requests'

function checkParameters(requiredKeys, receivedObject) {
  if (typeof receivedObject !== 'object') {
    throw new Error(
      `Expected 'object', received '${typeof receivedObject}'`
    )
  }
  
  var missing = false
  var missing_key
  requiredKeys.forEach(key => {
    if (!(key in receivedObject && receivedObject[key])) {
      missing_key = key
      missing = true
    }
  })

  if (missing) throw new Error(missing_key + ' cannot be falsy')
}

export default class Api {

  /*
   * Register a user
   * 0 POST /management/user
   */
  static register(data) {
    checkParameters([
      'email',
      'nickname',
      'device_id',
      'device_platform',
      'public_key_algorithm',
      'public_key',
      'plaintext_proof',
      'signed_proof'
    ], data)
    return request('/management/register', {
      body: JSON.stringify(data),
      method: 'POST'
    }, false)
  }

  /*
   * Report device info
   * 1 POST /management/device
   */
  static device(data) {
    checkParameters([
      'device_id',
      'device_platform'
    ], data)
    return request('/management/device', {
      body: JSON.stringify(data),
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-cnsnt-id': data.user_id,
        'x-cnsnt-plain': data.plain,
        'x-cnsnt-signed': data.signature
      }
    })
  }

  // #########################
  // ###### CONNECTIONS ######
  // #########################

  static getMyConnections(milliseconds = 300000, skipCache = false){

    if(!skipCache){
      let cached = ConsentUser.getCached("myConnections")

      if (cached) {
        console.log("SERVED CACHED CONNECTIONS")
        return Promise.resolve(cached)
      }
    }
    
    return Promise.all([
      this.allConnections(),
      this.getActiveBots(),
      ConsentConnectionRequest.all(),
      //new - get them cached upfront 
      this.initializeResourcesAndTypes()
    ]).then(values => {
      return Promise.all([
        this.getConnectionProfiles(values[0].body.enabled, "other_user_did"),
        this.getConnectionProfiles(values[0].body.unacked, "from_did"),
        this.getConnectionProfiles(values[1].body, "did"),
        values[1].body,
        values[0].body.enabled,
        values[0].body.unacked,
      ])
    }).then(results => {
      
      const enabledConnections = results[0].map(connection => connection.body.user)
      const enabledPeerConnections = enabledConnections.filter(connection => connection.is_human)
                                                        .map(connection => { 
                                                          const original = results[4].find(obj => obj.other_user_did === connection.did)
                                                          let uri = connection.image_uri
                                                          uri = Common.ensureDataUrlHasContext(uri)
                                                          return Object.assign({},
                                                                              connection, 
                                                                              { 
                                                                                isa_id: original.sharing_isa_id, 
                                                                                user_connection_id: original.user_connection_id, 
                                                                                image_uri: uri
                                                                              })
                                                        })

      const enabledBotConnections = enabledConnections.filter(connection => !connection.is_human)

      const pendingPeerConnections = results[1].map(connection => connection.body.user)
                                                .filter(connection => connection.is_human)
                                                .map(connection => { 
                                                  const original = results[5].find(obj => obj.from_did === connection.did)
                                                  return Object.assign({}, connection, { user_connection_request_id: original.user_connection_request_id })
                                                })
                                                .map(connection => {
                                                  let uri = connection.image_uri
                                                  uri = Common.ensureDataUrlHasContext(uri)
                                                  return Object.assign({}, connection, {image_uri: uri})
                                                })

      const pendingBotConnections = results[1].map(x => x.body.user)
                                              .filter(x => !x.is_human)
                                              .filter(x => !enabledConnections.some(y => x.did === y.did))
      
      
      


      const myConnections = {
        "peerConnections": enabledPeerConnections,
        "botConnections": enabledBotConnections,
        "pendingPeerConnections": pendingPeerConnections,
        "pendingBotConnections": pendingBotConnections,
        "activeBots": results[3]
      }

      ConsentUser.cacheMyConnection(myConnections)

      return myConnections
      // return ConsentUser.getCached("myConnections")

    })
  }

  static getConnectionProfiles(connections, propertyName){

    return Promise.all(
      connections.map(connection => {
        return this.profile({did: connection[propertyName]})
      })
    )

  }

  // Get all unacked and enabled connections
  static allConnections() {
    return request('/management/connection')
  }

  /*
   * Make a connection request with a target
   * 2 POST /management/connection
   */
  static requestConnection(data, fingerprint = false) {
    checkParameters(['target'], data)
    return request('/management/connection', {
      body: JSON.stringify({target: data.target}),
      method: 'POST'
    }, true, fingerprint)
  }

  // Accept a connection request
  static respondConnectionRequest(data, fingerprint = false) {
    checkParameters([
      'user_connection_request_id',
      'accepted' // true/false (in body)
    ], data)
    return request(`/management/connection/${data.user_connection_request_id}`, {
      body: JSON.stringify({ accepted: data.accepted === "yes" ? true : false }),
      method: 'POST'
    }, true, fingerprint)
  }
  
  // Delete a connection /management/connection/:user_connection_id
  static deleteConnection(data, fingerprint = false) {
    checkParameters([
      'user_connection_id'
    ], data)
    return request(`/management/connection/${data.user_connection_id}`, {
      method: 'DELETE'
    }, true, fingerprint)
  }

  // #########################
  // ########## ISA ##########
  // #########################

  // Request an ISA
  static requestISA(data, fingerprint = false) {
    checkParameters([
      'to',
      // 'requested_schemas',
      'required_entities',
      'purpose',
      'license'
    ], data)

    console.log("typecheck to: ", data.to, " | license: ", data.license, " | purpose: ", data.purpose)
    console.log('typecheck required_entities', Array.isArray(data.required_entities) && data.required_entities.length)

    return request('/management/isa', {
      body: JSON.stringify(data),
      method: 'POST'
    }, true, fingerprint)
  }

  // Respond to an ISA request
  static respondISA(data, fingerprint = false) {
    checkParameters([
      'isa_id',
      'accepted',
      'permitted_resources'
    ], data)
    return request(`/management/isa/${data.isa_id}`, {
      method: 'POST',
      body: JSON.stringify({
        accepted: data.accepted,
        permitted_resources: data.permitted_resources
      })
    }, true, fingerprint)
  }

  // Get all ISAs
  static allISAs() {
    return request('/management/isa')
  }

  // Get an ISA by id
  static getISA(data) {
    checkParameters(['id'], data)
    return request(`/management/isa/${data.id}`)
  }

  // Delete an ISA
  static deleteISA(data, fingerprint = false) {
    checkParameters(['isa_id'], data)
    return request(`/management/isa/${data.isa_id}`, {method: 'DELETE'}, true, fingerprint)
  }

  // Demo QR code
  static qrCode(data) {
    checkParameters(['user_did'], data)
    return request(`/qr/${data.user_did}`)
  }

  // Update an ISA by id
  static updateISA(data, fingerprint = false) {
    checkParameters([
      'isa_id',
      'permitted_resources'
    ], data)
    return request(`/management/isa/${data.isa_id}`, {
      method: 'PUT',
      body: JSON.stringify(data.permitted_resources)
    }, true, fingerprint)
  }

  // Pull an ISA
  static pullISA(data) {
    checkParameters(['isa_id'], data)
    return request(`/management/pull/${data.isa_id}`)
  }

  // Pull an ISA
  static pushISA(data, fingerprint = false) {
    checkParameters([
      'isa_id',
      'resources'
    ], data)

    return request(`/management/push/${data.isa_id}`, {
      method: 'POST',
      body: JSON.stringify({resources: data.resources})
    }, true, fingerprint).then(result => {

      console.log("DATA: ", data)

      data.resources.forEach(resourceId => {
        ConsentShareLog.add(resourceId, data.shared_with_did)
      })
      
    })
  }

  // ##################
  // #### RESOURCE ####
  // ##################

  static initializeResourcesAndTypes(milliseconds = 300000){
    return Promise.all([
      this.allResourceTypes(),
      this.allResources(),
      this.myProfile()
    ]).then(values => {
      
      // console.log("INITIAILIZE VALUES: ", values)

      const resourcesAndTypes = {
        resourceTypes: values[0],
        resources: values[1],
        profile: values[2]
      }
      
      // console.log("RESOURCES AND TYPES: ", resourcesAndTypes )

      return Promise.resolve(resourcesAndTypes)

    })
  }

  static allResourceTypes(milliseconds = 300000) {
    let cached = ConsentUser.getCached("allResourceTypes")
    if (cached !== null) return Promise.resolve(cached)
    return request("http://schema.cnsnt.io/resources").then(data => {
      ConsentUser.setCached("allResourceTypes", data.resources, milliseconds)
      return Promise.resolve(data.resources)
    }) 
  }

  // 0 GET /resource
  static allResources(milliseconds = 300000) {
    // return request("/resource?all=1")
    // let cached = ConsentUser.getCached("allResources")
    // if (cached !== null) return Promise.resolve(cached)

    return request("/resource?all=1").then(data => {
      
      // const updatedResources = data.body.map(resource => {
      //   return {
      //     id: resource.id,
      //     alias: resource.alias,
      //     schema: resource.schema, 
      //     is_verifiable_claim: resource.is_verifiable_claim,
      //     from_user_did: resource.from_user_did,
      //     ...JSON.parse(resource.value)
      //   }
      // })
      const updatedResources = data.body.map(resource => this.shapeResource(resource))
      ConsentUser.setCached("allResources", updatedResources, 300000)
      return Promise.resolve(updatedResources)

    }) 
  }

  static shapeResource(resource){
    return {
      id: resource.id,
      alias: resource.alias,
      schema: resource.schema, 
      is_verifiable_claim: resource.is_verifiable_claim,
      from_user_did: resource.from_user_did,
      ...JSON.parse(resource.value)
    }
  }

  static getMyData(milliseconds = 300000){
    let cached = ConsentUser.getCached("myData")
    if (cached && cached.valid) {
      console.log("MY DATA SERVED CACHED")
      return Promise.resolve(cached)
    }
    // return Promise.all([
    //   // this.allResourceTypes(),
    //   // this.allResources()
    // ]).then(values => {
    return this.initializeResourcesAndTypes().then(values => {
    
      console.log("MY DATA NOT CACHE: ")
      // const updatedResources = values[1]
      const updatedResources = values.resources

      ConsentUser.setCached("allResources", updatedResources, 300000)
      ConsentUser.cacheMyData(updatedResources, values.profile)
      return ConsentUser.getCached("myData")

      // const updatedResources = values[1].body.map(resource => {
      //   return {
      //     id: resource.id,
      //     alias: resource.alias,
      //     schema: resource.schema, 
      //     is_verifiable_claim: resource.is_verifiable_claim,
      //     from_user_did: resource.from_user_did,
      //     ...JSON.parse(resource.value)
      //   }
      // })
      // ConsentUser.setCached("allResources", updatedResources, 300000)
      // ConsentUser.cacheMyData(updatedResources)
      // return ConsentUser.getCached("myData")
    })
  }

  static getFlattenedResources(){
    
    return this.getMyData().then(data => {

      let arrayOfResourceArrays = data.resourcesByType.map(rt => rt.items)
      let flattenedResources = ConsentUser.flattenCachedResources(arrayOfResourceArrays)
      return flattenedResources

    }).catch(Logger.error)
  }

  static getResourceForm(form, milliseconds = 600000) {
    form = Common.ensureUrlHasProtocol(form)
    const formComponents = form.split('/')
    const formName = formComponents[formComponents.length - 1]
    let cached = ConsentUser.getCached(formName)
    if (cached !== null) return Promise.resolve(cached)
    return request(form).then(data => {
      ConsentUser.setCached(formName, data, milliseconds)
      return data
    })
  }

  static connectionResources(connectionDid) {
    
    return request(`/resource?pushed=1&pushed_by=${connectionDid}`)
    .then(results => {

      // console.log("SHALLOW RESULTS: ", results)

      return results
    })
  }

  static connectionSharedWith(connectionDid) {
    
    return ConsentShareLog.all_by_user(connectionDid)
                          .then(results => {

                            console.log("SHARED WITH RESULTS: ", results)

                            return results
                          })
  }

  // 1 GET /resource/:resource_id
  static getResource(data) {
    checkParameters(['id'], data)
    let cached = ConsentUser.getCached("myData")
    let resource
    if (cached) {
      const containerResourceType = cached.resourcesByType.find(rt => rt.items.some((item) => item.id === data.id))
      if (containerResourceType) {
        resource = containerResourceType.items.find(item => item.id === data.id)
      }
    }
    if (cached && resource) return Promise.resolve(resource)
    return request(`/resource/${data.id}`)
  }

  static getCachedResourceByName(data) {
    checkParameters(['name'], data)
    // Try fetch from cache first 
    let cached = ConsentUser.getCached("myData")
    console.log("RESOURCE TYPES: ", cached.resourcesByType)
    let resource

    if (cached) {

      const containerResourceType = cached.resourcesByType.find(rt => rt.name === data.name)
      if(containerResourceType){
        resource = containerResourceType.items[0]
      }
    }

    if(cached && resource){
      return Promise.resolve(resource)
    }
    else{
      return Promise.reject()
    }
  }

  // 2 POST /resource
  static createResource(data) {
    checkParameters([
      'entity',
      'attribute',
      'alias',
      'value',
      'schema'
    ], data)
    return request('/resource', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  // 3 PUT /resource/:resource_id
  static updateResource(data) {
    return request(`/resource/${data.id}`,{
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  // 4 DELETE /resource/:resource_id
  static deleteResource(data) {
    checkParameters(['id'], data)
    return request(`/resource/${data.id}`, {method: 'DELETE'})
  }

  // 5 GET /profile/:did
  static profile(data) {
    checkParameters(['did'], data)
    return request(`/profile/${data.did}`, {method: 'GET'}, false)
  }

  // 12 GET /profile
  static myProfile(milliseconds = 600000) {

    // Try fetch from cache first 
    let cached = ConsentUser.getCached("profile")

    if(cached){
      console.log('SERVED cached profile')
      // console.log("CACHED:::: ", cached)
      return Promise.resolve(cached)
    }
    
    // else
    return request('/profile', { method: 'GET' }, true).then(data => {
      const profile = data.body
      ConsentUser.updateProfile(profile)
      return profile
    }) 
  }

  // 5.5 POST /profile/:did
  static setProfile(data) {
    return request('/profile', {
      method: 'POST',
      body: JSON.stringify(data)
    }, true)
  }

  // 6 PUT /profile/colour
  static profileColour(data) {
    checkParameters(['colour'], data)
    return request('/profile/colour', {method: 'PUT'})
  }

  // 7 PUT /profile/image
  static profileImage(data) {
    checkParameters(['image_uri'], data)
    return request('profile/image', {method: 'PUT'})
  }

  // 8 PUT /profile/name
  static profileName(data) {
    checkParameters(['name'], data)
    return request('profile/name', {method: 'PUT'})
  }

  // 9 PUT /profile/email
  static profileEmail(data) {
    checkParameters(['email'], data)
    return request('profile/email', {method: 'PUT'})
  }

  // 10 PUT /profile/tel
  static profileTel(data) {
    checkParameters(['tel'], data)
    return request('profile/tel', {method: 'PUT'})
  }

  // 11 PUT /profile/address
  static profileAddress(data) {
    checkParameters(['address'], data)
    return request('profile/address', {method: 'PUT'})
  }

  // #########################
  // #### TRUSTBANK LOGIN ####
  // #########################

  static trustBankLogin(data){
    checkParameters([
      'created_by',
      'challenge'
    ], data)
    return request(`/web-auth`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }




  // 14 POST /facial-verfication token
  // Get a Face pic after scanning a QR code
  static facialVerificationQrScanResponse(user_did, token) {
    // TODO try and make this request authenticated
    return request(`/facial-verification/${user_did}/${token}`, {method: 'GET'}, false)
  }

  // 15 POST /facial-verfication
  // User result on QR code verification
  static facialVerificationResult(user_did, token, result, fingerprint = false) {
    return request(`/facial-verification/${user_did}/${token}`, {
      method: 'POST',
      body: JSON.stringify({result: result})
    }, true, fingerprint)
  }

  // 16 GET /management/thanks/balance
  static thanksBalance() {
    return request('/management/thanks/balance')
  }

  // 17 POST /management/isa/:user_did/:action_name
  /**
   * @param {*} with_user_did the did of the user with whom you want to establish an ISA
   * @param {*} action_name the name of the action stored by the user with whom you want to establish an ISA
   * @param {*} permitted_resources either an array of objects with integer id properties or an array of integer id values
   */
  static establishISA(with_user_did, action_name, permitted_resources, fingerprint = false) {
    if (Array.isArray(permitted_resources)) {
      if (permitted_resources[0].id) {
        permitted_resources = permitted_resources.map(pr => pr.id)
      }
    }
    return request(`/management/isa/${with_user_did}/${action_name}`, {
      method: 'POST',
      body: JSON.stringify({
        entities: permitted_resources
      }, true, fingerprint)
    })
  }

  // ##################
  // ##### DEBUG ######
  // ##################

  // Delete a user
  static unregister(data) {
    if (Config.DEBUG) {
      if (!data.id && !data.email) {
        return Promise.reject(`ID or email must be specified. id: ${data.id}, email: ${data.email}`)
      }
      const route = data.id ? (
        `/debug/unregister/?user_id=${data.id}`
      ) : (
        `/debug/unregister/?email=${data.email}`
      )
      return request(route, {method: 'GET'}, false)
    } else {
      // fail silenty
    }
  }

  static getActiveBots() {
    return request('/directory')
  }
}
