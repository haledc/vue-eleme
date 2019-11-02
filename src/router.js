import Vue from 'vue'
import Router from 'vue-router'
import Goods from './views/Goods'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/goods'
    },
    {
      path: '/goods',
      name: 'goods',
      component: Goods
    },
    {
      path: '/ratings',
      name: 'ratings',
      component: () =>
        import(/* webpackChunkName: "ratings" */ './views/Ratings')
    },
    {
      path: '/seller',
      name: 'seller',
      component: () => import(/* webpackChunkName: "seller" */ './views/Seller')
    }
  ]
})
