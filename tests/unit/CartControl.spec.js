import { shallowMount } from '@vue/test-utils'
import CartControl from '../../src/components/CartControl'

describe('CartControl.vue', () => {
  test('测试Props', () => {
    const wrapper = shallowMount(CartControl, {
      propsData: {
        food: { test: 'testData' }
      }
    })
    expect(wrapper.vm.food).toEqual({ test: 'testData' })
  })

  test('测试方法：addCart，数量增加', () => {
    const wrapper = shallowMount(CartControl, {
      propsData: {
        food: {
          count: 1
        }
      }
    })
    wrapper.find('.cart-add').trigger('click')
    expect(wrapper.vm.food.count).toBe(2)
  })

  test('测试方法：addCart，数量由无变成1', () => {
    const wrapper = shallowMount(CartControl, {
      propsData: {
        food: {}
      }
    })
    wrapper.find('.cart-add').trigger('click')
    expect(wrapper.vm.food.count).toBe(1)
  })

  test('测试方法：decreaseCart，数量减少', () => {
    const wrapper = shallowMount(CartControl, {
      propsData: {
        food: {
          count: 10
        }
      }
    })
    wrapper.find('.cart-decrease').trigger('click')
    expect(wrapper.vm.food.count).toBe(9)
  })
})
