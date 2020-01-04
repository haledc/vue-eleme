<template>
  <div class="rating-select">
    <!-- 评价类型 -->
    <div class="rating-type border-1px">
      <span
        class="block positive"
        :class="{ active: selectType === 2 }"
        @click="select(2)"
      >
        {{ desc.all }}
        <span class="count">
          {{ ratings.length }}
        </span>
      </span>
      <span
        class="block positive"
        :class="{ active: selectType === 0 }"
        @click="select(0)"
      >
        {{ desc.positive }}
        <span class="count">
          {{ positives.length }}
        </span>
      </span>
      <span
        class="block negative"
        :class="{ active: selectType === 1 }"
        @click="select(1)"
      >
        {{ desc.negative }}
        <span class="count">
          {{ negatives.length }}
        </span>
      </span>
    </div>

    <!-- 切换（是否只看有内容的评价） -->
    <div class="switch" :class="{ on: onlyContent }" @click="toggleContent">
      <span class="icon-check_circle"></span>
      <span class="text">
        只看有内容的评价
      </span>
    </div>
  </div>
</template>

<script>
import { computed } from '@vue/composition-api'
const POSITIVE = 0
const NEGATIVE = 1
const ALL = 2

export default {
  props: {
    ratings: {
      type: Array,
      default() {
        return []
      }
    },
    selectType: {
      type: Number,
      default: ALL
    },
    onlyContent: {
      type: Boolean,
      default: false
    },
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
  setup(props, { emit }) {
    const positives = computed(() => getTypeRate(POSITIVE))
    const negatives = computed(() => getTypeRate(NEGATIVE))

    function getTypeRate(type) {
      return props.ratings.filter(rating => rating.rateType === type)
    }

    function select(type) {
      emit('select', type)
    }

    function toggleContent() {
      emit('toggle')
    }

    return {
      positives,
      negatives,
      select,
      toggleContent
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/mixins.scss';

.rating-select {
  .rating-type {
    // 左右间隙需要用margin，不然会影响下边框线
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
