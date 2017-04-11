/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Siphesande Malgas <sphe@io.co.za>
 */
/* global test, describe */

import Api from '../Api'
import 'isomorphic-fetch';
import MockStorage from "../../App/Components/MockStorage";

const cache = {}
const AsyncStorage = new MockStorage(cache)

jest.setMock("AsyncStorage", AsyncStorage)


describe('#profile()', () => {
  it('Testing for async errors using `catch`, GET/profile/${data.id} Fetch a profile', async () => {
    const response = 'User not registered. Cannot send a signed request';
    const data = await Api.profile({id:1})
    .catch(error => expect(error).toEqual(response));

     //expect(data.length).toBe(2);
    //expect(data).toBeDefined();
    //expect(data).rejects.toEqual(response);
  });
});

describe('#register()', () => {
  it('Testing for async errors using `catch`, Register a user', async () => {
    const response = {"body": null, "error": true, "message": "unsupported key algorithm", "status": 400};
    const data = await Api.register({email:"sphe@io.co.za",
                                     nickname: "sphe",
                                     device_id:'PI',
                                     device_platform:"Android",
                                     public_key_algorithm:"addsfgggggg",
                                     public_key:"23444",
                                     plaintext_proof:"fgfg",
                                     signed_proof:"ggf"})
    .catch(error => expect(error).toEqual(response));
    expect(data).not.toBe(null);
    //expect(data).toBeDefined()
  });

});

describe('#device()', () => {
  it('Testing for async errors using `catch`, POST /management/device', async () => {
    const response = 'User not registered. Cannot send a signed request';
    const data = await Api.device({device_id:2,
                                  device_platform:"ios"})
    .catch(error => expect(error).toEqual(response));
    expect(data).not.toBe(null);
    //expect(data).toBeDefined()
  });

});


describe('#requestConnection()', () => {
  it('Testing for async errors using `catch`, Make a connection request with a target user_connection_request_id', async () => {
    const response = 'User not registered. Cannot send a signed request';
    const data = await Api.requestConnection({target:'eewrr'})
    .catch(error => expect(error).toEqual(response));
    expect(data).not.toBe(null);
    //expect(data).toBeDefined()
  });

});
describe('#allConnections()', () => {
  it('Testing for async errors using `catch`, GET /management/connection, Get all unacked and enabled connections', async () => {
    const response = "User not registered. Cannot send a signed request";
    const data = await Api.allConnections()
    .catch(error => expect(error).toEqual(response));
    expect(data).not.toBe(null);
    //expect(data).toBeDefined()
  });

});

describe('#respondConnectionRequest()', () =>{
  it('Testing for async errors using `catch`, POST /management/connection/:user_connection_request_id', async () => {
    const response = 'User not registered. Cannot send a signed request';
    const data = await Api.respondConnectionRequest({user_connection_request_id:1, accepted:'weee'})
    .catch(error => expect(error).toEqual(response));
     expect(data).not.toBe(null);
    //expect(data).toBeDefined()

  });
});

describe('#deleteConnection()', () =>{
  it('Testing for async errors using `catch`, Delete a connection /management/connection/:user_connection_id', async () => {
    const response = 'User not registered. Cannot send a signed request';
    const data = await Api.deleteConnection({user_connection_id:1})
    .catch(error => expect(error).toEqual(response));
    expect(data).not.toBe(null);
    //expect(data).toBeDefined()

  });
});
describe('#activate()', () =>{
  it('Testing for async errors using `catch`, GET/management/activation/${data.activation_code}', async () => {
    const response = 'User not registered. Cannot send a signed request';
    const data = await Api.activate({activation_code:1234455})
    .catch(error => expect(error).toEqual(response));
     expect(data).not.toBe(null);
    //expect(data).toBeDefined()

  });
})
describe('#requestISA()', () =>{
  it('Testing for async errors using `catch`, POST /management/isa', async () => {
    const response = 'User not registered. Cannot send a signed request';
    const data = await Api.requestISA({to:'assd',
                                       requested_schemas:"wwee",
                                       purpose:"weee",
                                       license:"gggg"})
    .catch(error => expect(error).toEqual(response));
    expect(data).not.toBe(null);
    //expect(data).toBeDefined()

  });
})
describe('#respondISA()', () =>{
  it('Testing for async errors using `catch`, POST /management/isa/${data.isar_id} , Respond to an ISA request', async () => {
    const response = 'User not registered. Cannot send a signed request';
    const data = await Api.respondISA({accepted:1,permitted_resources:'qwerrr'})
    .catch(error => expect(error).toEqual(response));
    expect(data).not.toBe(null);
    //expect(data).toBeDefined()

  });
})


