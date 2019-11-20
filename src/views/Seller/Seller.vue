<template>
  <div ref="seller" class="seller">
    <div class="seller-content">
      <!-- 综合描述 -->
      <div class="overview">
        <h1 class="title">
          {{ seller.name }}
        </h1>
        <div class="desc border-1px">
          <Star v-if="seller.score" :size="36" :score="seller.score" />
          <span class="text"> ({{ seller.ratingCount }}) </span>
          <span class="text"> 月售{{ seller.sellCount }}单 </span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress"> {{ seller.minPrice }} </span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress"> {{ seller.deliveryPrice }} </span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress"> {{ seller.deliveryTime }} </span>分钟
            </div>
          </li>
        </ul>
        <!-- 收藏按钮 -->
        <div class="favorite" @click="toggleFavorite">
          <span class="icon-favorite" :class="{ active: favorite }"></span>
          <span class="text">
            {{ favoriteText }}
          </span>
        </div>
      </div>
      <Split />
      <!-- 公告和活动 -->
      <div class="bulletin">
        <h1 class="title">
          公告与活动
        </h1>
        <div class="content-wrapper border-1px">
          <p class="content">
            {{ seller.bulletin }}
          </p>
        </div>
        <Supports
          v-if="seller.supports"
          :size="4"
          :supports="seller.supports"
        />
      </div>
      <Split />
      <!-- 商家实景 -->
      <div class="pics">
        <h1 class="title">
          商家实景
        </h1>
        <div ref="picWrapper" class="pic-wrapper">
          <ul ref="picList" class="pic-list">
            <li v-for="pic in seller.pics" :key="pic" class="pic-item">
              <img :src="pic" width="120" height="90" alt="pic" />
            </li>
          </ul>
        </div>
      </div>
      <Split />
      <!-- 商家信息 -->
      <div class="info">
        <h1 class="title border-1px">
          商家信息
        </h1>
        <ul>
          <li
            v-for="info in seller.infos"
            :key="info"
            class="info-item border-1px"
          >
            {{ info }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import Star from '../../components/Star'
import Split from '../../components/Split'
import Supports from '../../components/Supports'
import { saveToLocal, loadFromLocal } from '../../utils'

export default {
  components: {
    Star,
    Split,
    Supports
  },
  props: {
    seller: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      //  立即执行函数获取缓存，收藏默认为 false
      favorite: (() => {
        return loadFromLocal(this.seller.id, 'favorite', false)
      })()
    }
  },
  computed: {
    favoriteText() {
      return this.favorite ? '已收藏' : '收藏'
    }
  },
  watch: {
    // 监听 seller 的变化
    seller() {
      this.init()
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.$nextTick(() => {
        this._initScroll()
        this._initPics()
      })
    },

    // 切换收藏
    toggleFavorite() {
      this.favorite = !this.favorite
      // 把结果保存到缓存中
      saveToLocal(this.seller.id, 'favorite', this.favorite)
    },

    // 初始化纵向滚动
    _initScroll() {
      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.seller, {
          click: true
        })
      } else {
        this.scroll.refresh()
      }
    },

    // 初始化实景图片 横向滚动
    _initPics() {
      if (this.seller.pics) {
        let picWidth = 120
        let margin = 6
        // 计算图片 list 的总宽度
        let width = (picWidth + margin) * this.seller.pics.length - margin
        // 设置图片 list 宽度（list 的宽度大于 wrapper 的宽度才能滚动）
        this.$refs.picList.style.width = width + 'px'
        this.$nextTick(() => {
          if (!this.picScroll) {
            this.picScroll = new BScroll(this.$refs.picWrapper, {
              // 开启横向滚动，默认是 false
              scrollX: true,
              // 设置在横向滚动时保留原生的纵向滚动
              eventPassthrough: 'vertical'
            })
          } else {
            this.picScroll.refresh()
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/mixins.scss';

.seller {
  position: absolute;
  top: 174px;
  bottom: 0;
  left: 0;
  width: 100%;
  overflow: hidden;

  /* 综合描述 */
  .overview {
    position: relative;
    padding: 18px;

    .title {
      margin-bottom: 8px;
      line-height: 14px;
      color: rgb(7, 17, 27);
      font-size: 14px;
    }

    .desc {
      padding-bottom: 18px;
      @include border-1px(rgba(7, 17, 27, 0.1));
      font-size: 0;

      .star {
        display: inline-block;
        margin-right: 8px;
        vertical-align: top;
      }

      .text {
        display: inline-block;
        margin-right: 12px;
        line-height: 18px;
        vertical-align: top;
        font-size: 10px;
        color: rgb(77, 85, 93);
      }
    }

    .remark {
      display: flex;
      padding-top: 18px;

      .block {
        // flex 三等分
        flex: 1;
        text-align: center;
        border-right: 1px solid rgba(7, 17, 27, 0.1);

        &:last-child {
          border: none;
        }

        h2 {
          margin-bottom: 4px;
          line-height: 10px;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }

        .content {
          line-height: 24px;
          font-size: 10px;
          color: rgb(7, 17, 27);

          .stress {
            font-size: 24px;
          }
        }
      }
    }

    .favorite {
      position: absolute;
      // 限定宽度 切换时空间不变
      width: 50px;
      right: 11px;
      top: 18px;
      text-align: center;

      .icon-favorite {
        display: block;
        margin-bottom: 4px;
        line-height: 24px;
        font-size: 24px;
        color: #d4d6d9;

        &.active {
          color: rgb(240, 20, 20);
        }
      }

      .text {
        line-height: 10px;
        font-size: 10px;
        color: rgb(77, 85, 93);
      }
    }
  }

  /* 公告和活动 */
  .bulletin {
    padding: 18px 18px 0 18px;

    .title {
      margin-bottom: 8px;
      line-height: 14px;
      color: rgb(7, 17, 27);
      font-size: 14px;
    }

    .content-wrapper {
      padding: 0 12px 16px 12px;
      @include border-1px(rgba(7, 17, 27, 0.1));

      .content {
        line-height: 24px;
        font-size: 12px;
        color: rgb(240, 20, 20);
      }
    }
  }

  /* 商家实景 */
  .pics {
    padding: 18px;

    .title {
      margin-bottom: 12px;
      line-height: 14px;
      color: rgb(7, 17, 27);
      font-size: 14px;
    }

    .pic-wrapper {
      width: 100%;
      overflow: hidden;
      // 文本不会换行
      white-space: nowrap;

      .pic-list {
        font-size: 0;

        .pic-item {
          display: inline-block;
          margin-right: 6px;
          width: 120px;
          height: 90px;

          &:last-child {
            margin: 0;
          }
        }
      }
    }
  }

  /* 商家信息 */
  .info {
    padding: 18px 18px 0 18px;
    color: rgb(7, 17, 27);

    .title {
      padding-bottom: 12px;
      line-height: 14px;
      @include border-1px(rgba(7, 17, 27, 0.1));
      font-size: 14px;
    }

    .info-item {
      padding: 16px 12px;
      line-height: 16px;
      @include border-1px(rgba(7, 17, 27, 0.1));
      font-size: 12px;

      &:last-child {
        @include border-none;
      }
    }
  }
}
</style>
