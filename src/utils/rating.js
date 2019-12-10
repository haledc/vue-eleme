import { reactive } from '@vue/composition-api'
import { refreshScroll } from './util'

const ALL = 2

export function useRating(vm, scroll) {
  const _state = reactive({
    onlyContent: true,
    selectType: ALL
  })

  const needShow = (type, text) => {
    if (_state.onlyContent && !text) {
      return false
    }
    if (_state.selectType === ALL) {
      return true
    } else {
      return type === _state.selectType
    }
  }

  const selectRating = type => {
    _state.selectType = type
    vm.$nextTick(() => {
      refreshScroll(scroll)
    })
  }

  const toggleContent = () => {
    _state.onlyContent = !_state.onlyContent
    vm.$nextTick(() => {
      refreshScroll(scroll)
    })
  }

  return {
    // 插件：使用解构赋值不能响应？？
    // onlyContent: _state.onlyContent,
    // selectType: _state.selectType,
    _state,
    needShow,
    selectRating,
    toggleContent
  }
}
