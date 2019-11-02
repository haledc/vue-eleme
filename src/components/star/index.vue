<template>
  <div class="star" :class="starType">
    <span
      v-for="(itemClass, index) in itemClasses"
      :key="index"
      class="star-item"
      :class="itemClass"
    ></span>
  </div>
</template>

<script>
const LENGTH = 5
const CLS_ON = 'on'
const CLS_HALF = 'half'
const CLS_OFF = 'off'

export default {
  props: {
    size: {
      type: Number,
      required: true
    },
    score: {
      type: Number,
      required: true
    }
  },
  computed: {
    starType() {
      return 'star-' + this.size
    },

    itemClasses() {
      let result = []
      let score = Math.floor(this.score * 2) / 2
      let hasDecimal = score % 1 !== 0
      let integer = Math.floor(score)
      for (let i = 0; i < integer; i++) {
        result.push(CLS_ON)
      }
      if (hasDecimal) {
        result.push(CLS_HALF)
      }
      while (result.length < LENGTH) {
        result.push(CLS_OFF)
      }
      return result
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/mixin.scss';

.star {
  font-size: 0;

  .star-item {
    display: inline-block;
    background-repeat: no-repeat;
  }

  &.star-48 {
    .star-item {
      width: 20px;
      height: 20px;
      // 每颗星星的间距
      margin-right: 22px;
      background-size: 20px 20px;

      // 最后一颗星星没有右间距
      &:last-child {
        margin-right: 0;
      }

      &.on {
        @include bg-image('star48_on');
      }

      &.half {
        @include bg-image('star48_half');
      }

      &.off {
        @include bg-image('star48_off');
      }
    }
  }

  &.star-36 {
    .star-item {
      width: 15px;
      height: 15px;
      // 每颗星星的间距
      margin-right: 6px;
      background-size: 15px 15px;

      &:last-child {
        margin-right: 0;
      }

      &.on {
        @include bg-image('star36_on');
      }

      &.half {
        @include bg-image('star36_half');
      }

      &.off {
        @include bg-image('star36_off');
      }
    }
  }

  &.star-24 {
    .star-item {
      width: 10px;
      height: 10px;
      // 每颗星星的间距
      margin-right: 3px;
      background-size: 10px 10px;

      &:last-child {
        margin-right: 0;
      }

      &.on {
        @include bg-image('star24_on');
      }

      &.half {
        @include bg-image('star24_half');
      }

      &.off {
        @include bg-image('star24_off');
      }
    }
  }
}
</style>
