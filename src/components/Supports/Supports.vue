<template>
  <ul v-if="supports" :class="classType">
    <li
      v-for="(item, index) in supports"
      :key="index"
      class="support-item border-1px"
    >
      <span class="icon" :class="classMap[supports[index].type]"></span>
      <span class="text">
        {{ supports[index].description }}
      </span>
    </li>
  </ul>
</template>

<script>
import { computed } from 'vue'
export default {
  props: {
    supports: {
      type: Array,
      required: true
    },
    size: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const classType = computed(() => `supports-${props.size}`)

    const classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']

    return {
      classType,
      classMap
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/mixins.scss';

.supports-4 {
  .support-item {
    padding: 16px 12px;
    @include border-1px(rgba(7, 17, 27, 0.1));
    font-size: 0;

    &:last-child {
      @include border-none;
    }

    .icon {
      display: inline-block;
      width: 16px;
      height: 16px;
      vertical-align: top;
      margin-right: 6px;
      background-size: 16px 16px;
      background-repeat: no-repeat;

      &.decrease {
        @include bg-image('decrease_4');
      }

      &.discount {
        @include bg-image('discount_4');
      }

      &.guarantee {
        @include bg-image('guarantee_4');
      }

      &.invoice {
        @include bg-image('invoice_4');
      }

      &.special {
        @include bg-image('special_4');
      }
    }

    .text {
      line-height: 16px;
      font-size: 12px;
      color: rgb(7, 17, 27);
    }
  }
}

.supports-2 {
  width: 80%;
  margin: 0 auto;

  .support-item {
    padding: 0 12px;
    margin-bottom: 12px;
    font-size: 0;

    &:last-child {
      margin-bottom: 0;
    }

    .icon {
      display: inline-block;
      width: 16px;
      height: 16px;
      vertical-align: top;
      margin-right: 6px;
      background-size: 16px 16px;
      background-repeat: no-repeat;

      &.decrease {
        @include bg-image('decrease_2');
      }

      &.discount {
        @include bg-image('discount_2');
      }

      &.guarantee {
        @include bg-image('guarantee_2');
      }

      &.invoice {
        @include bg-image('invoice_2');
      }

      &.special {
        @include bg-image('special_2');
      }
    }

    .text {
      line-height: 16px;
      font-size: 12px;
    }
  }
}

.supports-1 {
  .icon {
    display: inline-block;
    // 顶部对齐
    vertical-align: top;
    width: 12px;
    height: 12px;
    margin-right: 4px;
    background-size: 12px 12px;
    background-repeat: no-repeat;

    &.decrease {
      @include bg-image('decrease_1');
    }

    &.discount {
      @include bg-image('discount_1');
    }

    &.guarantee {
      @include bg-image('guarantee_1');
    }

    &.invoice {
      @include bg-image('invoice_1');
    }

    &.special {
      @include bg-image('special_1');
    }
  }

  .text {
    line-height: 12px;
    font-size: 10px;
  }
}
</style>
