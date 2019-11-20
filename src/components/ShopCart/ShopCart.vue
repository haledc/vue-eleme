<template>
  <div>
    <div class="shopcart">
      <!--购物车折叠列表-->
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{ highlight: totalCount > 0 }">
              <i
                class="icon-shopping_cart"
                :class="{ highlight: totalCount > 0 }"
              ></i>
            </div>
            <div class="num" v-show="totalCount > 0">{{ totalCount }}</div>
          </div>
          <div class="price" :class="{ highlight: totalPrice > 0 }">
            ￥{{ totalPrice }}
          </div>
          <div class="desc">另需配送费￥{{ deliveryPrice }}元</div>
        </div>
        <div class="content-right" @click.stop.prevent="pay">
          <div class="pay" :class="payClass">{{ payDesc }}</div>
        </div>
      </div>
      <!--购物车小球控制层-->
      <div class="ball-container">
        <div v-for="(ball, index) in balls" :key="index">
          <transition
            name="drop"
            @before-enter="beforeDrop"
            @enter="dropping"
            @after-enter="afterDrop"
          >
            <!--Y轴方向-->
            <div v-show="ball.show" class="ball">
              <!--X轴方向-->
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>
      <transition name="fold">
        <!--购物车展开列表-->
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li
                class="food border-1px"
                v-for="(food, index) in selectFoods"
                :key="index"
              >
                <span class="name">{{ food.name }}</span>
                <div class="price">
                  <span>￥{{ food.price * food.count }}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <CartControl @add="addFood" :food="food" />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <!--购物车展开列表背景层-->
      <div class="list-mask" v-show="listShow" @click="hideList"></div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import BScroll from 'better-scroll'
import CartControl from '@/components/CartControl'
import { IFood } from '@/types'

interface Ball {
  show: boolean
  el?: HTMLElement
}

@Component({
  components: {
    CartControl
  }
})
export default class Shopcart extends Vue {
  @Prop({ default: () => [] }) selectFoods!: IFood[]
  @Prop({ default: 0 }) deliveryPrice!: number
  @Prop({ default: 0 }) minPrice!: number

  balls: Ball[] = [
    {
      show: false
    },
    {
      show: false
    },
    {
      show: false
    },
    {
      show: false
    },
    {
      show: false
    }
  ]
  dropBalls: Ball[] = []
  fold: boolean = true
  scroll!: BScroll
  $refs!: {
    listContent: HTMLElement
  }

  get totalPrice() {
    let total: number = 0
    this.selectFoods.forEach((food: IFood) => {
      total += food.price * food.count!
    })
    return total
  }

  get totalCount() {
    let count: number = 0
    this.selectFoods.forEach((food: IFood) => {
      count += food.count!
    })
    return count
  }

  get payDesc() {
    if (this.totalPrice === 0) {
      return `￥${this.minPrice}元起送`
    } else if (this.totalPrice < this.minPrice) {
      const diff = this.minPrice - this.totalPrice
      return `还差￥${diff}元起送`
    } else {
      return '去结算'
    }
  }

  get payClass() {
    if (this.totalPrice < this.minPrice) {
      return 'not-enough'
    } else {
      return 'enough'
    }
  }

  get listShow() {
    if (!this.totalCount) {
      this.fold = true
      return false
    }
    const show = !this.fold
    /**
     * 当列表展开时，实例化BScroll对象或者刷新对象
     */
    if (show) {
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.listContent, {
            click: true
          })
        } else {
          this.scroll.refresh()
        }
      })
    }
    return show
  }

  drop(el: HTMLElement) {
    for (const ball of this.balls) {
      if (!ball.show) {
        ball.show = true
        ball.el = el
        this.dropBalls.push(ball)
        return
      }
    }
  }

  toggleList() {
    if (!this.totalCount) {
      return
    }
    // 取反
    this.fold = !this.fold
  }

  empty() {
    this.selectFoods.forEach(food => {
      food.count = 0
    })
  }

  hideList() {
    this.fold = true
  }

  pay() {
    if (this.totalPrice < this.minPrice) {
      return
    }
    window.alert(`支付${this.totalPrice + 4}元`)
  }

  addFood(event: Event) {
    this.drop(event.target as HTMLElement)
  }

  beforeDrop(el: HTMLElement) {
    let count = this.balls.length
    while (count--) {
      const ball = this.balls[count]
      if (ball.show) {
        // 获取加号DOM矩形对象
        const rect = (ball.el as HTMLElement).getBoundingClientRect()
        // 加号和购物车x轴差值 = 加号DOM和左边屏幕的距离 - 小球左侧偏移（落点位置）
        const x = rect.left - 32
        // 加号和购物车y轴差值（负值） = 屏幕高度 - 加号DOM和页面顶部的距离 - 小球底部偏移（落点位置）
        const y = -(window.innerHeight - rect.top - 22)
        el.style.display = ''
        // y轴移动的距离 纵向动画
        el.style.webkitTransform = `translate3d(0, ${y}px, 0)`
        el.style.transform = `translate3d(0, ${y}px, 0)`
        // x轴移动的距离 横向动画
        const inner = el.getElementsByClassName('inner-hook')[0] as HTMLElement
        inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`
        inner.style.transform = `translate3d(${x}px, 0, 0)`
      }
    }
  }

  dropping(el: HTMLElement, done: () => void) {
    // 主动触发浏览器重绘 ★
    /* eslint-disable no-unused-vars */
    const rf = el.offsetHeight

    this.$nextTick(() => {
      el.style.webkitTransform = 'translate3d(0, 0, 0)'
      el.style.transform = 'translate3d(0, 0, 0)'
      const inner = el.getElementsByClassName('inner-hook')[0] as HTMLElement
      inner.style.webkitTransform = 'translate3d(0, 0, 0)'
      inner.style.transform = 'translate3d(0, 0, 0)'
      // 监听过渡完成事件，调用done函数跳转到afterDrop中去
      el.addEventListener('transitionend', done)
    })
  }

  afterDrop(el: HTMLElement) {
    const ball = this.dropBalls.shift()
    if (ball) {
      ball.show = false
      el.style.display = 'none'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/mixins.scss';

/* 购物车 */
.shopcart {
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

  /* 购物车展开列表 */
  .shopcart-list {
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    width: 100%;
    // y轴向上移动100%（自身）
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