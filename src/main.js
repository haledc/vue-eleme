import Vue from 'vue'
import App from './App'
// import VueResource from 'vue-resource'
import axios from 'axios'
import router from './router/index'

import 'common/stylus/index.styl'

// Vue.use(VueResource)
Vue.prototype.$axios = axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
