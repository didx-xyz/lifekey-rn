/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */
/* global test, describe */
import React from "react"
import Storage from '../Storage'
import MockStorage from "./App/Components/MockStorage";

jest.mock("react-native-camera")

const cache = {}
const AsyncStorage = new MockStorage(cache)

jest.setMock("AsyncStorage", AsyncStorage)

function getTestData() {
  return {
    isATest: true,
    hasNestedData: {
      ohYeah: 'it\s true',
    }
  }
}

function multiGetTestData() {
  return [
    ['key1', JSON.stringify({ valor: 1 })],
    ['key2', JSON.stringify({ valor: 2 })],
  ]
}

function multiSaveTestData() {
  return [
    ['key1', { valor: 1 }],
    ['key2', { valor: 2 }],
  ]
}

//jest.dontMock("react-native")

jest.mock('react-native', () => ({
  AsyncStorage: {
    setItem: jest.fn(() => {
      return new Promise((resolve, reject) => {
        resolve(null);
      });
    }),
    mergeItem: jest.fn(() => {
      return new Promise((resolve, reject) => {
        resolve(null);
      });
    }),
    multiSet:  jest.fn(() => {
      return new Promise((resolve, reject) => {
        resolve(null);
      });
    }),
    getItem: jest.fn(() => {
      return new Promise((resolve, reject) => {
        resolve(JSON.stringify(getTestData()));
      });
    }),
    multiGet: jest.fn(() => {
      return new Promise((resolve, reject) => {
        resolve(multiGetTestData());
      });
    }),
    removeItem: jest.fn(() => {
      return new Promise((resolve, reject) => {
        resolve(null);
      });
    }),
    getAllKeys: jest.fn(() => {
      return new Promise((resolve) => {
        resolve(['one', 'two', 'three']);
      });
    })
  }
}))

describe('store', () => {
  it('can store', () => {
    //console.log(require('react-native').AsyncStorage)
    const { AsyncStorage } = require('react-native')
    //AsyncStorage.monk()
    const key = 'the key'
    const value = { key1: 1, key2: 2, key3: 3 }

    return MockStorage.store(key, value)
    .then(error => {
      expect(error).toEqual(true)
      expect(AsyncStorage.mergeItem).toBeCalledWith(key, value)
    })
  })
})
