function toQueryString(o) {
  let str = ''
  for (let k in o) {
    const v = o[k] && o[k] !== 0 ? o[k] : ''
    str += `&${k}=${encodeURIComponent(v)}`
  }
  return str.slice(1)
}

function appendQueryString(url, queryObj) {
  const querystr = toQueryString(queryObj)
  url = url.indexOf('?') > -1 ? `${url}&${querystr}` : `${url}?${querystr}`
  return url
}

function debounce(fn, wait = 500) {
  let timer

  return function() {
    const ctx = this
    const args = arguments
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(ctx, args)
    }, wait)
  }
}

function getDisabledSites() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['disabledSites'], res => {
      let ret = []
      if (res.disabledSites && res.disabledSites.length) {
        ret = res.disabledSites
      }
      resolve(ret)
    })
  })
}

async function addDisabledSites(hostArr) {
  if (!Array.isArray(hostArr)) {
    hostArr = [hostArr]
  }
  let disabledSites = await getDisabledSites()
  disabledSites = [...new Set(disabledSites.concat(hostArr))]
  console.log('to be add: ', disabledSites)
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ disabledSites }, () => {
      resolve(disabledSites)
    })
  })
}

async function removeDisabledSites(hostArr) {
  if (!Array.isArray(hostArr)) {
    hostArr = [hostArr]
  }
  let disabledSites = await getDisabledSites()
  disabledSites = disabledSites.filter(host => hostArr.indexOf(host) < 0)
  console.log('after remove: ', disabledSites)
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ disabledSites }, () => {
      resolve(disabledSites)
    })
  })
}

async function isDisabledSite(host) {
  let disabledSites = await getDisabledSites()
  return disabledSites.indexOf(host) >= 0
}

function getHostFromURL(url) {
  const reg = /\/\/([\w\.]+)\/?/
  const matches = reg.exec(url)
  if (matches && matches[1]) {
    return matches[1]
  }
  return ''
}

function getCurrentTab() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs && tabs[0]) {
        return resolve(tabs[0])
      }
      reject(new Error('tabs do not exist'))
    })
  })
}

function send(obj) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(obj, function (res) {
      resolve(res)
    })
  }).then(res => res)
}

export {
  toQueryString,
  appendQueryString,
  debounce,
  getDisabledSites,
  addDisabledSites,
  removeDisabledSites,
  isDisabledSite,
  getHostFromURL,
  getCurrentTab,
  send
}
