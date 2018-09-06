<template>
  <div class="v-toggle">
    <input type="checkbox" v-model="checkboxValue" class="toggle-input">
    <i class="toggle-ui"></i>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      checkboxValue: this.value
    }
  },
  watch: {
    value(newVal) {
      this.checkboxValue = newVal
    },
    checkboxValue(newVal) {
      this.$emit('input', newVal)
    }
  }
}
</script>

<style lang="stylus">
.v-toggle
  --switch-width: 36px
  --switch-height: 18px
  position: relative
  display: flex
  align-items: center

  .toggle-input
    position: absolute
    z-index: 1
    width: var(--switch-width)
    height: var(--switch-height)
    opacity: 0

    &:checked + .toggle-ui
      border-color: rgb(3, 152, 226)
      background-color: rgb(3, 152, 226)

    &:checked + .toggle-ui::before
      transform: scale(0)

    &:checked + .toggle-ui::after
      transform: translateX(calc(var(--switch-width) - var(--switch-height)))

  .toggle-ui
    position: relative
    display: inline-block
    width: var(--switch-width)
    height: var(--switch-height)
    border: 1px solid #e4e4e4
    border-radius: var(--switch-height)
    background-color: #e4e4e4

    &::before, &::after
      content: ''
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      border-radius: var(--switch-height)
      background-color: #fff
      transition: transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1.28)

    &::after
      width: var(--switch-height)
      background-color: #fff
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4)
</style>

