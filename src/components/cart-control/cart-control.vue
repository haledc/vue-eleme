<template>
  <div class="cart-control">
    <!--减少购买数量-->
    <transition name="move">
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

<script>
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
        if (!this.food.count) {
          // 新增属性，需要调用Vue全局set API
          Vue.set(this.food, 'count', 1)
        } else {
          this.food.count++
        }

        // 给父组件派发事件，传入DOM对象
        this.$emit('add', event.target)
      },
      /**
       * 减少购买数量
       * @param event
       */
      decreaseCart(event) {
        if (this.food.count) {
          this.food.count--
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .cart-control
    font-size 0
    .cart-decrease
      display inline-block
      // 增加点击区域范围
      padding 6px
      .inner
        display inline-block
        line-height 24px
        font-size 24px
        color rgb(0, 160, 220)
        transition all 0.4s linear
      // 进来阶段，离开阶段（时间一样可写一起）
      &.move-enter-active, &.move-leave-active
        transition all 0.4s linear
      // 进来开始，离开结束（初始和结束）
      &.move-enter, &.move-leave-to
        // 透明状态
        opacity 0
        // x轴移动前位置， 3d硬件加速
        transform translate3d(24px, 0, 0)
        .inner
          // 角度
          transform rotate(180deg)
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
      // 增加点击区域范围
      padding 6px
      line-height 24px
      font-size 24px
      color rgb(0, 160, 220)
</style>
