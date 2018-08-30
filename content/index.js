console.log('vivid is working')
const CONTAINER_WIDTH = 800
const CONTAINER_HEIGHT = 500

function toQueryString(o) {
  let str = ''
  for (let k in o) {
    const v = o[k] && o[k] !== 0 ? o[k] : ''
    str += `&${k}=${encodeURIComponent(v)}`
  }
  return str.slice(1)
}

function appendQueryString(url, queryObj) {
  const querystr = toQueryString(queryObj)
  url = url.indexOf('?') > -1 ? `${url}&${querystr}` : `${url}?${querystr}`
  return url
}

function debounce(fn, wait = 300) {
  let timer

  return function() {
    const ctx = this
    const args = arguments
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(ctx, args)
    }, wait)
  }
}

async function find(word) {
  let url = '//www.iciba.com/index.php'
  url = appendQueryString(url, {
    a: 'getWordMean',
    c: 'search',
    word,
    list: '1,3,4'
  })
  return fetch(url).then(res => res.json())
}

async function getImageList(word) {
  return fetch(
    `http://localhost:7001/image/search?q=${encodeURIComponent(word)}`
  ).then(res => res.json())
}

function getSelectionText() {
  var text = ''
  var activeEl = document.activeElement
  var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null
  if (
    activeElTagName == 'textarea' ||
    (activeElTagName == 'input' &&
      /^(?:text|search|password|tel|url)$/i.test(activeEl.type) &&
      typeof activeEl.selectionStart == 'number')
  ) {
    text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd)
  } else if (window.getSelection) {
    text = window.getSelection().toString()
  }
  return text
}

document.onselectionchange = debounce(handleSelectionChange)
document.onclick = function(e) {
  vm.show = false
  const mouseX = e.clientX
  const mouseY = e.clientY

  // 尽量往右下角靠
  if (mouseX + CONTAINER_WIDTH <= window.innerWidth) {
    vm.x = mouseX
  } else {
    vm.x = window.innerWidth - CONTAINER_WIDTH
  }
  if (mouseY + CONTAINER_HEIGHT <= window.innerHeight) {
    vm.y = mouseY
  } else {
    vm.y = window.innerHeight - CONTAINER_HEIGHT
  }
}

async function handleSelectionChange() {
  let text = getSelectionText().trim()
  let wordData, imageData
  if (text && text.length < 5000) {
    console.log(text, '选中的文字', text.length)
    const wordPromise = find(text)
    const imagePromise = getImageList(text)

    try {
      wordData = await wordPromise
      imageData = await imagePromise
    } catch (e) {
      console.log(e, '错误')
    }
    vm.text = text
    vm.show = true
    vm.wordData = _normalizeWordData(wordData)
    vm.imageData = imageData
    console.log(wordData, imageData, '释义')
    console.log(vm.wordData, '单词数据')
    console.log(vm.show, '是否显示')
  }
}

function _normalizeWordData(data) {
  const res = {
    collins: [],
    message: '',
    sound: {}
  }
  if (data.errno === 0) {
    res.word = data.baesInfo.word_name
    // colins
    if (data.collins) {
      res.collins = data.collins[0].entry
      res.sound = data.baesInfo.symbols ? data.baesInfo.symbols[0] : {}
      console.log(JSON.stringify( data.baesInfo.symbols[0]), '声音')
    }
    // sound
    if (data.baesInfo.symbols) {
      res.sound = data.baesInfo.symbols[0]
    }
    if (data.baesInfo.translate_result) {
      res.message = data.baesInfo.translate_result
    }
  } else {
    res.message = data.errmsg
  }

  return res
}

var vm
;(function render() {
  const vivid = document.createElement('div')
  const vividInner = document.createElement('div')
  vivid.id = '__plugin-vivid'
  vivid.appendChild(vividInner)
  document.body.appendChild(vivid)
  console.log(vivid.id, 'vivid dom')

  vm = new Vue({
    el: vividInner,
    template: `
    <div class="__vivid-result" v-show="show" :style="{ left: x + 'px', top: y + 'px' }">

      <div class="__vivi-word">
        <div class="word-wrapper" v-show="word">
          <p class="word">{{word}}</p>
          <div class="sound">
            <span v-show="wordData.sound.ph_am" @mouseenter ="play($refs.amAudio)">美 [{{wordData.sound.ph_am}}]</span>
            <span v-show="wordData.sound.ph_en" @mouseenter ="play($refs.enAudio)">英 [{{wordData.sound.ph_en}}]</span>
            <audio ref="amAudio" :src="wordData.sound.ph_am_mp3" class="hidden"></audio>
            <audio ref="enAudio" :src="wordData.sound.ph_en_mp3" class="hidden"></audio>
          </div>
        </div>
        <ul class="collins">
          <li v-for="item in collins">{{item.posp}}  <p>{{item.def}}</p></li>
        </ul>
        <div v-show="showToggle" @click.stop="toggleAllExamples" class="toggle">{{toggleAllExamplesText}}</div>
        <p class="message">
          {{wordData.message}}
        </p>
      </div>

      <div class="__vivi-image">
        <ul class="imagelist" v-if="imageData && imageData.value">
          <li class="imageitem"
            v-for="item in imageData.value"
            :style="{ width: (item.width * 100 / item.height) + 'px', flexGrow: item.width * 100 / item.height }"
          >
            <i :style="{ paddingBottom: (item.height / item.width * 100) + '%' }"></i>
            <img :src="item.thumbnailUrl">
          </li>
        </ul>
      </div>
      </div>
    `,
    data: {
      text: '',
      show: false,
      wordData: {
        collins: [],
        sound: {},
        message: ''
      },
      imageData: {},
      x: 0,
      y: 0,
      showAllColins: false
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
      }
    },

    methods: {
      play(ref) {
        ref.play()
      },
      toggleAllExamples() {
        this.showAllColins = !this.showAllColins
      }
    }
  })
})()
