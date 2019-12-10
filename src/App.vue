<template>
  <div id="app">
    <Header :seller="state.seller" />
    <Tab />
    <KeepAlive>
      <RouterView :seller="state.seller" />
    </KeepAlive>
  </div>
</template>

<script>
import { reactive } from '@vue/composition-api'

import Header from './components/Header'
import Tab from './components/Tab'
import { urlParse } from './utils'

const ERR_OK = 0

export default {
  components: {
    Header,
    Tab
  },
  setup(_, { root }) {
    const getId = () => {
      const queryParamObj = urlParse()
      return queryParamObj.id
    }

    const state = reactive({
      seller: {
        id: getId()
      }
    })

    const getSeller = () =>
      root.$axios.get(`/api/seller?id=${state.seller.id}`).then(res => {
        const { data } = res
        if (data.errno === ERR_OK) {
          state.seller = Object.assign({}, state.seller, data.data)
        }
      })

    getSeller()

    return {
      state
    }
  }
}
</script>
