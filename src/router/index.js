import Vue from 'vue'
import Router from 'vue-router'
// import goods from 'components/goods/goods'
// import ratings from 'components/ratings/ratings'
// import seller from 'components/seller/seller'

// 懒路由
// const Goods = () => import('components/goods/goods')
// const Ratings = () => import('components/ratings/ratings')
// const Seller = () => import('components/seller/seller')

Vue.use(Router)     // 使用router

const routes = [
  {
    path: '/',
    redirect: '/goods'
  },
  {
    path: '/goods',
    component: () => import(/* webpackChunkName: "goods" */'components/goods/goods')
  },
  {
    path: '/ratings',
    component: () => import(/* webpackChunkName: "ratings" */'components/ratings/ratings')
  },
  {
    path: '/seller',
    component: () => import(/* webpackChunkName: "seller" */'components/seller/seller')
  }
]

export default new Router({
  // linkActiveClass: 'active',  // 可自定义active状态的class名称
  routes
})
