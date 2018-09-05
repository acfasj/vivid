import Vue from 'vue'
import VividResult from './component/vivid-result.vue'

console.log('vivid is working')

const vivid = document.createElement('div')
const vividInner = document.createElement('div')
vivid.id = '__plugin-vivid'
vivid.onclick = function(e) {
  e.stopPropagation()
}
vivid.onmouseup = function(e) {
  e.stopPropagation()
}
vivid.appendChild(vividInner)
document.body.appendChild(vivid)

const vm = new Vue({
  el: vividInner,
  components: {
    VividResult
  },
  template: '<vivid-result></vivid-result>'
})

console.log('来自content的遥远的问候')

export default vm
