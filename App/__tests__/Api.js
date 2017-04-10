/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <sphe@io.co.za>
 */
/* global test, describe */

import Api from '../Api'
import 'isomorphic-fetch';
import MockStorage from "../../App/Components/MockStorage";

jest.mock("react-native-camera")

const cache = {}
const AsyncStorage = new MockStorage(cache)

jest.setMock("AsyncStorage", AsyncStorage)

// describe('request', () => {
//   it('fetch correctly', async () => {
//     const response = "{"error":false,"status":200,"message":"sorry, theres nothing to see here...","body":null}";
//     //const response = await fetch('http://staging.api.lifekey.cnsnt.io')
//     const data = await response.text();
//
//     expect(data).not.toBe(null);
//   });
// });
describe('#profile()', () => {
  it('GET/profile/${data.id} Fetch a profile', async () => {
    const response = "{User not registered. Cannot send a signed request}";
    const data = await Api.profile({id: 1})
    expect(data.length).toBe(2);
    expect(data).toBeDefined();
    expect(data).not.toBe(null);
  });

});

describe('#register()', () => {
  it('Register a user', async () => {
    const response = "{ }";
    const data = await Api.register({email:"sphe@io.co.za",
                                     nickname: "sphe",
                                     device_id:'PI',
                                     device_platform:"Android",
                                     public_key_algorithm:"addsfgggggg",
                                     public_key:"23444",
                                     plaintext_proof:"fgfg",
                                     signed_proof:"ggf"});
    expect(data).toBeDefined()
    expect(data).not.toBe(null);
  });

});

describe('#device()', () => {
  it('1 POST /management/device', async () => {
    const response = '{Failed: User not registered. Cannot send a signed request}';
    const data = await Api.device({device_id:2,
                                  device_platform:"ios"})
    expect(data).toBeDefined()
    expect(data).not.toBe(null);
  });

});


describe('#requestConnection()', () => {
  it('Make a connection request with a target user_connection_request_id', async () => {
    const response = "{ }";
    const data = await Api.requestConnection({target:'eewrr'})
    expect(data).toBeDefined()
    expect(data).not.toBe(null);
  });

});
describe('#allConnections()', () => {
  it('GET /management/connection, Get all unacked and enabled connections', async () => {
    const response = "{ }";
    const data = await Api.allConnections()
    expect(data).toBeDefined()
    expect(data).not.toBe(null);
  });

});

describe('#respondConnectionRequest()', () =>{
  it('POST /management/connection/:user_connection_request_id', async () => {
    const response = "{ }";
    const data = await Api.respondConnectionRequest({user_connection_request_id:1, accepted:'weee'})
    expect(data).toBeDefined()
    expect(data).not.toBe(null);

  });
});

describe('#deleteConnection()', () =>{
  it('Delete a connection /management/connection/:user_connection_id', async () => {
    const response = "{ }";
    const data = await Api.deleteConnection({user_connection_id:1})
    expect(data).toBeDefined()
    expect(data).not.toBe(null);

  });
});
describe('#activate()', () =>{
  it('GET/management/activation/${data.activation_code}', async () => {
    const response = "{ }";
    const data = await Api.activate({activation_code:1234455})
    expect(data).toBeDefined()
    expect(data).not.toBe(null);

  });
})
describe('#requestISA()', () =>{
  it('POST /management/isa', async () => {
    const response = "{ }";
    const data = await Api.requestISA({to:'assd',
                                       requested_schemas:"wwee",
                                       purpose:"weee",
                                       license:"gggg"})
    expect(data).toBeDefined()
    expect(data).not.toBe(null);

  });
})
describe('#respondISA()', () =>{
  it('POST /management/isa/${data.isar_id} , Respond to an ISA request', async () => {
    const response = "{User not registered. Cannot send a signed request }";
    const data = await Api.respondISA({accepted:1,permitted_resources:'qwerrr'})
    expect(data).toBeDefined()
    expect(data).not.toBe(null);

  });
})


describe('#allISAs()', () =>{
  it('GET/management/isa , Get all ISAs', async () => {
    const response = "{User not registered. Cannot send a signed request }";
    const data = await Api.allISAs()
    expect(data).toBeDefined()
    expect(data).not.toBe(null);

  });
})
describe('#getISA', () =>{
  it('Get an ISA by id', async () => {
    const response = "{}";
    const data = await Api.getISA({id:2})
    expect(data).toBeDefined()
    expect(data).not.toBe(null);

  });
})

describe('#deleteISA', () =>{
  it('Delete an ISA', async () => {
    const response = "{}";
    const data = await Api.deleteISA({isa_id:2})
    expect(data).toBeDefined()
    expect(data).not.toBe(null);

  });
})
describe('#qrCode', () =>{
  it('Demo QR code', async () => {
    const response = "{}";
    const data = await Api.qrCode({user_id:2})
    expect(data).toBeDefined()
    expect(data).not.toBe(null);

  });
})

describe('#updateISA', () =>{
  it('Update an ISA by id', async () => {
    const response = "{}";
    const data = await Api.updateISA({isa_id:2, permitted_resources:"weerr"})
    expect(data).toBeDefined()
    expect(data).not.toBe(null);

  });
})
describe('#pullISA()', () =>{
  it('Pull an ISA', async () => {
    const response = "{}";
    const data = await Api.pullISA({isa_id:1})
    expect(data).toBeDefined()
    expect(data).not.toBe(null);

  });
})
describe('#pushISA()', () =>{
  it('Push an ISA', async () => {
    const response = "{}";
    const data = await Api.pushISA({isa_id:2, resources:'jfjffjfj'})
    expect(data).toBeDefined()
    expect(data).not.toBe(null);

  });
})
describe('#unregister()', () =>{
  it('Delete a user', async () => {
    const response = "{}";
    const data = await Api.unregister({id:1, email:'sphe@io.co.za'})
    expect(data).toBeDefined()
    expect(data).not.toBe(null);

  });
})
