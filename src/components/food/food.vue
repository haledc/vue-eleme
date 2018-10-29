<template>
  <transition name="move">
    <div class="food" v-show="showFlag" ref="food">
      <div class="food-content">
        <!--头图-->
        <div class="image-header">
          <img :src="food.image"/>
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <!--商品内容-->
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <div class="cart-control-wrapper">
            <cart-control @add="addFood" :food="food"/>
          </div>
          <transition name="fade">
            <div class="buy" v-show="!food.count || food.count===0" @click.stop.prevent="addFirst">
              加入购物车
            </div>
          </transition>
        </div>
        <!--分割线组件-->
        <split v-show="food.info"/>
        <!--商品信息-->
        <div class="info" v-show="food.info">
          <div class="title">商品信息</div>
          <div class="text">{{food.info}}</div>
        </div>
        <!--分割线组件-->
        <split/>
        <!--商品评价-->
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <rating-select @select="selectRating" @toggle="toggleContent"
                         :selectType="selectType" :onlyContent="onlyContent"
                         :desc="desc" :ratings="food.ratings"/>
          <!--商品评价列表-->
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-for="rating in food.ratings" class="rating-item border-1px"
                  v-show="needShow(rating.rateType, rating.text)">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" width="12" height="12" :src="rating.avatar"/>
                </div>
                <div class="time">{{rating.rateTime | formatRatingDate}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up':rating.rateType===0,
                  'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import BScroll from 'better-scroll'
  import CartControl from 'components/cart-control/cart-control'
  import Vue from 'vue'
  import Split from 'components/split/split'
  import RatingSelect from 'components/rating-select/rating-select'
  import { formatDate } from 'common/js/date'

  // 默认是全部评价
  const ALL = 2

  export default {
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false,
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      }
    },
    methods: {
      /**
       * 显示
       */
      show() {
        // 初始化状态
        this.showFlag = true
        this.selectType = ALL
        this.onlyContent = true
        // DOM更新后实例化BScroll对象
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.food, {
              click: true
            })
          } else {
            this.scroll.refresh()
          }
        })
      },
      /**
       * 隐藏
       */
      hide() {
        this.showFlag = false
      },
      /**
       * 增加购物数量为 1
       * @param event
       */
      addFirst(event) {
        if (!event._constructed) return
        // 给父组件派发add事件，传入target参数
        this.$emit('add', event.target)
        // Vue 全局set API
        Vue.set(this.food, 'count', 1)
      },
      /**
       * 显示评论内容， 通过评论类型和评论内容来确定是否显示该条评论
       * @param type 关联类型
       * @param text 关联内容
       * @return {boolean}
       */
      needShow(type, text) {
        if (this.onlyContent && !text) {
          return false
        }
        if (this.selectType === ALL) {
          return true
        } else {
          // 判断评论的类型是否和选定的类型一致，一致为true即显示,否则为false即不显示
          return type === this.selectType
        }
      },
      addFood(target) {
        this.$emit('add', target)
      },
      /**
       * 选中评价类型
       * @param type 子组件ratingselect派发的事件参数
       */
      selectRating(type) {
        this.selectType = type
        // 异步刷新scroll
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      },
      /**
       * 切换是否只看有内容的评价
       */
      toggleContent() {
        this.onlyContent = !this.onlyContent
        // 异步刷新scroll
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      }
    },
    filters: {
      /**
       * 评论时间格式化
       * @param time
       * @return {*}
       */
      formatRatingDate(time) {
        let date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    components: {
      CartControl,
      Split,
      RatingSelect
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/mixin"

  .food
    position fixed
    left 0
    top 0
    bottom 48px
    z-index 30
    width 100%
    background #fff
    &.move-enter-active, &.move-leave-active
      transition all 0.2s linear
    &.move-enter, &.move-leave-to
      transform translate3d(100%, 0, 0)
    /*头图*/
    .image-header
      position relative
      width 100%
      // 高度设为0
      height 0
      // 设置和宽度一样100% 宽高相等
      padding-top 100%
      img
        position absolute
        top 0
        left 0
        width 100%
        height 100%
      .back
        position absolute
        top 10px
        left 0
        .icon-arrow_lift
          display block
          padding 10px
          font-size 20px
          color #fff
    /*商品内容*/
    .content
      position relative
      padding 18px
      .title
        line-height 14px
        margin-bottom 8px
        font-size 14px
        font-weight 700
        color rgb(7, 17, 27)
      .detail
        margin-bottom 18px
        line-height 10px
        height 10px
        font-size 0
        .sell-count, .rating
          font-size 10px
          color rgb(147, 153, 159)
        .sell-count
          margin-right 12px
      .price
        font-weight 700
        line-height 24px
        .now
          margin-right 8px
          font-size 14px
          color rgb(240, 20, 20)
        .old
          text-decoration line-through
          font-size 10px
          color rgb(147, 153, 159)
      .cart-control-wrapper
        position absolute
        right 12px
        bottom 12px
      .buy
        position absolute
        right 18px
        bottom 18px
        z-index 10
        height 24px
        line-height 24px
        padding 0 12px
        box-sizing border-box
        border-radius 12px
        font-size 10px
        color #fff
        background rgb(0, 160, 220)
        &.fade-enter-active, &.fade-leave-active
          transition all 0.2s
        &.fade-enter, &.fade-leave-to
          opacity 0
          z-index -1
    /*商品信息*/
    .info
      padding 18px
      .title
        line-height 14px
        margin-bottom 6px
        font-size 14px
        color rgb(7, 17, 27)
      .text
        line-height 24px
        padding 0 8px
        font-size 12px
        color rgb(77, 85, 93)
    /*商品评价 */
    .rating
      padding-top 18px
      .title
        line-height 14px
        margin-left 18px
        font-size 14px
        color rgb(7, 17, 27)
      .rating-wrapper
        padding 0 18px
        .rating-item
          position relative
          padding 16px 0
          border-1px(rgba(7, 17, 27, 0.1))
          .user
            position absolute
            right 0
            top 16px
            line-height 12px
            font-size 0
            .name
              display inline-block
              margin-right 6px
              vertical-align top
              font-size 10px
              color rgb(147, 153, 159)
            .avatar
              border-radius 50%

          .time
            margin-bottom 6px
            line-height 12px
            font-size 10px
            color rgb(147, 153, 159)
          .text
            line-height 16px
            font-size 12px
            color rgb(7, 17, 27)
            .icon-thumb_up, .icon-thumb_down
              margin-right 4px
              line-height 16px
              font-size 12px
            .icon-thumb_up
              color rgb(0, 160, 220)
            .icon-thumb_down
              color rgb(147, 153, 159)
        .no-rating
          padding 16px 0
          font-size 12px
          color rgb(147, 153, 159)
</style>
