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

// Vue.component('toggle', {
//   template: `
//   <div class="component-toggle">
//     <span class="toggle-label">
//       <slot></slot>
//     </span>
//     <input type="checkbox" v-model="checkboxValue" class="toggle-input">
//     <i class="toggle-ui"></i>
//     <span
//   </div>
//   `,
//   props: {
//     value: {
//       type: Boolean,
//       default: false
//     }
//   },
//   data() {
//     return {
//       checkboxValue: this.value
//     }
//   },
//   watch: {
//     value (newVal) {
//       this.checkboxValue = newVal
//     },
//     checkboxValue(newVal) {
//       this.$emit('input', newVal)
//     }
//   }
// })


new Vue({
  render: h => h(Popup)
}).$mount('#app')

console.log('更新popup')
