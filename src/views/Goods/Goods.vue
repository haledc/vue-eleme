<template>
  <div>
    <div class="goods">
      <!-- 菜单栏 -->
      <div ref="menuWrapperRef" class="menu-wrapper">
        <ul>
          <li
            v-for="(item, index) in state.goods"
            :key="index"
            ref="menuListRef"
            class="menu-item"
            :class="{ current: currentIndex === index }"
            @click="selectMenu(index)"
          >
            <span class="text border-1px">
              <span
                v-show="item.type > 0"
                class="icon"
                :class="classMap[item.type]"
              ></span>
              {{ item.name }}
            </span>
          </li>
        </ul>
      </div>

      <!-- 食物栏 -->
      <div ref="foodsWrapperRef" class="foods-wrapper">
        <ul>
          <li
            v-for="item in state.goods"
            :key="item.name"
            ref="foodListRef"
            class="food-list"
          >
            <!-- 食物菜单 -->
            <h1 class="title">
              {{ item.name }}
            </h1>

            <!-- 食物条目 -->
            <ul>
              <li
                v-for="food in item.foods"
                :key="food.name"
                class="food-item border-1px"
                @click="selectFood(food)"
              >
                <div class="icon">
                  <img width="57" height="57" :src="food.icon" alt="icon" />
                </div>
                <div class="content">
                  <h2 class="name">
                    {{ food.name }}
                  </h2>
                  <p class="desc">
                    {{ food.description }}
                  </p>
                  <div class="extra">
                    <span class="count"> 月售{{ food.sellCount }}份 </span>
                    <span> 好评率{{ food.rating }}% </span>
                  </div>
                  <div class="price">
                    <span class="now"> ￥{{ food.price }} </span>
                    <span v-show="food.oldPrice" class="old">
                      ￥{{ food.oldPrice }}
                    </span>
                  </div>

                  <!-- 购物车加减控件 -->
                  <div class="cart-control-wrapper">
                    <CartControl :food="food" @add="addFood" />
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <!-- 购物车 -->
      <ShopCart
        ref="shopCartRef"
        :select-foods="selectFoods"
        :delivery-price="seller.deliveryPrice"
        :min-price="seller.minPrice"
      />
    </div>

    <!-- 食物详情页 -->
    <Food ref="foodRef" :food="state.selectedFood" @add="addFood" />
  </div>
</template>

<script>
import { reactive, computed, ref, nextTick, onMounted } from "vue";
import axios from "axios";
import { createScroll } from "../../util";
import ShopCart from "../../components/ShopCart";
import CartControl from "../../components/CartControl";
import Food from "../../components/Food";

const ERR_OK = 0;

