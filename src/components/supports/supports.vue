<template>
  <ul v-if="supports" :class="classType">
    <li class="support-item border-1px" v-for="(item,index) in supports">
      <span class="icon" :class="classMap[supports[index].type]"></span>
      <span class="text">{{supports[index].description}}</span>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      supports: {
        type: Array
      },
      size: {
        type: Number
      }
    },
    computed: {
      classType() {
        return `supports-${this.size}`
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin"

  .supports-4
    .support-item
      padding 16px 12px
      border-1px(rgba(7, 17, 27, 0.1))
      font-size 0
      &:last-child
        border-none()
      .icon
        display inline-block
        width 16px
        height 16px
        vertical-align top
        margin-right 6px
        background-size 16px 16px
        background-repeat no-repeat
        &.decrease
          bg-image('decrease_4')
        &.discount
          bg-image('discount_4')
        &.guarantee
          bg-image('guarantee_4')
        &.invoice
          bg-image('invoice_4')
        &.special
          bg-image('special_4')
      .text
        line-height 16px
        font-size: 12px
        color: rgb(7, 17, 27)

  .supports-2
    width 80%
    margin 0 auto
    .support-item
      padding 0 12px
      margin-bottom 12px
      font-size 0
      &:last-child
        margin-bottom 0
      .icon
        display inline-block
        width 16px
        height 16px
        vertical-align top
        margin-right 6px
        background-size 16px 16px
        background-repeat no-repeat
        &.decrease
          bg-image('decrease_2')
        &.discount
          bg-image('discount_2')
        &.guarantee
          bg-image('guarantee_2')
        &.invoice
          bg-image('invoice_2')
        &.special
          bg-image('special_2')
      .text
        line-height 16px
        font-size 12px

  .supports-1
    .icon
      display inline-block
      // 顶部对齐
      vertical-align top
      width 12px
      height 12px
      margin-right 4px
      background-size 12px 12px
      background-repeat no-repeat
      &.decrease
        bg-image('decrease_1')
      &.discount
        bg-image('discount_1')
      &.guarantee
        bg-image('guarantee_1')
      &.invoice
        bg-image('invoice_1')
      &.special
        bg-image('special_1')
    .text
      line-height 12px
      font-size 10px
</style>
