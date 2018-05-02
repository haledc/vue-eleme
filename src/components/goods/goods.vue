<template>
  <div>
    <div class="goods">
      <!--菜单栏-->
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li v-for="(item,index) in goods" class="menu-item" :class="{'current': currentIndex===index}"
              @click="selectMenu(index, $event)" ref="menuList">
            <span class="text border-1px">
              <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
            </span>
          </li>
        </ul>
      </div>
      <!--食物栏-->
      <div class="foods-wrapper" ref="foodsWrapper">
        <ul>
          <li v-for="item in goods" class="food-list border-1px" ref="foodList">
            <!--食物菜单-->
            <h1 class="title">{{item.name}}</h1>
            <!--食物条目-->
            <ul>
              <li v-for="food in item.foods" class="food-item" @click="selectFood(food, $event)">
                <div class="icon">
                  <img width="57" height="57" :src="food.icon">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span><span class="old"
                                                                  v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <!--购物车加减控件-->
                  <div class="cartcontrol-wrapper">
                    <cartcontrol @add="addFood" :food="food"></cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <!--购物车-->
      <shopcart :selectFoods="selectFoods" :deliveryPrice="seller.deliveryPrice"
                :minPrice="seller.minPrice" ref="shopcart"></shopcart>
    </div>
    <!--食物详情页-->
    <food @add="addFood" :food="selectedFood" ref="food"></food>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import Shopcart from 'components/shopcart/shopcart'
  import Cartcontrol from 'components/cartcontrol/cartcontrol'
  import Food from 'components/food/food'

  const ERR_OK = 0

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        goods: [],
        // 食物栏DOM高度集合
        listHeight: [],
        // 食物栏滚动初始Y轴位置
        scrollY: 0,
        // 选中的食物
        selectedFood: {},
        classMap: []
      }
    },
    computed: {
      /**
       * 当前索引（菜单索引，食物索引）
       * @returns {number}
       */
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i]
          let height2 = this.listHeight[i + 1]
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            this._followScroll(i)
            return i
          }
        }
        return 0
      },
      /**
       * 选中具体食物对象计算属性，并传递给购物车组件
       * @returns {Array}
       */
      selectFoods() {
        let foods = []
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
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

      this.$axios.get('/api/goods').then((response) => {
        response = response.data
        if (response.errno === ERR_OK) {
          this.goods = response.data
          // DOM更新之后再实例化BScroll对象
          this.$nextTick(() => {
            this._initScroll()
            this._calculateHeight()
          })
        }
      }).catch((e) => {
        console.log(e)
      })
    },
    methods: {
      selectMenu(index, event) {
        // 取消pc端的点击事件，不会导致连点2次，下同
        if (!event._constructed) {
          return
        }
        let foodList = this.$refs.foodList
        let el = foodList[index]
        this.foodsScroll.scrollToElement(el, 300)
      },
      addFood(target) {
        // target为子组件的传过来的dom对象
        this._drop(target)
      },
      /**
       * 调用子组件的抛落方法
       * @param target
       */
      _drop(target) {
        // 体验优化，异步执行下落动画(这样不会卡)
        this.$nextTick(() => {
          this.$refs.shopcart.drop(target)
        })
      },
      /**
       * 初始化滚动
       * @private
       */
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
        // 监听食物栏滚动事件, 并得到滚动时y轴的实时数值
        this.foodsScroll.on('scroll', (pos) => {
          if (pos.y <= 0) {
            this.scrollY = Math.abs(Math.round(pos.y))
          }
        })
      },
      /**
       * 食品栏高度集合
       * @private
       */
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
      /**
       * 选中食物
       * @param food
       * @param event
       */
      selectFood(food, event) {
        if (!event._constructed) {
          return
        }
        this.selectedFood = food
        // 调用子组件方法，使得food组件显示出来
        this.$refs.food.show()
      },
      /**
       * 滚动到指定菜单
       * @param index
       * @private
       */
      _followScroll(index) {
        let menuList = this.$refs.menuList
        let el = menuList[index]
        this.menuScroll.scrollToElement(el, 300, 0, -100)
      }
    },
    components: {
      Shopcart,
      Cartcontrol,
      Food
    }
  }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin"

  .goods
    display flex
    position absolute
    top 174px
    bottom 46px
    width 100%
    overflow hidden
    /*菜单栏*/
    .menu-wrapper
      // 等分 缩放 占位空间
      flex 0 0 80px
      width 80px
      background #f3f5f7
      .menu-item
        // 表格布局
        display table
        height 54px
        width 56px
        // 水平居中
        padding 0 12px
        line-height 14px
        // 活动样式
        &.current
          position relative
          z-index 10
          margin-top -1px
          background #fff
          font-weight 700
          .text
            border-none()
        .icon
          display inline-block
          vertical-align top
          width 12px
          height 12px
          margin-right 2px
          background-size 12px 12px
          background-repeat no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          display table-cell
          width 56px
          vertical-align middle
          border-1px(rgba(7, 17, 27, 0.1))
          font-size 12px
    /*食物*/
    .foods-wrapper
      flex 1
      .title
        padding-left 14px
        height 26px
        line-height 26px
        border-left 2px solid #d9dde1
        font-size 12px
        color rgb(147, 153, 159)
        background #f3f5f7
      .food-item
        display flex
        margin 18px
        padding-bottom 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom 0
        .icon
          flex 0 0 57px
          margin-right 10px
        .content
          flex 1
          .name
            margin 2px 0 8px 0
            height 14px
            line-height 14px
            font-size 14px
            color rgb(7, 17, 27)
          .desc, .extra
            line-height 10px
            font-size 10px
            color rgb(147, 153, 159)
          .desc
            margin-bottom 8px
            line-height 12px
          .extra
            .count
              margin-right 12px
          .price
            font-weight 700
            line-height 24px
            .now
              margin-right 8px
              font-size 14px
              color rgb(240, 20, 20)
            .old
              text-decoration line-through
              font-size 10px
              color rgb(147, 153, 159)

          .cartcontrol-wrapper
            position absolute
            right 0
            bottom 12px
</style>
