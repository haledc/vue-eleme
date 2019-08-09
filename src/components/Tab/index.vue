<template>
  <div class="tab border-1px">
    <router-link
      v-for="item in routerContent"
      :key="item.text"
      tag="div"
      class="tab-item"
      :to="item.to"
    >
      <span class="tab-link">{{ item.text }}</span>
    </router-link>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'

export default class Tab extends Vue {
  routerContent = [
    { to: '/goods', text: '商品' },
    { to: '/ratings', text: '评论' },
    { to: '/seller', text: '商家' }
  ]
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/mixin.styl'

.tab
  display: flex
  width: 100%
  height: 40px
  line-height: 40px
  // border-bottom 1px solid rbga(7,7,27,0.1)
  border-1px(rgba(7, 17, 27, 0.1))

  .tab-item
    flex: 1
    text-align: center
    font-size: 14px
    color: rgb(77, 85, 93)

    // router-link 内置的默认活动class
    &.router-link-active
      color: rgb(240, 20, 20)
</style>
