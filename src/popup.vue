<template>
  <div id="app">
    <div class="row">
      <span>此站点禁用</span>
      <v-toggle v-model="toggleValue"></v-toggle>
    </div>
  </div>
</template>

<script>
import VToggle from './component/v-toggle.vue'

export default {
  data() {
    return {
      toggleValue: false
    }
  },

  components: {
    VToggle
  },

  watch: {
    toggleValue(newVal) {
      let enabled = !newVal
      chrome.management.getSelf(function (e) {
        console.log(e, chrome.management)
        //  chrome.management.setEnabled(e.id, enabled)
      })
    }
  },

  methods: {
    getDisabedSites() {
      return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['disabled'], res => {
          let ret = []
          if (res.disabled && res.disabled.length) {
            ret = res.disabled
          }
          resolve(ret)
        })
      })
    },

    enable() {

    },

    disable() {

    },
  }
}
</script>

<style lang="stylus">
html, body
  width: 200px
  height: 200px
  margin: 0
  padding: 0

#app
  width: 100%
  height: 100%
  box-sizing: border-box
  padding: 20px

  .row
    display: flex
    justify-content: space-between
    align-items: center
</style>
