const storage = {}

storage.get = function get(key) {
  return new Promise((resolve, reject) => {
    let multi = false
    if (Array.isArray(key)) {
      multi = true
    } else {
      key = [key]
    }
    chrome.storage.sync.get(key, function(result) {
      console.log('Value currently is ' + result)
      if (multi) {
        resolve(result)
      } else {
        resolve(result[key])
      }
    })
  })
}

storage.set = function set(data) {
  return new Promise((resolve, reject) => {
    let len = Object.keys(data).length
    if (len <= 0) {
      reject('needs available data')
    }
    chrome.storage.sync.set(data, function() {
      console.log('Value is set to ' + data)
      resolve(data)
    })
  })
}

storage.remove = function remove(key) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(key)) {
      key = [key]
    }
    chrome.storage.sync.remove(key, function() {
      resolve(key)
    })
  })
}

export default storage
