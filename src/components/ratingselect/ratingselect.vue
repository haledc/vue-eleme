<template>
  <div class="ratingselect">
    <!--评价类型-->
    <div class="rating-type border-1px">
      <span class="block positive" :class="{'active':selectType===2}" @click="select(2,$event)">
        {{desc.all}}<span class="count">{{ratings.length}}</span>
      </span>
      <span class="block positive" :class="{'active':selectType===0}" @click="select(0,$event)">
        {{desc.positive}}<span class="count">{{positives.length}}</span>
      </span>
      <span class="block negative" :class="{'active':selectType===1}" @click="select(1,$event)">
        {{desc.negative}}<span class="count">{{negatives.length}}</span>
      </span>
    </div>
    <!--切换（是否只看有内容的评价）-->
    <div class="switch" :class="{'on':onlyContent}" @click="toggleContent">
      <span class=" icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const POSITIVE = 0  // 正面评价
  const NEGATIVE = 1  // 负面评价
  const ALL = 2       // 全部评价

  export default {
    props: {
      ratings: {
        type: Array,
        default() {
          return []
        }
      },
      /**
       * 评价类型
       */
      selectType: {
        type: Number,
        default: ALL  // 默认是全部
      },
      /**
       * 是否只看有内容的评价
       */
      onlyContent: {
        type: Boolean,
        default: false
      },
      /**
       * 评价类型描述
       */
      desc: {
        type: Object,
        default() {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          }
        }
      }
    },
    methods: {
      /**
       * 选中
       * @param type
       * @param event
       */
      select(type, event) {
        if (!event._constructed) {
          return
        }
        this.$emit('select', type) // 给引用的父组件派发select事件，传入类型参数
      },
      /**
       * 切换
       * @param event
       */
      toggleContent(event) {
        if (!event._constructed) {
          return
        }
        this.$emit('toggle') // 给引用的父组件派发toggle事件
      }
    },
    computed: {
      positives() {
        return this.ratings.filter((rating) => {  // 筛选推荐评价
          return rating.rateType === POSITIVE
        })
      },
      negatives() {
        return this.ratings.filter((rating) => {  // 筛选吐槽评价
          return rating.rateType === NEGATIVE
        })
      }
    }
  }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin"

  .ratingselect
    .rating-type
      padding 18px 0 // 左右间隙需要用margin，不然会影响下边框线
      margin 0 18px
      border-1px(rgba(7, 17, 27, 0.1))
      font-size 0
      .block
        display inline-block
        padding 8px 12px
        line-height 16px
        margin-right 8px
        border-radius 1px
        font-size 12px
        color rgb(77, 85, 93)
        &.active
          color #fff
        .count
          margin-left 2px
          font-size 8px
        &.positive
          background rgba(0, 160, 220, 0.2)
          &.active
            background rgb(0, 160, 220)
        &.negative
          background rgba(77, 85, 93, 0.2)
          &.active
            background rgb(77, 85, 93)
    .switch
      padding 12px 18px
      line-height 24px
      border-bottom 1px solid rgba(7, 17, 27, 0.1)
      color rgb(147, 153, 159)
      font-size 0
      &.on
        .icon-check_circle
          color #00c850
      .icon-check_circle
        display inline-block
        vertical-align top
        margin-right 4px
        font-size 24px
      .text
        display inline-block
        vertical-align top
        font-size 12px
</style>
