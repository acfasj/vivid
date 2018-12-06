<template>
  <div class="__vivid-result" v-show="show" :style="{ left: x + 'px', top: y + 'px' }" :class="resultClass">
    <div class="__vivi-word">
      <div class="word-wrapper" v-show="word">
        <p class="word">{{word}}</p>
        <div class="sound">
          <p v-show="wordData.sound.ph_am_mp3" @mouseenter ="play($refs.amAudio)">American [{{wordData.sound.ph_am}}]</p>
          <p v-show="wordData.sound.ph_en_mp3" @mouseenter ="play($refs.enAudio)">British [{{wordData.sound.ph_en}}]</p>
          <audio ref="amAudio" :src="wordData.sound.ph_am_mp3" class="hidden"></audio>
          <audio ref="enAudio" :src="wordData.sound.ph_en_mp3" class="hidden"></audio>
        </div>
      </div>
      <ul class="collins">
        <li v-for="item in collins" :key="item.def">
          <p>{{item.posp}}</p>
          <p>{{item.def}}</p>
        </li>
      </ul>
      <p v-show="showToggle" @click="toggleAllExamples" class="toggle color-info text-right">{{toggleAllExamplesText}}</p>
      <p v-show="collins.length <= 0" class="message">
        {{wordData.message}}
      </p>
    </div>

    <div class="__vivi-image" v-show="imageData && imageData.value.length">
      <ul class="imagelist">
        <li class="imageitem"
          v-for="(item, index) in imageData.value"
          :key="item.thumbnailUrl + index"
          :style="{ width: (item.width * 170 / item.height) + 'px', flexGrow: item.width * 170 / item.height }"
        >
          <i :style="{ paddingBottom: (item.height / item.width * 100) + '%' }"></i>
          <a :href="item.webSearchUrl" target="_blank" :title="item.name || '图片'">
            <img :src="item.thumbnailUrl" :alt="item.name || '图片'">
          </a>
        </li>
      </ul>
      <p class="text-right">
        <a class="color-info" :href="imageData.webSearchUrl" target="_blank">more pictures</a>
      </p>
    </div>
  </div>
</template>

<script>
import {
  toQueryString,
  appendQueryString,
  debounce,
  send
} from './common/helper/index.js'

const CONTAINER_WIDTH = 800
const CONTAINER_HEIGHT = 500
const imageLoadingValue = new Array(9)
  .fill(chrome.runtime.getURL('static/white.jpg'))
  .map(url => {
    return {
      thumbnailUrl: url,
      width: 128,
      height: 128,
      webSearchUrl: ''
    }
  })
const initialImageData = { value: [], webSearchUrl: '' }

