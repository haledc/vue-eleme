import { reactive, nextTick } from 'vue'
import { refreshScroll } from '../util'

const ALL = 2

export function useRating(scroll) {
  const ratingState = reactive({
    onlyContent: true,
    selectType: ALL
  })

  const needShow = (type, text) => {
    if (ratingState.onlyContent && !text) {
      return false
    }
    if (ratingState.selectType === ALL) {
      return true
    } else {
      return type === ratingState.selectType
    }
  }

  const selectRating = type => {
    ratingState.selectType = type
    nextTick(() => {
      refreshScroll(scroll)
    })
  }

  const toggleContent = () => {
    ratingState.onlyContent = !ratingState.onlyContent
    nextTick(() => {
      refreshScroll(scroll)
    })
  }

  return {
    // 插件：使用解构赋值不能响应？？
    // onlyContent: ratingState.onlyContent,
    // selectType: ratingState.selectType,
    ratingState,
    needShow,
    selectRating,
    toggleContent
  }
}
