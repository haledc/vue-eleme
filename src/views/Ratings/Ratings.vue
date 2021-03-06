<template>
  <div ref="ratings" class="ratings">
    <div class="ratings-content">
      <!-- 综合评论 -->
      <div class="overview">
        <!-- 左边内容 -->
        <div class="overview-left">
          <h1 class="score">
            {{ seller.score }}
          </h1>
          <div class="title">
            综合评分
          </div>
          <div class="rank">高于周边商家{{ seller.rankRate }}%</div>
        </div>

        <!-- 右边内容 -->
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">
              服务态度
            </span>
            <Star
              v-if="seller.serviceScore"
              :size="36"
              :score="seller.serviceScore"
            />
            <span class="score">
              {{ seller.serviceScore }}
            </span>
          </div>
          <div class="score-wrapper">
            <span class="title">
              商品评分
            </span>
            <Star
              v-if="seller.foodScore"
              :size="36"
              :score="seller.foodScore"
            />
            <span class="score">
              {{ seller.foodScore }}
            </span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">
              送达时间
            </span>
            <span class="delivery"> {{ seller.deliveryTime }}分钟 </span>
          </div>
        </div>
      </div>

      <!-- 分割 -->
      <Split />

      <!-- 评论类型条 -->
      <RatingSelect
        :select-type="_state.selectType"
        :only-content="_state.onlyContent"
        :ratings="state.ratings"
        @select="selectRating"
        @toggle="toggleContent"
      />

      <!-- 评论内容列表 -->
      <div class="ratings-wrapper">
        <ul>
          <li
            v-for="(rating, index) in state.ratings"
            v-show="needShow(rating.rateType, rating.text)"
            :key="index"
            class="rating-item border-1px"
          >
            <div class="avatar">
              <img width="28" height="28" :src="rating.avatar" alt="avatar" />
            </div>
            <div class="content">
              <h1 class="name">
                {{ rating.username }}
              </h1>
              <div class="star-wrapper">
                <Star v-if="rating.score" :size="24" :score="rating.score" />
                <span v-show="rating.deliveryTime" class="delivery">
                  {{ rating.deliveryTime }}分钟送达
                </span>
              </div>
              <p class="text">
                {{ rating.text }}
              </p>

              <!-- 推荐标签 -->
              <div
                v-show="rating.recommend && rating.recommend.length"
                class="recommend"
              >
                <span class="icon-thumb_up"></span>
                <span v-for="item in rating.recommend" :key="item" class="item">
                  {{ item }}
                </span>
              </div>
              <div class="time">
                {{ rating.rateTime | formatRatingDate }}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from '@vue/composition-api'
import Star from '../../components/Star'
import RatingSelect from '../../components/RatingSelect'
import Split from '../../components/Split'
import { formatDate, createScroll, useRating } from '../../utils'

const ERR_OK = 0

export default {
  components: {
    Star,
    RatingSelect,
    Split
  },
  filters: {
    formatRatingDate(time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  props: {
    seller: {
      type: Object,
      required: true
    }
  },
  setup(props, { root, refs }) {
    const state = reactive({
      ratings: []
    })

    let scroll

    function getRatings() {
      root.$axios.get('/api/ratings').then(res => {
        const { data } = res
        if (data.errno === ERR_OK) {
          state.ratings = data.data
          root.$nextTick(() => {
            scroll = createScroll(refs.ratings, { click: true })
          })
        }
      })
    }

    getRatings()

    const { _state, needShow, selectRating, toggleContent } = useRating(
      root,
      scroll
    )

    return {
      state,
      _state,
      needShow,
      selectRating,
      toggleContent
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/mixins.scss';

.ratings {
  position: absolute;
  top: 174px;
  bottom: 0;
  left: 0;
  width: 100%;
  overflow: hidden;

  /* 综合评论 */
  .overview {
    display: flex;
    padding: 18px 0;

    .overview-left {
      flex: 0 0 137px;
      width: 137px;
      padding: 6px 0;
      border-right: 1px solid rgba(7, 17, 27, 0.1);
      text-align: center;

      // 适配iphone5等小屏机，下同
      @media only screen and (max-width: 320px) {
        flex: 0 0 110px;
        width: 110px;
      }

      .score {
        margin-bottom: 6px;
        line-height: 28px;
        font-size: 24px;
        color: rgb(255, 153, 0);
      }

      .title {
        margin-bottom: 8px;
        line-height: 12px;
        font-size: 12px;
        color: rgb(7, 17, 27);
      }

      .rank {
        line-height: 10px;
        font-size: 10px;
        color: rgb(147, 153, 159);
      }
    }

    .overview-right {
      flex: 1;
      padding: 6px 0 6px 24px;

      @media only screen and (max-width: 320px) {
        padding-left: 6px;
      }

      .score-wrapper {
        margin-bottom: 8px;
        font-size: 0;

        .title {
          display: inline-block;
          line-height: 18px;
          vertical-align: top;
          font-size: 12px;
          color: rgb(7, 17, 27);
        }

        .star {
          display: inline-block;
          margin: 0 12px;
          vertical-align: top;
        }

        .score {
          display: inline-block;
          line-height: 18px;
          vertical-align: top;
          font-size: 12px;
          color: rgb(255, 153, 0);
        }
      }

      .delivery-wrapper {
        font-size: 0;

        .title {
          line-height: 18px;
          font-size: 12px;
          color: rgb(7, 17, 27);
        }

        .delivery {
          margin-left: 12px;
          font-size: 12px;
          color: rgb(147, 153, 159);
        }
      }
    }
  }

  /* 评论内容列表 */
  .ratings-wrapper {
    padding: 0 18px;

    .rating-item {
      display: flex;
      padding: 18px 0;
      @include border-1px(rgba(7, 17, 27, 0.1));

      .avatar {
        flex: 0 0 28px;
        width: 28px;
        margin-right: 12px;

        img {
          border-radius: 50%;
        }
      }

      .content {
        position: relative;
        flex: 1;

        .name {
          margin-bottom: 4px;
          line-height: 12px;
          font-size: 10px;
          color: rgb(7, 17, 27);
        }

        .star-wrapper {
          margin-bottom: 6px;
          font-size: 0;

          .star {
            display: inline-block;
            margin-right: 6px;
            vertical-align: top;
          }

          .delivery {
            display: inline-block;
            vertical-align: top;
            line-height: 12px;
            font-size: 10px;
            color: rgb(147, 153, 159);
          }
        }

        .text {
          margin-bottom: 8px;
          line-height: 18px;
          color: rgb(7, 17, 27);
          font-size: 12px;
        }

        .recommend {
          line-height: 16px;
          font-size: 0;

          .icon-thumb_up,
          .item {
            display: inline-block;
            margin: 0 8px 4px 0;
            font-size: 9px;
          }

          .icon-thumb_up {
            color: rgb(0, 160, 220);
          }

          .item {
            padding: 0 6px;
            border: 1px solid rgba(7, 17, 27, 0.1);
            border-radius: 1px;
            color: rgb(147, 153, 159);
            background: #fff;
          }
        }

        .time {
          position: absolute;
          top: 0;
          right: 0;
          line-height: 12px;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }
      }
    }
  }
}
</style>
