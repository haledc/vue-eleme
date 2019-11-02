<template>
  <div>
    <div class="goods">
      <!-- 菜单栏 -->
      <div ref="menuWrapper" class="menu-wrapper">
        <ul>
          <li
            v-for="(item, index) in goods"
            :key="index"
            ref="menuList"
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
      <div ref="foodsWrapper" class="foods-wrapper">
        <ul>
          <li
            v-for="item in goods"
            :key="item.name"
            ref="foodList"
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
                    <span class="count"> 月售{{ food.sellCount }}份 </span
                    ><span> 好评率{{ food.rating }}% </span>
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
        ref="shopCart"
        :select-foods="selectFoods"
        :delivery-price="seller.deliveryPrice"
        :min-price="seller.minPrice"
      />
    </div>

    <!-- 食物详情页 -->
    <Food ref="food" :food="selectedFood" @add="addFood" />
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import ShopCart from '../../components/ShopCart'
import CartControl from '../../components/CartControl'
import Food from '../../components/Food'

const ERR_OK = 0

export default {
  components: {
    ShopCart,
    CartControl,
    Food
  },
  props: {
    seller: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0,
      selectedFood: {},
      classMap: []
    }
  },
  computed: {
    // 当前索引（菜单索引，食物索引）
    currentIndex() {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i
        }
      }
      return 0
    },

    // 选中具体食物对象计算属性，并传递给购物车组件
    selectFoods() {
      let foods = []
      this.goods.forEach(good => {
        good.foods.forEach(food => {
          if (food.count) {
            foods.push(food)
          }
        })
      })
      return foods
    }
  },
  created() {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    this.getGoods()
  },
  methods: {
    // 获取 goods 数据
    getGoods() {
      this.$axios.get('/api/goods').then(res => {
        const { data } = res
        if (data.errno === ERR_OK) {
          this.goods = data.data

          // DOM 更新之后再实例化 BScroll 对象
          this.$nextTick(() => {
            this._initScroll()
            this._calculateHeight()
          })
        }
      })
    },

    selectMenu(index) {
      let foodList = this.$refs.foodList
      let el = foodList[index]
      this.foodsScroll.scrollToElement(el, 300)
    },

    addFood(target) {
      // target 为子组件的传过来的 dom 对象
      this._drop(target)
    },

    // 调用子组件的抛落方法
    _drop(target) {
      // 体验优化，异步执行下落动画(这样不会卡)
      this.$nextTick(() => {
        this.$refs.shopCart.drop(target)
      })
    },

    // 初始化滚动
    _initScroll() {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true
      })
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        // 激活点击事件
        click: true,
        // 激活实时滚动位置
        probeType: 3
      })

      // 监听食物栏滚动事件, 并得到滚动时 y 轴的实时数值
      this.foodsScroll.on('scroll', pos => {
        if (pos.y <= 0) {
          // -1 点击“精选套装”，“小吃主食”和右边不匹配的 bug，是数值精度的误差
          // 也可修改食物菜单 title 的高度 (26 => 27) 来避免这个误差
          this.scrollY = Math.abs(pos.y - 1)
        }
      })
    },

    // 食品栏高度集合
    _calculateHeight() {
      let foodList = this.$refs.foodList
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },

    // 选中食物
    selectFood(food) {
      this.selectedFood = food
      // 调用子组件方法，使得 food 组件显示出来
      this.$refs.food.show()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/mixin.scss';

.goods {
  display: flex;
  position: absolute;
  top: 170px;
  bottom: 46px;
  width: 100%;
  overflow: hidden;

  /* 菜单栏 */
  .menu-wrapper {
    // 等分 缩放 占位空间
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
          @include border-none();
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
          @include bg-image('decrease_3');
        }

        &.discount {
          @include bg-image('discount_3');
        }

        &.guarantee {
          @include bg-image('guarantee_3');
        }

        &.invoice {
          @include bg-image('invoice_3');
        }

        &.special {
          @include bg-image('special_3');
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
        @include border-none();
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
