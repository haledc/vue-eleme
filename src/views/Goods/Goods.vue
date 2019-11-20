<template>
  <div>
    <div class="goods">
      <!--菜单栏-->
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li
            v-for="(item, index) in goods"
            class="menu-item"
            :key="index"
            :class="{ current: currentIndex === index }"
            @click="selectMenu(index, $event)"
            ref="menuList"
          >
            <span class="text border-1px">
              <span
                v-show="item.type > 0"
                class="icon"
                :class="classMap[item.type]"
              ></span
              >{{ item.name }}
            </span>
          </li>
        </ul>
      </div>
      <!--食物栏-->
      <div class="foods-wrapper" ref="foodsWrapper">
        <ul>
          <li
            v-for="(item, index) in goods"
            :key="index"
            class="food-list"
            ref="foodList"
          >
            <!--食物菜单-->
            <h1 class="title">{{ item.name }}</h1>
            <!--食物条目-->
            <ul>
              <li
                v-for="(food, index) in item.foods"
                class="food-item border-1px"
                :key="index"
                @click="selectFood(food, $event)"
              >
                <div class="icon">
                  <img width="57" height="57" :src="food.icon" />
                </div>
                <div class="content">
                  <h2 class="name">{{ food.name }}</h2>
                  <p class="desc">{{ food.description }}</p>
                  <div class="extra">
                    <span class="count">月售{{ food.sellCount }}份</span
                    ><span>好评率{{ food.rating }}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{ food.price }}</span
                    ><span class="old" v-show="food.oldPrice"
                      >￥{{ food.oldPrice }}</span
                    >
                  </div>
                  <!--购物车加减控件-->
                  <div class="cartcontrol-wrapper">
                    <CartControl @add="addFood" :food="food" />
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <!--购物车-->
      <ShopCart
        :selectFoods="selectFoods"
        :deliveryPrice="seller.deliveryPrice"
        :minPrice="seller.minPrice"
        ref="shopCart"
      />
    </div>
    <!--食物详情页-->
    <Food @add="addFood" :food="selectedFood" ref="food" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import BScroll from 'better-scroll'
import ShopCart from '@/components/ShopCart'
import CartControl from '@/components/CartControl'
import Food from '@/components/Food'
import { ISeller, IGoods, IFood } from '@/types'
import { AxiosStatic, AxiosResponse } from 'axios'

const ERR_OK = 0

@Component({
  components: {
    Food,
    ShopCart,
    CartControl
  }
})
export default class Goods extends Vue {
  @Prop(Object) seller!: ISeller

  goods: IGoods[] = []
  listHeight: number[] = []
  scrollY: number = 0
  selectedFood: object = {}
  classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']

  menuScroll!: BScroll
  foodsScroll!: BScroll
  $refs!: {
    shopCart: ShopCart
    menuWrapper: HTMLElement
    menuList: HTMLLIElement[]
    foodsWrapper: HTMLElement
    foodList: HTMLLIElement[]
    food: Food
  }
  $axios!: AxiosStatic

  get currentIndex() {
    for (let i = 0; i < this.listHeight.length; i++) {
      const height1: number = this.listHeight[i]
      const height2: number = this.listHeight[i + 1]
      if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
        this._followScroll(i)
        return i
      }
    }
    return 0
  }

  get selectFoods() {
    const foods: IFood[] = []
    this.goods.forEach(good => {
      good.foods.forEach((food: IFood) => {
        if (food.count) {
          foods.push(food)
        }
      })
    })
    return foods
  }

  created() {
    this.getGoods()
  }

  getGoods() {
    this.$axios
      .get('/api/goods')
      .then((res: AxiosResponse) => {
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
      .catch(e => console.log(e))
  }

  selectMenu(index: number) {
    const el = this.$refs.foodList[index]
    this.foodsScroll.scrollToElement(el, 300)
  }

  addFood(event: Event) {
    this._drop(event.target as HTMLElement)
  }

  _drop(target: HTMLElement) {
    // 体验优化，异步执行下落动画（这样不会卡）
    this.$nextTick(() => {
      this.$refs.shopCart.drop(target)
    })
  }

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
    // 监听食物栏滚动事件, 并得到滚动时 Y 轴的实时数值
    this.foodsScroll.on('scroll', pos => {
      if (pos.y <= 0) {
        this.scrollY = Math.abs(pos.y - 1)
      }
    })
  }

  _calculateHeight() {
    const foodList = this.$refs.foodList
    let height = 0
    this.listHeight.push(height)
    for (const food of foodList) {
      height += food.clientHeight
      this.listHeight.push(height)
    }
  }

  selectFood(food: Food) {
    this.selectedFood = food
    // 调用子组件方法，使得 food 组件显示出来
    this.$refs.food.show()
  }

  _followScroll(index: number) {
    const menuList = this.$refs.menuList
    const el = menuList[index]
    this.menuScroll.scrollToElement(el, 300, 0, -100)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/mixins.scss';

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

        .cartcontrol-wrapper {
          position: absolute;
          right: 0;
          bottom: 12px;
        }
      }
    }
  }
}
</style>
