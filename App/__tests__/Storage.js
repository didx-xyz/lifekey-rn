/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Siphesande Malgas <sphe@io.co.za>
 */
/* global test, describe */
import React from "react"
import Storage from '../Storage'
import MockStorage from "../../App/Components/MockStorage"


const cache = {}
const AsyncStorage = new MockStorage(cache)

jest.setMock("AsyncStorage", AsyncStorage)


describe('store', () => {
  it('can store', () => {
    const { AsyncStorage } = require('react-native');
     const key = 'the key';
     const value = { key1: 1, key2: 2, key3: 3 };
    return Storage.store(key, value).then((keys) => {

      expect(AsyncStorage.mergeItem).toBeCalledWith(key, JSON.stringify(value))
      expect(keys).toBeDefined()

    })
  });
});


  describe('keys', () => {
  	it('should return the keys', () => {
  		const { AsyncStorage } = require('react-native');
      const key = 'the key'
  		return Storage.load(key).then((keys) => {
  			expect(keys).toEqual({"key1": 1, "key2": 2, "key3": 3});
  			expect(AsyncStorage.getItem).toBeCalled();

  		})
  	});
  });
