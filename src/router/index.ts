import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/goods'
  },
  {
    path: '/goods',
    name: 'goods',
    component: () => import(/* webpackChunkName: "goods" */ '../views/Goods')
  },
  {
    path: '/ratings',
    name: 'ratings',
    component: () =>
      import(/* webpackChunkName: "ratings" */ '../views/Ratings')
  },
  {
    path: '/seller',
    name: 'seller',
    component: () => import(/* webpackChunkName: "seller" */ '../views/Seller')
  }
]

export default new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
