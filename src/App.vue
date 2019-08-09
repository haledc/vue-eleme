<template>
  <div id="app">
    <Header :seller="seller" />
    <Tab />
    <router-view :seller="seller" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Tab from './components/Tab/index.vue'
import Header from './components/Header/index.vue'
import { urlParse } from './assets/helper'
import { Seller, SellerResponse } from '@/types'
import { AxiosInstance } from 'axios'

const ERR_OK = 0

@Component({
  components: {
    Tab,
    Header
  }
})
export default class App extends Vue {
  seller = {
    id: (() => {
      const queryParamObj = urlParse()
      return queryParamObj.id
    })()
  }

  $axios!: AxiosInstance

  created() {
    this.getSeller()
  }

  getSeller() {
    this.$axios
      .get('api/seller?id=' + this.seller.id)
      .then((res: SellerResponse) => {
        const { data } = res
        if (data.errno === ERR_OK) {
          this.seller = Object.assign({}, this.seller, data.data)
        }
      })
      .catch(e => console.log(e))
  }
}
</script>

<style lang="stylus"></style>
