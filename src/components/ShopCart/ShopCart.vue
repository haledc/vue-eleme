<template>
  <div>
    <div class="shop-cart">
      <!-- 购物车折叠列表 -->
      <div class="content" @click="toggleListShow">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{ highlight: totalCount > 0 }">
              <i
                class="icon-shopping_cart"
                :class="{ highlight: totalCount > 0 }"
              ></i>
            </div>
            <div v-show="totalCount > 0" class="num">
              {{ totalCount }}
            </div>
          </div>
          <div class="price" :class="{ highlight: totalPrice > 0 }">
            ￥{{ totalPrice }}
          </div>
          <div class="desc">另需配送费￥{{ deliveryPrice }}元</div>
        </div>
        <div class="content-right" @click.stop.prevent="pay">
          <div class="pay" :class="payClass">
            {{ payDesc }}
          </div>
        </div>
      </div>

      <!-- 购物车小球控制层 -->
      <div class="ball-container">
        <div v-for="(ball, index) in state.balls" :key="index">
          <Transition
            name="drop"
            @before-enter="beforeDrop"
            @enter="dropping"
            @after-enter="afterDrop"
          >
            <!-- Y 轴方向 -->
            <div v-show="ball.show" class="ball">
              <!-- X 轴方向 -->
              <div class="inner inner-hook"></div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- 购物车展开列表 -->
      <Transition name="fold">
        <div v-show="listShow" class="shopcart-list">
          <div class="list-header">
            <h1 class="title">
              购物车
            </h1>
            <span class="empty" @click="empty">
              清空
            </span>
          </div>
          <div ref="listContent" class="list-content">
            <ul>
              <li
                v-for="food in selectFoods"
                :key="food.name"
                class="food border-1px"
              >
                <span class="name">
                  {{ food.name }}
                </span>
                <div class="price">
                  <span>￥{{ food.price * food.count }}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <CartControl :food="food" @add="addFood" />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </Transition>
    </div>

    <!-- 购物车展开列表背景层 -->
    <Transition name="fade">
      <div v-show="listShow" class="list-mask" @click="hideList"></div>
    </Transition>
  </div>
</template>

<script>
import { reactive, computed, watch } from '@vue/composition-api'
import CartControl from '../CartControl'
import { createScroll, refreshScroll } from '../../utils'

