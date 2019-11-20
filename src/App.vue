<template>
  <div id="app">
    <Header :seller="seller" />
    <Tab />
    <router-view :seller="seller" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Tab from '@/components/Tab'
import Header from '@/components/Header'
import { urlParse } from '@/utils'
import { ISeller } from '@/types'
import { AxiosStatic, AxiosResponse } from 'axios'

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

  $axios!: AxiosStatic

  created() {
    this.getSeller()
  }

  getSeller() {
    this.$axios
      .get('api/seller?id=' + this.seller.id)
      .then((res: AxiosResponse) => {
        const { data } = res
        if (data.errno === ERR_OK) {
          this.seller = Object.assign({}, this.seller, data.data)
        }
      })
      .catch(error => console.log(error))
  }
}
</script>
