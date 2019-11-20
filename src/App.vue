<template>
  <div id="app">
    <Header :seller="seller" />
    <Tab />
    <KeepAlive>
      <RouterView :seller="seller" />
    </KeepAlive>
  </div>
</template>

<script>
import Header from './components/Header'
import Tab from './components/Tab'
import { urlParse } from './utils'

const ERR_OK = 0

export default {
  components: {
    Header,
    Tab
  },
  data() {
    return {
      seller: {
        id: (() => {
          let queryParamObj = urlParse()
          return queryParamObj.id
        })()
      }
    }
  },
  created() {
    this.getSeller()
  },
  methods: {
    // 获取 seller 数据
    getSeller() {
      this.$axios.get(`/api/seller?id=${this.seller.id}`).then(res => {
        const { data } = res
        if (data.errno === ERR_OK) {
          this.seller = Object.assign({}, this.seller, data.data)
        }
      })
    }
  }
}
</script>
