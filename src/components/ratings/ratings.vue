<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <!--综合评论-->
      <div class="overview">
        <!--左边内容-->
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <!--右边内容-->
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"/>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"/>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <!--分割-->
      <split/>
      <!--评论类型条-->
      <rating-select @select="selectRating" @toggle="toggleContent"
                    :selectType="selectType" :onlyContent="onlyContent"
                    :ratings="ratings"/>
      <!--评论内容列表-->
      <div class="ratings-wrapper">
        <ul>
          <li v-for="rating in ratings" class="rating-item" v-show="needShow(rating.rateType, rating.text)">
            <div class="avatar">
              <img width="28" height="28" :src="rating.avatar">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"/>
                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend &&　rating.recommend.length">
                <span class="icon-thumb_up"></span>
                <span class="item" v-for="item in rating.recommend">{{item}}</span>
              </div>
              <div class="time">{{rating.rateTime | formatDate}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import Star from 'components/star/star'
  import RatingSelect from 'components/rating-select/rating-select'
  import Split from 'components/split/split'
  import {formatDate} from 'common/js/date'

  const ALL = 2
  const ERR_OK = 0

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        ratings: [],
        selectType: ALL,
        onlyContent: true
      }
    },
    methods: {
      /**
       * 显示评论内容
       * @param type
       * @param text
       * @returns {boolean}
       */
      needShow(type, text) {
        if (this.onlyContent && !text) {
          return false
        }
        if (this.selectType === ALL) {
          return true
        } else {
          return type === this.selectType
        }
      },
      /**
       * 选择评论类型
       * @param type
       */
      selectRating(type) {
        this.selectType = type
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      },
      /**
       * 切换是否只看有内容的评价
       */
      toggleContent() {
        this.onlyContent = !this.onlyContent
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      }
    },
    created() {
      /**
       * 获得后端ratings数据，并异步设置滚动
       */
      this.$axios.get('api/ratings').then((response) => {
        response = response.data
        if (response.errno === ERR_OK) {
          this.ratings = response.data
          this.$nextTick(() => {   // 滚动
            this.scroll = new BScroll(this.$refs.ratings, {
              click: true
            })
          })
        }
      }).catch((e) => {
        console.log(e)
      })
    },
    filters: {
      /**
       * 评论时间格式化
       * @param time
       * @return {*}
       */
      formatDate(time) {
        let date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    components: {
      Star,
      RatingSelect,
      Split
    }
  }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin"

  .ratings
    position absolute
    top 174px
    bottom 0
    left 0
    width 100%
    overflow hidden
    /*综合评论*/
    .overview
      display flex
      padding 18px 0
      .overview-left
        flex 0 0 137px
        padding 6px 0
        width 137px
        border-right 1px solid rgba(7, 17, 27, 0.1)
        text-align center
        @media only screen and (max-width 320px)  // 适配iphone5等小屏机，下同
          flex 0 0 120px
          width 120px
        .score
          margin-bottom 6px
          line-height 28px
          font-size 24px
          color rgb(255, 153, 0)
        .title
          margin-bottom 8px
          line-height 12px
          font-size 12px
          color rgb(7, 17, 27)
        .rank
          line-height 10px
          font-size 10px
          color rgb(147, 153, 159)
      .overview-right
        flex 1
        padding 6px 0 6px 24px
        @media only screen and (max-width 320px)
          padding-left 6px
        .score-wrapper
          margin-bottom 8px
          font-size 0
          .title
            display inline-block
            line-height 18px
            vertical-align top
            font-size 12px
            color rgb(7, 17, 27)
          .star
            display inline-block
            margin 0 12px
            vertical-align top
          .score
            display inline-block
            line-height 18px
            vertical-align top
            font-size 12px
            color rgb(255, 153, 0)
        .delivery-wrapper
          font-size 0
          .title
            line-height 18px
            font-size 12px
            color rgb(7, 17, 27)
          .delivery
            margin-left 12px
            font-size 12px
            color rgb(147, 153, 159)
    /*评论内容列表*/
    .ratings-wrapper
      padding 0 18px
      .rating-item
        display flex
        padding 18px 0
        border-1px(rgba(7, 17, 27, 0.1))
        .avatar
          flex 0 0 28px
          width 28px
          margin-right 12px
          img
            border-radius 50%
        .content
          position relative
          flex 1
          .name
            margin-bottom 4px
            line-height 12px
            font-size 10px
            color rgb(7, 17, 27)
          .star-wrapper
            margin-bottom 6px
            font-size 0
            .star
              display inline-block
              margin-right 6px
              vertical-align top
            .delivery
              display inline-block
              vertical-align top
              line-height 12px
              font-size 10px
              color rgb(147, 153, 159)
          .text
            margin-bottom 8px
            line-height 18px
            color rgb(7, 17, 27)
            font-size 12px
          .recommend
            line-height 16px
            font-size 0
            .icon-thumb_up, .item
              display inline-block
              margin 0 8px 4px 0
              font-size 9px
            .icon-thumb_up
              color rgb(0, 160, 220)
            .item
              padding 0 6px
              border 1px solid rgba(7, 17, 27, 0.1)
              border-radius 1px
              color rgb(147, 153, 159)
              background #fff
          .time
            position absolute
            top 0
            right 0
            line-height 12px
            font-size 10px
            color rgb(147, 153, 159)
</style>