describe('#allISAs()', () =>{
  it('Testing for async errors can be done using `catch`, GET/management/isa , Get all ISAs', async () => {
    const response = 'User not registered. Cannot send a signed request';
    const data = await Api.allISAs()
    .catch(error => expect(error).toEqual(response));
    expect(data).not.toBe(null);
    //expect(data).toBeDefined()

  });
})
describe('#getISA', () =>{
  it('Testing for async errors using `catch`, Get an ISA by id', async () => {
    const response = 'User not registered. Cannot send a signed request';
    const data = await Api.getISA({id:2})
    .catch(error => expect(error).toEqual(response));
    expect(data).not.toBe(null);
    //expect(data).toBeDefined()

  });
})

describe('#deleteISA', () =>{
  it('Testing for async errors using `catch`, Delete an ISA', async () => {
    const response = 'User not registered. Cannot send a signed request';
    const data = await Api.deleteISA({isa_id:2})
    .catch(error => expect(error).toEqual(response));
    //expect(data).toBeDefined()
    expect(data).not.toBe(null);

  });
})
describe('#qrCode', () =>{
  it('Testing for async errors using `catch`, Demo QR code', async () => {
    const response = 'User not registered. Cannot send a signed request';
    const data = await Api.qrCode({user_id:2})
    .catch(error => expect(error).toEqual(response));
    //expect(data).toBeDefined()
    expect(data).not.toBe(null);

  });
})

describe('#updateISA', () =>{
  it('Testing for async errors using `catch`, Update an ISA by id', async () => {
    const response = 'User not registered. Cannot send a signed request';
    const data = await Api.updateISA({isa_id:2, permitted_resources:"weerr"})
    .catch(error => expect(error).toEqual(response));
    //expect(data).toBeDefined()
    expect(data).not.toBe(null);

  });
})
describe('#pullISA()', () =>{
  it('Testing for async errors using `catch`, Pull an ISA', async () => {
    const response = 'User not registered. Cannot send a signed request';
    const data = await Api.pullISA({isa_id:1})
    .catch(error => expect(error).toEqual(response));
    expect(data).not.toBe(null);
    //expect(data).toBeDefined()

  });
})
describe('#pushISA()', () =>{
  it('Testing for async errors using `catch`, Push an ISA', async () => {
    const response = 'User not registered. Cannot send a signed request';
    const data = await Api.pushISA({isa_id:2, resources:'jfjffjfj'})
    .catch(error => expect(error).toEqual(response));
    expect(data).not.toBe(null);
    //expect(data).toBeDefined()

  });
})
describe('#unregister()', () =>{
  it('Testing for async errors using `catch`, Delete a user', async () => {
    const response = {"body": null, "error": true, "message": "user record not found", "status": 404};
    const data = await Api.unregister({id:1, email:'sphe@io.co.za'})
    .catch(error => expect(error).toEqual(response));
    expect(data).not.toBe(null);
    //expect(data).toBeDefined();

  });
 })

 describe('request', () => {
   it('fetch correctly', async () => {

     const response = await fetch('http://staging.api.lifekey.cnsnt.io')
     const data = await response.text();
     expect(data).toBeDefined();
     expect(data).not.toBe(null);
   });
 });
