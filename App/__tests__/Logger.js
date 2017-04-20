/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Siphesande Malgas <sphe@io.co.za>
 */

import 'react-native';

import Api from '../Api'
import 'isomorphic-fetch'
import MockStorage from "../../App/Components/MockStorage"

const cache = {}
const AsyncStorage = new MockStorage(cache)

jest.setMock("AsyncStorage", AsyncStorage)

import Logger from './Logger'


//  describe('#_log()', () => {
//   it('Log a firebase info', async () => {
//     const response = "{ }";
//     const data = await Logger._log()
//     .catch(error => expect(error).toEqual(true));
//
//   });
//
// });
//  describe('#_asColumn()', () => {
//   it('_asColumn', async () => {
//     const response = "{ }";
//     const data = await Logger._asColumn()
//     .catch(error => expect(error).toEqual(true));
//
//   });
//
// });
//
//   describe('#async()', () => {
//    it('Log an AsyncStorage action', async () => {
//      const response = "{ }";
//      const data = await Logger.async()
//      .catch(error => expect(error).toEqual(true));
//
//   });
//
// });
//
//
//   describe('#session()', () => {
//   it('Log an Session action', async () => {
//     const response = "{ }";
//     const data = await Logger.session()
//     .catch(error => expect(error).toEqual(true));
//
//   });
//
// });
//
//  describe('#routeStack()', () => {
//   it('Log an AsyncStorage action', async () => {
//     const response = "{ }";
//     const data = await Logger.routeStack()
//     .catch(error => expect(error).toEqual(true));
//
//   });
//
// });
//
//  describe('#networkRequest()', () => {
//   it('Log a network request', async () => {
//     const response = "{ }";
//     const data = await Logger.networkRequest()
//     .catch(error => expect(error).toEqual(true));
//
//   });
//
// });
//
//   describe('#networkResponse()', () => {
//   it('Log a network response', async () => {
//     const response = "{ }";
//     const data = await Logger.networkResponse()
//     .catch(error => expect(error).toEqual(true));
//
//   });
//
// });
//
//   describe('#error()', () => {
//   it('Log an error', async () => {
//     const response = "{ }";
//     const data = await Logger.error()
//     .catch(error => expect(error).toEqual(true));
//
//   });
//
// });
//   describe('#info()', () => {
//   it('Log an info', async () => {
//     const response = "{ }";
//     const data = await Logger.info()
//     .catch(error => expect(error).toEqual(true));
//
//   });
//
// });
//  describe('#warn()', () => {
//   it('Log a warn', async () => {
//     const response = "{ }";
//     const data = await Logger.warn()
//     .catch(error => expect(error).toEqual(true));
//
//   });
//
// });
//   describe('#firebase()', () => {
//   it('Log a firebase info', async () => {
//     const response = { };
//     const data = await Logger.firebase()
//     .catch(error => expect(error).toEqual(true));
//
//   });
//
// });
//  describe('#react()', () => {
//   it('Log a React lifecycle method', async () => {
//     const response = { };
//     const data = await Logger.react()
//     .catch(error => expect(error).toEqual(true));
//     });
//
// });
