chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({ color: '#3aa757' }, function() {
    console.log('The color is green.')
  })

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [new chrome.declarativeContent.PageStateMatcher()],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ])
  })
})

if (process.env.NODE_ENV === 'development') {
  import('./content.js')
    .then(({ default: contentVm }) => {
      console.log(contentVm)
      console.log('conent变了')
    })
}

// 在这里更新刷新当前激活的 tab, 以便重新载入 content_scripts
if (module.hot) {
  module.hot.accept('./content.js', function() {
    console.log('content更新了')
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (tabs[0]) {
        chrome.tabs.reload(tabs[0].id)
      }
      console.log(tabs)
      // chrome.runtime.reload()
    })
  })
}
