<template>
  <div class="tab border-1px">
    <router-link tag="div" class="tab-item" to="/goods">
      <span class="tab-link">商品</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/ratings">
      <span class="tab-link">评论</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/seller">
      <span class="tab-link">商家</span>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {}
</script>

<style scoped lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin"

  .tab
    display flex
    width 100%
    height 40px
    line-height 40px
    // border-bottom 1px solid rbga(7,7,27,0.1)
    border-1px(rgba(7, 17, 27, 0.1))
    .tab-item
      flex 1
      text-align center
      font-size 14px
      color rgb(77, 85, 93)
      // router-link 内置的默认活动class
      &.router-link-active
        color rgb(240, 20, 20)
</style>