export default {
  components: {
    ShopCart,
    CartControl,
    Food,
  },
  props: {
    seller: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const state = reactive({
      goods: [],
      listHeight: [],
      scrollY: 0,
      selectedFood: {},
      classMap: [],
    });

    const menuWrapperRef = ref(null);

    // TODO
    // ! ref with v-for together do not work properly in vue3-beta14
    const menuListRef = ref(null);
    const foodsWrapperRef = ref(null);
    const foodListRef = ref(null);
    const shopCartRef = ref(null);
    const foodRef = ref(null);

    const classMap = [
      "decrease",
      "discount",
      "special",
      "invoice",
      "guarantee",
    ];

    const currentIndex = computed(() => {
      for (let i = 0; i < state.listHeight.length; i++) {
        let height1 = state.listHeight[i];
        let height2 = state.listHeight[i + 1];
        if (!height2 || (state.scrollY >= height1 && state.scrollY < height2)) {
          return i;
        }
      }
      return 0;
    });

    const selectFoods = computed(() =>
      state.goods.flatMap((good) => good.foods.filter((food) => food.count > 0))
    );

    // eslint-disable-next-line
    let menuScroll, foodsScroll;

    function initScroll() {
      menuScroll = createScroll(menuWrapperRef.value, { click: true });
      foodsScroll = createScroll(foodsWrapperRef.value, {
        click: true,
        probeType: 3,
      });

      foodsScroll.on("scroll", (pos) => {
        if (pos.y <= 0) {
          state.scrollY = Math.abs(pos.y - 1);
        }
      });
    }

    onMounted(() => {
      initScroll();
    });

    function calculateHeight() {
      state.listHeight = foodList.reduce(
        (acc, food, index) => acc.concat(acc[index] + food.clientHeight),
        [0]
      );
    }

    function getGoods() {
      axios.get("/api/goods").then((res) => {
        const { data } = res;
        if (data.errno === ERR_OK) {
          state.goods = data.data;
          nextTick(() => {
            initScroll();
            calculateHeight();
          });
        }
      });
    }

    getGoods();

    function selectMenu(index) {
      // console.log("index", index);
      // console.log(foodListRef.value);
      // TODO
      let el = foodListRef.value[index];
      foodsScroll.scrollToElement(el.value, 300);
    }

    function drop(target) {
      nextTick(() => {
        shopCartRef.value.drop(target);
      });
    }

    function addFood(target) {
      drop(target);
    }

    function selectFood(food) {
      state.selectedFood = food;
      foodRef.value.show();
    }

    return {
      menuWrapperRef,
      menuListRef,
      foodsWrapperRef,
      foodListRef,
      shopCartRef,
      foodRef,
      state,
      classMap,
      currentIndex,
      selectFoods,
      selectMenu,
      addFood,
      selectFood,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/mixins.scss";

.goods {
  display: flex;
  position: absolute;
  top: 170px;
  bottom: 46px;
  width: 100%;
  overflow: hidden;

  /* 菜单栏 */
  .menu-wrapper {
    // 放大 缩小 占位
    flex: 0 0 80px;
    width: 80px;
    background: #f3f5f7;

    .menu-item {
      // 表格布局
      display: table;
      height: 54px;
      width: 56px;
      // 水平居中
      padding: 0 12px;
      line-height: 14px;

      // 活动样式
      &.current {
        position: relative;
        z-index: 10;
        margin-top: -1px;
        background: #fff;
        font-weight: 700;

        .text {
          @include border-none;
        }
      }

      .icon {
        display: inline-block;
        vertical-align: top;
        width: 12px;
        height: 12px;
        margin-right: 2px;
        background-size: 12px 12px;
        background-repeat: no-repeat;

        &.decrease {
          @include bg-image("decrease_3");
        }

        &.discount {
          @include bg-image("discount_3");
        }

        &.guarantee {
          @include bg-image("guarantee_3");
        }

        &.invoice {
          @include bg-image("invoice_3");
        }

        &.special {
          @include bg-image("special_3");
        }
      }

      .text {
        display: table-cell;
        width: 56px;
        vertical-align: middle;
        @include border-1px(rgba(7, 17, 27, 0.1));
        font-size: 12px;
      }
    }
  }

  /* 食物 */
  .foods-wrapper {
    flex: 1;

    .title {
      padding-left: 14px;
      height: 26px;
      line-height: 26px;
      border-left: 2px solid #d9dde1;
      font-size: 12px;
      color: rgb(147, 153, 159);
      background: #f3f5f7;
    }

    .food-item {
      display: flex;
      margin: 18px;
      padding-bottom: 18px;
      @include border-1px(rgba(7, 17, 27, 0.1));

      &:last-child {
        @include border-none;
        margin-bottom: 0;
      }

      .icon {
        flex: 0 0 57px;
        margin-right: 10px;
      }

      .content {
        flex: 1;

        .name {
          margin: 2px 0 8px 0;
          height: 14px;
          line-height: 14px;
          font-size: 14px;
          color: rgb(7, 17, 27);
        }

        .desc,
        .extra {
          line-height: 10px;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }

        .desc {
          margin-bottom: 8px;
          line-height: 12px;
        }

        .extra {
          .count {
            margin-right: 12px;
          }
        }

        .price {
          font-weight: 700;
          line-height: 24px;

          .now {
            margin-right: 8px;
            font-size: 14px;
            color: rgb(240, 20, 20);
          }

          .old {
            text-decoration: line-through;
            font-size: 10px;
            color: rgb(147, 153, 159);
          }
        }

        .cart-control-wrapper {
          position: absolute;
          right: 0;
          bottom: 12px;
        }
      }
    }
  }
}
</style>
