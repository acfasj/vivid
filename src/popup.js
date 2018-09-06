import Vue from 'vue'
import Popup from './popup.vue'

// let changeColor = document.getElementById('changeColor')

// chrome.storage.sync.get('color', function(data) {
//   changeColor.style.backgroundColor = data.color
//   changeColor.setAttribute('value', data.color)
// })

// changeColor.onclick = function(element) {
//   let color = element.target.value
//   chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
//     chrome.tabs.executeScript(tabs[0].id, {
//       code: `document.body.style.backgroundColor="${color}";`
//     })
//   })
// }


new Vue({
  render: h => h(Popup)
}).$mount('#app')

console.log('popup也更新啊')