export default {
  data() {
    return {
      text: '',
      show: false,
      wordData: {
        collins: [],
        sound: {},
        message: ''
      },
      imageData: initialImageData,
      x: 0,
      y: 0,
      showAllColins: false,
      nightMode: false
    }
  },

  computed: {
    word() {
      return this.text.length < 32 ? this.text : ''
    },
    collins() {
      if (this.showAllColins) {
        return this.wordData.collins
      }
      return this.wordData.collins.slice(0, 2)
    },
    showToggle() {
      return this.wordData.collins.length > 2
    },
    toggleAllExamplesText() {
      if (this.showAllColins) {
        return 'collapse'
      }
      return 'show all examples'
    },
    resultClass() {
      return {
        'night-mode': this.nightMode
      }
    }
  },

  watch: {
    show(newVal) {
      // reset
      if (!newVal) {
        this.$el.scrollTop = 0
        this.showAllColins = false
        this.imageData.value = imageLoadingValue
      }
    }
  },

  created() {
    console.log('实例配置', this.config)

    this._divEl = document.createElement('div') // for image html query
    this.shouldUseCtrl = this.config.shouldUseCtrl || false // only working with ctrl key
    this.nightMode = this.config.nightMode || false // only working with ctrl key
    this.isCtrlPressing = false
    this.bindEvents()
  },

  beforeDestroy() {
    this.unbindEvents()
  },

  methods: {
    play(ref) {
      ref.play()
    },

    toggleAllExamples() {
      this.showAllColins = !this.showAllColins
    },

    bindEvents() {
      this._onSelectionChange = debounce(this.onSelectionChange).bind(this)
      this._onDocumentClick = this.onDocumentClick.bind(this)
      this._onDocumentMouseup = this.onDocumentMouseup.bind(this)
      if (this.shouldUseCtrl) this._onDocumentkeyDown = this.onDocumentKeyDown.bind(this)
      if (this.shouldUseCtrl) this._onDocumentkeyUp = this.onDocumentKeyUp.bind(this)

      document.addEventListener('selectionchange', this._onSelectionChange)
      document.addEventListener('click', this._onDocumentClick)
      document.addEventListener('mouseup', this._onDocumentMouseup)
      if (this.shouldUseCtrl) document.addEventListener('keydown', this._onDocumentkeyDown)
      if (this.shouldUseCtrl) document.addEventListener('keyup', this._onDocumentkeyUp)
    },

    unbindEvents() {
      document.removeEventListener('selectionchange', this._onSelectionChange)
      document.removeEventListener('click', this._onDocumentClick)
      document.removeEventListener('mouseup', this._onDocumentMouseup)
      if (this.shouldUseCtrl) document.removeEventListener('keydown', this._onDocumentkeyDown)
      if (this.shouldUseCtrl) document.removeEventListener('keyup', this._onDocumentkeyUp)
    },

    async onSelectionChange(e) {
      let text = this.getSelectionText().trim()
      let wordData, imageData
      // 不要使用 computed
      // 因为 computed 本质上是 watcher
      // 暂时还解释不清楚, todo...
      const shouldWork = !this.shouldUseCtrl || (this.shouldUseCtrl && this.isCtrlPressing)
      if (text && text.length < 5000 && shouldWork) {
        const data = await send({ word: text })
        const wordData = data.word
        const imageData = data.image

        this.text = text
        this.wordData = this._normalizeWordData(wordData)
        this.imageData = this._normalizeImageData(imageData, text)
        this.show = true
        console.log(this.wordData, '单词数据')
        console.log(this.imageData, '图片数据')
        console.log(this.show, '是否显示')
      }
    },

    onDocumentClick(e) {
      this.show = false
    },

    onDocumentMouseup(e) {
      const mouseX = e.clientX
      const mouseY = e.clientY

      // 尽量往右下角靠
      if (mouseX + CONTAINER_WIDTH <= window.innerWidth) {
        this.x = mouseX
      } else {
        this.x = window.innerWidth - CONTAINER_WIDTH
      }
      if (mouseY + CONTAINER_HEIGHT <= window.innerHeight) {
        this.y = mouseY
      } else {
        this.y = window.innerHeight - CONTAINER_HEIGHT
      }
    },

    onDocumentKeyDown(e) {
      // ctrlKey => altKey, 不然复制粘贴太麻烦
      if (e.altKey && !this.isCtrlPressing) {
        this.isCtrlPressing = true
      }
    },

    onDocumentKeyUp(e) {
      if (this.isCtrlPressing) {
        this.isCtrlPressing = false
      }
      console.log('松开', this.isCtrlPressing)
    },

    getSelectionText() {
      var text = ''
      var activeEl = document.activeElement
      var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null
      if (
        activeElTagName == 'textarea' ||
        (activeElTagName == 'input' &&
          /^(?:text|search|password|tel|url)$/i.test(activeEl.type) &&
          typeof activeEl.selectionStart == 'number')
      ) {
        text = activeEl.value.slice(
          activeEl.selectionStart,
          activeEl.selectionEnd
        )
      } else if (window.getSelection) {
        text = window.getSelection().toString()
      }
      return text
    },

    _normalizeWordData(data) {
      const res = {
        collins: [],
        message: '',
        sound: {}
      }

      if (data.errno !== 0) {
        res.message = data.errmsg
        return res
      }

      if (data.baesInfo && data.baesInfo.word_name) {
        res.word = data.baesInfo.word_name
      }

      // colins
      if (data.collins) {
        res.collins = data.collins[0].entry
        res.sound = data.baesInfo.symbols ? data.baesInfo.symbols[0] : {}
      }

      // sound
      if (data.baesInfo.symbols) {
        const rawSound = data.baesInfo.symbols[0]
        for (const k in rawSound) {
          if (
            typeof rawSound[k] === 'string' &&
            rawSound[k].startsWith('http:')
          ) {
            rawSound[k] = rawSound[k].replace('http:', 'https:')
          }
        }
        res.sound = rawSound
      }

      // message
      if (data.baesInfo.translate_result) {
        res.message = data.baesInfo.translate_result
      } else if (data.ee_mean && data.ee_mean[0]) {
        let means = data.ee_mean[0].means
        if (means && means[0]) {
          res.message = means[0].word_mean || ''
        }
      } else if (
        data.netmean &&
        data.netmean.PerfectNetExp &&
        data.netmean.PerfectNetExp[0]
      ) {
        res.message = data.netmean.PerfectNetExp[0].exp || ''
      }

      console.log(data, res.meesage, 'debug')

      return res
    },

    _normalizeImageData(str, text) {
      const reg = /<script[\s\S]*?>[\s\S]*?<\/script>|<style[\s\S]*?>[\s\S]*?<\/style>|<img[\s]*?id="gif_loading"[\s\S]*?\/>/gi
      str = str.replace(reg, '')
      this._divEl.innerHTML = str
      const aTags = this._divEl.querySelectorAll('.iusc')
      console.log(aTags)
      let value = []
      try {
        value = Array.from(aTags)
          .slice(0, 10)
          .map(a => {
            const img = a.querySelector('img')
            const item = {}
            const mad = JSON.parse(a.getAttribute('m'))
            if (mad.turl.startsWith('/')) {
              item.thumbnailUrl = 'https://cn.bing.com' + mad.turl
            } else {
              item.thumbnailUrl = mad.turl
            }
            item.width = +img.width
            item.height = +img.height
            item.webSearchUrl = 'https://cn.bing.com' + a.getAttribute('href')
            item.name = img.getAttribute('alt')
            return item
          })
      } catch (e) {
        console.error(e)
      }

      return {
        webSearchUrl: `https://cn.bing.com/images/search?q=${encodeURIComponent(
          text
        )}&FORM=HDRSC2&ensearch=1`,
        value
      }
    }
  }
}
</script>

<style lang="stylus">
</style>
