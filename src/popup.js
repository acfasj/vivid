import Vue from 'vue'
import Popup from './popup.vue'

new Vue({
  render: h => h(Popup)
}).$mount('#app')

console.log('popup也更新啊')
