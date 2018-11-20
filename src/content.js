import Vue from 'vue'
import VContent from './content.vue' // 因为 content 是一个废弃的 html 标签, 不能直接用
import { getDisabledSites } from './common/helper'
import storage from './common/helper/storage'

console.log('vivid is working')

let vm = null
let vivid = null

// 配置
// 配置好像太分散了, 是不是要想点什么办法集中一下
const defaultConfig = {
  shouldUseCtrl: false, // ctrl 键触发
  disabledSites: [], // 禁用网站
  nightMode: false, // 夜间模式
}

async function getConfig() {
  let userConfig = await storage.get(['disabledSites', 'shouldUseCtrl', 'nightMode'])
  return Object.assign({}, defaultConfig, userConfig)
}

function create(options = {}) {
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

  Vue.prototype.config = options

  vm = new Vue({
    render: h => h(VContent)
  }).$mount(vividInner)
}

function destroy() {
  vm && vm.$destroy()
  vivid && document.body.removeChild(vivid)
  vm = null
  vivid = null
}

function refresh(options) {
  destroy()
  create(options)
}

async function main() {
  const config = await getConfig()
  console.log(config, '配置')

  const sites = config.disabledSites
  const host = location.host
  if (sites.length <= 0 || sites.indexOf(host) < 0) {
    // 正常使用
    create(config)
  }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(
    sender.tab
      ? 'from a content script:' + sender.tab.url
      : 'from the extension'
  )
  console.log(request, '请求的数据')
  if (request.disabled === true) {
    destroy()
  } else if (request.disabled === false) {
    refresh(request)
    console.log('刷新了', request)
  }
})

main()
