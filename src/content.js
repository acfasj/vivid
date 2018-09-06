import Vue from 'vue'
import VContent from './content.vue' // 因为 content 是一个废弃的 html 标签, 不能直接用
import { getDisabeldSites } from './common/helper'

console.log('vivid is working')

let vm = null
let vivid = null

function create() {
  vivid = document.createElement('div')
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

  vm = new Vue({
    el: vividInner,
    components: {
      VContent
    },
    template: '<v-content/>'
  })
}

function destroy() {
  vm && vm.$destroy()
  vivid && document.body.removeChild(vivid)
}

function main() {
  getDisabeldSites
    .then(sites => {
      const host = location.host
      if (sites.indexOf(host) < 0) {
        // 正常使用
        create()
      }
    })
}

main()

