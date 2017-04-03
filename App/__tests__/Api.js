/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <sphe@io.co.za>
 */
/* global test, describe */

import Api from '../Api'
import 'isomorphic-fetch';

// describe('request', () => {
//   it('fetch correctly', async () => {
//     const response = "{"error":false,"status":200,"message":"sorry, theres nothing to see here...","body":null}";
//     //const response = await fetch('http://staging.api.lifekey.cnsnt.io')
//     const data = await response.text();
//
//     expect(data).not.toBe(null);
//   });
// });

describe('#doAuthenticatedRequest()', () => {
  it('fetch correctly', async () => {
    const response = "{ }";
    //const response = await fetch('http://staging.api.lifekey.cnsnt.io')
  const data = await Api.doAuthenticatedRequest()
    expect(data).toBeDefined()
    expect(data).not.toBe(null);
  });

});


describe('#register()', () => {
  it('Register a user', async () => {
    const response = "{ }";
    const data = await Api.register()
    expect(data).toBeDefined()
    expect(data).not.toBe(null);
  });

});

describe('#device()', () => {
  it('1 POST /management/device', async () => {
    const response = "{ }";
    const data = await Api.device()
    expect(data).toBeDefined()
    expect(data).not.toBe(null);
  });

});


describe('#requestConnection()', () => {
  it('Make a connection request with a target', async () => {
    const response = "{ }";
    const data = await Api.device()
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
