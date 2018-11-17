import { appendQueryString } from './common/helper'

chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [new chrome.declarativeContent.PageStateMatcher()],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ])
  })
})

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(
    sender.tab
      ? 'from a content script:' + sender.tab.url
      : 'from the extension'
  )
  console.log(request)

  if (request.word) {
    Promise.all([
      find(request.word),
      getImageList(request.word)
    ]).then(([word, image]) => {
      const data = { word, image }
      sendResponse(data)
    })
    // https://blog.csdn.net/anjingshen/article/details/75579521
    // https://developer.chrome.com/extensions/messaging
    // 异步，必须返回true！
    return true
  }
})

async function find(word) {
  // 金山的 https 证书有问题, 会被版本在 70 及以上的 chrome 拦截请求
  let url = 'http://www.iciba.com/index.php'
  url = appendQueryString(url, {
    a: 'getWordMean',
    c: 'search',
    word,
    list: '1,3,4'
  })
  return fetch(url).then(res => res.json())
}

async function getImageList(word) {
  const url = `https://cn.bing.com/images/async?q=${encodeURIComponent(
    word
  )}&first=0&count=9&relp=35&lostate=r&relo=1&relr=6&rely=1029&mmasync=1&dgState=x*847_y*1029_h*196_c*5_i*36_r*6&IG=34CC46448A3B417C8848845E206B0C6A&SFX=2&iid=images.5871`

  return fetch(url).then(res => res.text())
}
