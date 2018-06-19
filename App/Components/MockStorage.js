class MockStorage {
  constructor(cache = {}) {
    this.cache = cache
  }

  setItem = jest.fn((key, value) => {
    return new Promise((resolve, reject) => {
      if (typeof key !== "string" || typeof value !== "string") {
        return reject(new Error("key and value must be string"))
      }

      return resolve(this.cache[key] = value)
    })
  })

  getItem = jest.fn((key) => {
    return new Promise((resolve) => {
      if (this.cache.hasOwnProperty(key)) {
        return resolve(this.cache[key])
      }

      return resolve(null)
    })
  })

  mergeItem = jest.fn((key, value) => {
    return new Promise((resolve, reject) => {
      if (typeof key !== "string" || typeof value !== "string") {
        return reject(new Error("key and value must be string"))
      }

      return resolve(this.cache[key] = value)
    })
  })

  removeItem = jest.fn((key) => {
    return new Promise((resolve, reject) => {
      if (this.cache.hasOwnProperty(key)) {
        return resolve(delete this.cache[key])
      }

      return reject("No such key!")
    })
  })

  clear = jest.fn((key) => {
    return new Promise((resolve, reject) => {
      resolve(this.cache = {})
    })
  })

  getAllKeys = jest.fn((key) => {
    return new Promise((resolve, reject) => {
      resolve(Object.keys(this.cache))
    })
  })
}

export default MockStorage
