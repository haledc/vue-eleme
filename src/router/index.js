import { createRouter, createWebHistory } from 'vue-router'
import Goods from '../views/Goods'

const routes = [
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
      import(/* webpackChunkName: "ratings" */ '../views/Ratings')
  },
  {
    path: '/seller',
    name: 'seller',
    component: () => import(/* webpackChunkName: "seller" */ '../views/Seller')
  }
]

export default createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
