<template>
  <div class="cartcontrol">
    <transition name="move">
      <!--减少购买数量-->
      <!--过渡-透明和平移层-->
      <div class="cart-decrease" @click.stop.prevent="decreaseCart" v-show="food.count>0">
        <!--过渡-滚动层-->
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <!--购买数量-->
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <!--增加购买数量-->
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'

  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      /**
       * 增加购买数量
       * @param event
       */
      addCart(event) {
        if (!event._constructed) {
          return
        }
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1)   // 新增或者删除，需要调用Vue全局set接口
        } else {
          this.food.count++
        }
        this.$emit('add', event.target) // 给父组件派发事件，传入dom对象
      },
      /**
       * 减少购买数量
       * @param event
       */
      decreaseCart(event) {
        if (!event._constructed) {
          return
        }
        if (this.food.count) {
          this.food.count--
        }
      }
    }
  }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size 0
    .cart-decrease
      display inline-block
      padding 6px // 增加点击区域范围
      opacity 1 // 动画后的状态 不透明
      transform translate3d(0, 0, 0) // 3d移动后的状态 初始值0,0,0
      .inner
        display inline-block
        line-height 24px
        font-size 24px
        color rgb(0, 160, 220)
        transition all 0.4s linear
        transform rotate(0)
      // 旋转后的状态 0度
      &.move-enter-active, &.move-leave-active // 进来阶段，离开阶段（时间一样可写一起）
        transition all 0.4s linear
      &.move-enter, &.move-leave-to // 进来开始，离开结束（初始和结束）
        opacity 0 // 透明
        transform translate3d(24px, 0, 0) // 3d x轴移动，硬件加速
        .inner
          transform rotate(180deg)
    // 旋转180度
    .cart-count
      display inline-block
      vertical-align top
      width 12px
      padding-top 6px
      line-height 24px
      text-align center
      font-size 10px
      color rgb(147, 153, 159)
    .cart-add
      display inline-block
      padding 6px // 增加点击区域范围
      line-height 24px
      font-size 24px
      color rgb(0, 160, 220)
</style>
