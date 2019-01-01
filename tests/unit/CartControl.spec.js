import { shallowMount } from '@vue/test-utils'
import CartControl from '../../src/components/CartControl'

describe('CartControl.vue', () => {
  it('测试Props', () => {
    const wrapper = shallowMount(CartControl, {
      propsData: {
        food: { test: 'testData' }
      }
    })
    expect(wrapper.vm.food).toEqual({ test: 'testData' })
  })

  it('测试方法：addCart-1', () => {
    const wrapper = shallowMount(CartControl, {
      propsData: {
        food: {
          count: 1
        }
      }
    })
    wrapper.find('.cart-add').trigger('click')
    expect(wrapper.vm.food.count).toEqual(2)
  })

  it('测试方法：addCart-2', () => {
    const wrapper = shallowMount(CartControl, {
      propsData: {
        food: {}
      }
    })
    wrapper.find('.cart-add').trigger('click')
    expect(wrapper.vm.food.count).toEqual(1)
  })

  it('测试方法：decreaseCart', () => {
    const wrapper = shallowMount(CartControl, {
      propsData: {
        food: {
          count: 10
        }
      }
    })
    wrapper.find('.cart-decrease').trigger('click')
    expect(wrapper.vm.food.count).toEqual(9)
  })
})
