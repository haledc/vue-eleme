<template>
  <div>
    <v-header :seller="seller"/>
    <tab/>
    <keep-alive>
      <router-view :seller="seller"/>
    </keep-alive>
  </div>
</template>

<script>
  import VHeader from 'components/header/header'
  import Tab from 'components/tab/tab'
  import { urlParse } from 'common/js/util'

  const ERR_OK = 0

  export default {
    data() {
      return {
        seller: {
          // 立即执行函数获取id
          id: (() => {
            let queryParamObj = urlParse()
            return queryParamObj.id
          })()
        }
      }
    },
    created() {
      this.$axios.get('api/seller?id=' + this.seller.id)
        .then(res => {
          res = res.data
          if (res.errno === ERR_OK) {
            // 属性合并
            this.seller = Object.assign({}, this.seller, res.data)
          }
        })
        .catch(e => console.log(e))
    },
    components: {
      VHeader,
      Tab
    }
  }
</script>

<style lang="stylus" scoped>
</style>
