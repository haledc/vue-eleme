<template>
  <div class="header">
    <!-- 文本内容 -->
    <div class="content-wrapper">
      <!-- 左边大图 -->
      <div class="avatar">
        <img width="64" height="64" :src="seller.avatar" alt="left-img" />
      </div>

      <!-- 右边内容 -->
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">
            {{ seller.name }}
          </span>
        </div>
        <div class="description">
          {{ seller.description }}/{{ seller.deliveryTime }}分钟送达
        </div>
        <Supports v-if="seller.supports" :size="1" :supports="supportsFirst" />
      </div>

      <!-- 优惠信息数 -->
      <div v-if="seller.supports" class="support-count" @click="showDetail">
        <span class="count"> {{ seller.supports.length }}个 </span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>

    <!-- 公告栏 -->
    <div class="bulletin-wrapper" @click="showDetail">
      <span class="bulletin-title"></span
      ><span class="bulletin-text">
        {{ seller.bulletin }}
      </span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>

    <!-- 背景图片 -->
    <div class="background">
      <img :src="seller.avatar" width="100%" height="100%" alt="avatar-img" />
    </div>

    <!-- 详情弹层 -->
    <Transition name="fade">
      <div v-show="detailShow" class="detail">
        <!-- 内容 -->
        <div class="detail-wrapper clearfix">
          <div class="detail-main">
            <h1 class="name">
              {{ seller.name }}
            </h1>
            <div class="star-wrapper">
              <Star v-if="seller.score" :size="48" :score="seller.score" />
            </div>
            <div class="title">
              <div class="line"></div>
              <div class="text">
                优惠信息
              </div>
              <div class="line"></div>
            </div>
            <Supports
              v-if="seller.supports"
              :size="2"
              :supports="seller.supports"
            />
            <div class="title">
              <div class="line"></div>
              <div class="text">
                商家公告
              </div>
              <div class="line"></div>
            </div>
            <div class="bulletin">
              <p class="content">
                {{ seller.bulletin }}
              </p>
            </div>
          </div>
        </div>
        <!-- 关闭按钮 -->
        <div class="detail-close" @click="hideDetail">
          <i class="icon-close"></i>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import Star from '../Star'
import Supports from '../Supports'

export default {
  components: {
    Star,
    Supports
  },
  props: {
    seller: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      detailShow: false,
      classMap: []
    }
  },
  computed: {
    supportsFirst() {
      return this.seller.supports.slice(0, 1)
    }
  },
  methods: {
    showDetail() {
      this.detailShow = true
    },

    hideDetail() {
      this.detailShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/mixin.scss';

.header {
  position: relative;
  color: #fff;
  overflow: hidden;
  background: rgba(7, 17, 27, 0.5);

  /* 文本内容 */
  .content-wrapper {
    position: relative;
    padding: 24px 12px 18px 24px;
    font-size: 0;

    /* 左边大图 */
    .avatar {
      display: inline-block;
      vertical-align: top;

      img {
        border-radius: 2px;
      }
    }

    /* 右边文本 */
    .content {
      display: inline-block;
      margin-left: 16px;

      .title {
        margin: 2px 0 8px 0;

        .brand {
          display: inline-block;
          // 竖直方向顶部对齐
          vertical-align: top;
          width: 30px;
          height: 18px;
          @include bg-image('brand');
          background-size: 30px 18px;
          background-repeat: no-repeat;
        }

        .name {
          margin-left: 6px;
          font-size: 16px;
          line-height: 18px;
          font-weight: bold;
        }
      }

      .description {
        margin-bottom: 10px;
        line-height: 12px;
        font-size: 12px;
      }
    }

    /* 优惠信息数 */
    .support-count {
      position: absolute;
      right: 12px;
      bottom: 14px;
      padding: 0 8px;
      height: 24px;
      line-height: 24px;
      border-radius: 14px;
      background: rgba(0, 0, 0, 0.2);
      text-align: center;

      .count {
        vertical-align: top;
        font-size: 10px;
      }

      .icon-keyboard_arrow_right {
        margin-left: 2px;
        line-height: 24px;
        font-size: 10px;
      }
    }
  }

  /* 公告栏 */
  .bulletin-wrapper {
    position: relative;
    height: 24px;
    line-height: 28px;
    padding: 0 22px 0 12px;
    // 文本不换行
    white-space: nowrap;
    // 溢出隐藏
    overflow: hidden;
    // 文字溢出显示省略号
    text-overflow: ellipsis;
    background: rgba(7, 17, 27, 0.2);

    .bulletin-title {
      display: inline-block;
      vertical-align: top;
      margin-top: 7px;
      width: 22px;
      height: 12px;
      @include bg-image('bulletin');
      background-size: 22px 12px;
      background-repeat: no-repeat;
    }

    .bulletin-text {
      vertical-align: top;
      margin: 0 4px;
      font-size: 10px;
    }

    .icon-keyboard_arrow_right {
      position: absolute;
      font-size: 10px;
      right: 12px;
      top: 8px;
    }
  }

  /* 背景图片 */
  .background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    filter: blur(10px);
  }

  /* 滤镜：模糊（像素） */
  /* 详情弹层 */
  .detail {
    // fixed布局
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: 100%;
    overflow: auto;
    // 模糊 （苹果手机才能看到效果）
    backdrop-filter: blur(10px);
    background: rgba(7, 17, 27, 0.8);

    &.fade-enter-active,
    &.fade-leave-active {
      transition: all 0.5s;
    }

    &.fade-enter,
    &.fade-leave-to {
      opacity: 0;
      background: rgba(7, 17, 27, 0);
    }

    .detail-wrapper {
      min-height: 100%;
      width: 100%;

      .detail-main {
        margin-top: 64px;
        // 用padding不会盖住最下面的X
        padding-bottom: 64px;

        .name {
          line-height: 16px;
          text-align: center;
          font-size: 16px;
          font-weight: 700px;
        }

        .star-wrapper {
          margin-top: 18px;
          padding: 2px 0;
          text-align: center;
        }

        .title {
          // flex布局
          display: flex;
          width: 80%;
          margin: 28px auto 24px;

          .line {
            flex: 1;
            position: relative;
            top: -6px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          }

          .text {
            padding: 0 12px;
            font-weight: 700;
            font-size: 14px;
          }
        }

        .bulletin {
          width: 80%;
          margin: 0 auto;

          .content {
            padding: 0 12px;
            line-height: 24px;
            font-size: 12px;
          }
        }
      }
    }

    .detail-close {
      position: relative;
      width: 32px;
      height: 32px;
      margin: -64px auto 0 auto;
      clear: both;
      font-size: 32px;
    }
  }
}
</style>
