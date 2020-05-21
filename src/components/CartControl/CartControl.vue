<template>
  <div class="cart-control">
    <!-- 减少购买数量按钮 -->
    <Transition name="move">
      <div
        v-show="food.count > 0"
        class="cart-decrease"
        @click.stop.prevent="decreaseCart"
      >
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </Transition>

    <!-- 购买的数量 -->
    <div v-show="food.count > 0" class="cart-count">
      {{ food.count }}
    </div>

    <!-- 增加购买数量按钮 -->
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
  </div>
</template>

<script>
export default {
  props: {
    food: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    function addCart(event) {
      props.food.count++;
      emit("add", event.target);
    }

    function decreaseCart() {
      if (props.food.count) {
        props.food.count--;
      }
    }

    return {
      addCart,
      decreaseCart,
    };
  },
};
</script>

<style lang="scss" scoped>
.cart-control {
  font-size: 0;

  .cart-decrease {
    display: inline-block;
    // 增加点击区域范围
    padding: 6px;

    .inner {
      display: inline-block;
      line-height: 24px;
      font-size: 24px;
      color: rgb(0, 160, 220);
      transition: all 0.4s linear;
    }

    // 进来阶段，离开阶段（时间一样可写一起）
    &.move-enter-active,
    &.move-leave-active {
      transition: all 0.4s linear;
    }

    // 进来开始，离开结束（初始和结束）
    &.move-enter,
    &.move-leave-to {
      // 透明状态
      opacity: 0;
      // x轴移动前位置， 3d硬件加速
      transform: translate3d(24px, 0, 0);

      .inner {
        // 角度
        transform: rotate(180deg);
      }
    }
  }

  .cart-count {
    display: inline-block;
    vertical-align: top;
    width: 12px;
    padding-top: 6px;
    line-height: 24px;
    text-align: center;
    font-size: 10px;
    color: rgb(147, 153, 159);
  }

  .cart-add {
    display: inline-block;
    // 增加点击区域范围
    padding: 6px;
    line-height: 24px;
    font-size: 24px;
    color: rgb(0, 160, 220);
  }
}
</style>
