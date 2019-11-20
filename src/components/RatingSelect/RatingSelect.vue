<template>
  <div class="ratingselect">
    <!--评价类型-->
    <div class="rating-type border-1px">
      <span
        class="block positive"
        :class="{ active: selectType === 2 }"
        @click="select(2, $event)"
      >
        {{ desc.all }}<span class="count">{{ ratings.length }}</span>
      </span>
      <span
        class="block positive"
        :class="{ active: selectType === 0 }"
        @click="select(0, $event)"
      >
        {{ desc.positive }}
        <span class="count">{{ positives.length }}</span>
      </span>
      <span
        class="block negative"
        :class="{ active: selectType === 1 }"
        @click="select(1, $event)"
      >
        {{ desc.negative }}<span class="count">{{ negatives.length }}</span>
      </span>
    </div>
    <!--切换（是否只看有内容的评价）-->
    <div class="switch" :class="{ on: onlyContent }" @click="toggleContent">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { IFoodRating, IRatings } from '@/types'

// 正面评价
const POSITIVE = 0
// 负面评价
const NEGATIVE = 1
// 全部评价
const ALL = 2

const descDefault = {
  all: '全部',
  positive: '满意',
  negative: '不满意'
}

@Component
export default class RatingSelect extends Vue {
  @Prop({ default: () => [] }) ratings!: (IFoodRating | IRatings)[]
  @Prop({ default: ALL }) selectType!: number
  @Prop({ default: false }) onlyContent!: boolean
  @Prop({ default: () => descDefault }) desc!: object

  get positives() {
    // 筛选推荐评价
    return this.ratings.filter(rating => {
      return rating.rateType === POSITIVE
    })
  }

  get negatives() {
    // 筛选吐槽评价
    return this.ratings.filter(rating => {
      return rating.rateType === NEGATIVE
    })
  }

  @Emit('select')
  select(type: number) {}

  @Emit('toggle')
  toggleContent() {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/mixins.scss';

.ratingselect {
  .rating-type {
    // 左右间隙需要用 margin，不然会影响下边框线
    padding: 18px 0;
    margin: 0 18px;
    @include border-1px(rgba(7, 17, 27, 0.1));
    font-size: 0;

    .block {
      display: inline-block;
      padding: 8px 12px;
      line-height: 16px;
      margin-right: 8px;
      border-radius: 1px;
      font-size: 12px;
      color: rgb(77, 85, 93);

      &.active {
        color: #fff;
      }

      .count {
        margin-left: 2px;
        font-size: 8px;
      }

      &.positive {
        background: rgba(0, 160, 220, 0.2);

        &.active {
          background: rgb(0, 160, 220);
        }
      }

      &.negative {
        background: rgba(77, 85, 93, 0.2);

        &.active {
          background: rgb(77, 85, 93);
        }
      }
    }
  }

  .switch {
    padding: 12px 18px;
    line-height: 24px;
    border-bottom: 1px solid rgba(7, 17, 27, 0.1);
    color: rgb(147, 153, 159);
    font-size: 0;

    &.on {
      .icon-check_circle {
        color: #00c850;
      }
    }

    .icon-check_circle {
      display: inline-block;
      vertical-align: top;
      margin-right: 4px;
      font-size: 24px;
    }

    .text {
      display: inline-block;
      vertical-align: top;
      font-size: 12px;
    }
  }
}
</style>
