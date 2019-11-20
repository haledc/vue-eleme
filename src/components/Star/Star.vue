<template>
  <div class="star" :class="starType">
    <span
      v-for="(itemClass, index) in itemClasses"
      :class="itemClass"
      class="star-item"
      :key="index"
    ></span>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

// 星星长度
const LENGTH = 5
// 星星状态
const CLS_ON = 'on'
const CLS_HALF = 'half'
const CLS_OFF = 'off'

@Component
export default class Star extends Vue {
  @Prop(Number) size!: number
  @Prop(Number) score!: number

  get starType() {
    return 'star-' + this.size
  }

  get itemClasses() {
    const result = []
    // 向下取整
    const score = Math.floor(this.score * 2) / 2
    // 是否有小数
    const hasDecimal = score % 1 !== 0
    // 整数
    const integer = Math.floor(score)
    for (let i = 0; i < integer; i++) {
      result.push(CLS_ON)
    }
    if (hasDecimal) {
      result.push(CLS_HALF)
    }
    // 加入数组
    while (result.length < LENGTH) {
      result.push(CLS_OFF)
    }
    return result
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/mixins.scss';

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
