/**
 * Lifekey App
 * @copyright 2016 Global Consent Ltd
 * Civvals, 50 Seymour Street, London, England, W1H 7JG
 * @author Werner Roets <werner@io.co.za>
 */
/* global test, describe */
import Storage from '../Storage'

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
    const { AsyncStorage } = require('react-native')
    const key = 'the key'
    const value = { key1: 1, key2: 2, key3: 3 }

    return Storage.store(key, value)
    .then(error => {
      expect(error).toEqual(true)
      expect(AsyncStorage.mergeItem).toBeCalledWith(key, value)
    })
  })
})