export default {
  components: {
    CartControl
  },
  props: {
    selectFoods: {
      type: Array,
      default() {
        return []
      }
    },
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    }
  },
  setup(props, { root, refs }) {
    const state = reactive({
      balls: [
        { show: false },
        { show: false },
        { show: false },
        { show: false },
        { show: false }
      ],
      dropBalls: [],
      fold: true
    })

    const totalPrice = computed(() => {
      let total = 0
      props.selectFoods.forEach(food => {
        total += food.price * food.count
      })
      return total
    })

    const totalCount = computed(() => {
      let count = 0
      props.selectFoods.forEach(food => {
        count += food.count
      })
      return count
    })

    const payDesc = computed(() =>
      totalPrice.value === 0
        ? `￥${props.minPrice}元起送`
        : totalPrice.value < props.minPrice
        ? `还差￥${props.minPrice - totalPrice.value}元起送`
        : '去结算'
    )

    const payClass = computed(() =>
      totalPrice.value < props.minPrice ? 'not-enough' : 'enough'
    )

    const listShow = computed(() => {
      if (!totalCount.value) return false
      return !state.fold
    })

    let scroll

    watch(
      // 插件：不能监听计算属性 listShow
      () => state.fold,
      newVal => {
        if (!newVal) {
          root.$nextTick(() => {
            if (!scroll) {
              scroll = createScroll(refs.listContent, { click: true })
            } else {
              refreshScroll(scroll)
            }
          })
        }
      }
    )

    const drop = el => {
      for (let i = 0; i < state.balls.length; i++) {
        const ball = state.balls[i]
        if (!ball.show) {
          ball.show = true
          ball.el = el
          state.dropBalls.push(ball)
          return
        }
      }
    }

    const toggleListShow = () => {
      if (!totalCount.value) return
      state.fold = !state.fold
    }

    const empty = () => {
      props.selectFoods.forEach(food => (food.count = 0))
      state.fold = true
    }

    const hideList = () => (state.fold = true)

    const pay = () => {
      if (totalPrice.value < props.minPrice) return
      window.alert(`支付${totalPrice.value + 4}元`)
    }

    const addFood = target => drop(target)

    const beforeDrop = el => {
      let len = state.balls.length
      while (len--) {
        const ball = state.balls[len]
        if (ball.show) {
          const rect = ball.el.getBoundingClientRect()
          const x = rect.left - 32
          const y = -(window.innerHeight - rect.top - 22)
          el.style.display = ''
          el.style.webkitTransform = `translate3d(0, ${y}px, 0)`
          el.style.transform = `translate3d(0, ${y}px, 0)`
          const inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`
          inner.style.transform = `translate3d(${x}px, 0, 0)`
        }
      }
    }

    // 插件：小球动画有点卡，不流畅
    const dropping = (el, done) => {
      // eslint-disable-next-line
      let rf = el.offsetHeight
      root.$nextTick(() => {
        el.style.webkitTransform = 'translate3d(0, 0, 0)'
        el.style.transform = 'translate3d(0, 0, 0)'
        const inner = el.getElementsByClassName('inner-hook')[0]
        inner.style.webkitTransform = `translate3d(0, 0, 0)`
        inner.style.transform = `translate3d(0, 0, 0)`
        el.addEventListener('transitionend', done)
      })
    }

    const afterDrop = el => {
      const ball = state.dropBalls.shift()
      if (ball) {
        ball.show = false
        el.style.display = 'none'
      }
    }

    return {
      state,
      totalPrice,
      totalCount,
      payDesc,
      payClass,
      listShow,
      drop,
      toggleListShow,
      empty,
      hideList,
      pay,
      addFood,
      beforeDrop,
      dropping,
      afterDrop
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/mixins.scss';

// 购物车
.shop-cart {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 50;
  width: 100%;
  height: 48px;

  /* 购物车折叠列表 */
  .content {
    display: flex;
    background: #141d27;
    font-size: 0;
    color: rgba(255, 255, 255, 0.4);

    .content-left {
      flex: 1;

      .logo-wrapper {
        display: inline-block;
        vertical-align: top;
        position: relative;
        top: -10px;
        margin: 0 12px;
        padding: 6px;
        width: 56px;
        height: 56px;
        box-sizing: border-box;
        border-radius: 50%;
        background: #141d27;

        .logo {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          text-align: center;
          background: #2b343c;

          &.highlight {
            background: rgb(0, 160, 220);
          }

          .icon-shopping_cart {
            line-height: 44px;
            font-size: 24px;
            color: #80858a;

            &.highlight {
              color: #fff;
            }
          }
        }

        .num {
          position: absolute;
          top: 0;
          right: 0;
          width: 24px;
          height: 16px;
          line-height: 16px;
          text-align: center;
          border-radius: 16px;
          font-size: 9px;
          font-weight: 700;
          color: #fff;
          background: rgb(240, 20, 20);
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
        }
      }

      .price {
        display: inline-block;
        vertical-align: top;
        margin-top: 12px;
        line-height: 24px;
        padding-right: 12px;
        box-sizing: border-box;
        border-right: 1px solid rgba(255, 255, 255, 0.1);
        font-size: 16px;
        font-weight: 700;

        &.highlight {
          color: #fff;
        }
      }

      .desc {
        display: inline-block;
        vertical-align: top;
        margin: 12px 0 0 12px;
        line-height: 24px;
        font-size: 10px;
      }
    }

    .content-right {
      flex: 0 0 105px;
      width: 105px;

      .pay {
        height: 48px;
        line-height: 48px;
        text-align: center;
        font-size: 12px;
        font-weight: 700;

        &.not-enough {
          background: #2b333b;
        }

        &.enough {
          background: #00b43c;
          color: #fff;
        }
      }
    }
  }

  /* 小球 */
  .ball-container {
    // 小球落点位置
    .ball {
      position: fixed;
      left: 32px;
      bottom: 22px;
      z-index: 200;
      // 贝塞尔曲线
      transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);

      .inner {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: rgb(0, 160, 220);
        transition: all 0.4s linear;
      }
    }
  }

  // 购物车展开列表
  .shopcart-list {
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    width: 100%;
    // y 轴向上移动 100%（自身）
    transform: translate3d(0, -100%, 0);

    &.fold-enter-active,
    &.fold-leave-active {
      transition: all 0.5s;
    }

    &.fold-enter,
    &.fold-leave-to {
      transform: translate3d(0, 0, 0);
    }

    .list-header {
      height: 40px;
      line-height: 40px;
      padding: 0 18px;
      background: #f3f5f7;
      border-bottom: 1px solid rgba(7, 17, 27, 0.1);

      .title {
        float: left;
        font-size: 14px;
        color: rgb(7, 17, 27);
      }

      .empty {
        float: right;
        font-size: 12px;
        color: rgb(0, 160, 220);
      }
    }

    .list-content {
      padding: 0 18px;
      max-height: 217px;
      overflow: hidden;
      background: #fff;

      .food {
        position: relative;
        padding: 12px 0;
        box-sizing: border-box;
        @include border-1px(rgba(7, 17, 27, 0.1));

        .name {
          line-height: 24px;
          font-size: 14px;
          color: rgb(7, 17, 27);
        }

        .price {
          position: absolute;
          right: 90px;
          bottom: 12px;
          line-height: 24px;
          font-size: 14px;
          font-weight: 700;
          color: rgb(240, 20, 20);
        }

        .cartcontrol-wrapper {
          position: absolute;
          right: 0;
          bottom: 6px;
        }
      }
    }
  }
}

/* 购物车展开列表背景层 */
.list-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 40;
  backdrop-filter: blur(10px); // 模糊 iphone手机可看到效果
  background: rgba(7, 17, 27, 0.6);

  &.fade-enter-active,
  &.fade-leave-active {
    transition: all 0.5s;
  }

  &.fade-enter,
  &.fade-leave-to {
    opacity: 0;
    background: rgba(7, 17, 27, 0);
  }
}
</style>
