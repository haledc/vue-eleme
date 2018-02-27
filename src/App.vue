<template>
  <div>
    <v-header :seller="seller"></v-header>
    <tab></tab>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
  import VHeader from 'components/header/header'
  import Tab from 'components/tab/tab'
  import {urlParse} from 'common/js/util'

  const ERR_OK = 0

  export default {
    data() {
      return {
        seller: {
          id: (() => {
            let queryParam = urlParse()
            return queryParam.id
          })()
        }
      }
    },
    created() {
      this.$http.get('api/seller?id=' + this.seller.id).then((response) => {
        response = response.body
        if (response.errno === ERR_OK) {
          this.seller = Object.assign({}, this.seller, response.data)
        }
      })
    },
    components: {
      VHeader,
      Tab
    }
  }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
</style>
