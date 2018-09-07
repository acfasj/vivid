<template>
  <div id="app">
    <div class="row">
      <span class="label">此站点禁用</span>
      <v-toggle v-model="disabled"></v-toggle>
    </div>
  </div>
</template>

<script>
import VToggle from './component/v-toggle.vue'
import {
  getDisabledSites,
  getCurrentTab,
  getHostFromURL,
  addDisabledSites,
  removeDisabledSites,
  isDisabledSite
} from './common/helper'

export default {
  data() {
    return {
      // false, 默认开启; true, 禁用
      disabled: false
    }
  },

  components: {
    VToggle
  },

  async created() {
    console.log('渲染popup 改')
    this.currentTab = await getCurrentTab()
    this.host = getHostFromURL(this.currentTab.url)
    this.disabled = await isDisabledSite(this.host)
  },

  watch: {
    disabled(newVal) {
      let disabled = newVal === true
      if (disabled) {
        return this.disable()
      }
      return this.enable()
    }
  },

  methods: {
    enable() {
      this._send(false)
    },

    disable() {
      this._send(true)
    },

    _send(disabled = true) {
      if (!this.host) {
        return
      }
      if (disabled) {
        addDisabledSites(this.host)
      } else {
        removeDisabledSites(this.host)
      }
      chrome.tabs.sendMessage(this.currentTab.id, { disabled })
    }
  }
}
</script>

<style lang="stylus">
html, body
  width: 150px
  height: 50px
  margin: 0
  padding: 0

#app
  width: 100%
  height: 100%
  box-sizing: border-box
  display: flex
  justify-content: center
  align-items: center

  .row
    display: flex
    justify-content: space-between
    align-items: center
    .label
      margin-right: 15px
      font-size: 12px
</style>
