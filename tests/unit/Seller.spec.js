import { shallowMount } from '@vue/test-utils'
import Seller from '../../src/views/Seller'

describe('Seller.vue', () => {
  it('测试Props', () => {
    const wrapper = shallowMount(Seller, {
      propsData: {
        seller: { a: 'b' }
      }
    })
    expect(wrapper.vm.seller).toEqual({ a: 'b' })
  })

  it('测试计算属性', () => {
    const wrapper = shallowMount(Seller, {
      propsData: {
        seller: { a: 'b' }
      }
    })
    wrapper.setData({ favorite: true })
    expect(wrapper.vm.favoriteText).toEqual('已收藏')
  })
})
