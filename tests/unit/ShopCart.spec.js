import { shallowMount } from '@vue/test-utils'
import ShopCart from '../../src/components/ShopCart'

describe('ShopCart.vue', () => {
  it('测试Props', () => {
    const wrapper = shallowMount(ShopCart, {
      propsData: {
        selectFoods: [1, 2, 3, 4, 5],
        deliveryPrice: 10,
        minPrice: 20
      }
    })
    expect(wrapper.vm.selectFoods).toEqual([1, 2, 3, 4, 5])
    expect(wrapper.vm.deliveryPrice).toEqual(10)
    expect(wrapper.vm.minPrice).toEqual(20)
  })

  it('测试计算属性', () => {
    const wrapper = shallowMount(ShopCart, {
      propsData: {
        selectFoods: [
          {
            price: 10,
            count: 3
          },
          {
            price: 15,
            count: 2
          }
        ],
        deliveryPrice: 10,
        minPrice: 20
      }
    })
    wrapper.setData({ fold: false })
    expect(wrapper.vm.totalPrice).toEqual(60)
    expect(wrapper.vm.totalCount).toEqual(5)
    expect(wrapper.vm.payDesc).toEqual('去结算')
    expect(wrapper.vm.listShow).toBe(true)
  })
})
