import Vue from 'vue'
import Option from './option.vue'

new Vue({
  render: h => h(Option)
}).$mount('#app')

con

if (module.hot) {
  console.log('进入了这里')
  module.hot.accept(function() {
    console.log('自己更新了')
  })
}
