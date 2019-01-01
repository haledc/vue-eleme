import { shallowMount } from '@vue/test-utils'
import Food from '../../src/components/Food'

describe('Food.vue', () => {
  it('测试Props', () => {
    const wrapper = shallowMount(Food, {
      propsData: {
        food: { test: 'testData' }
      }
    })
    expect(wrapper.vm.food).toEqual({ test: 'testData' })
  })

  it('测试方法：addFirst', () => {
    const wrapper = shallowMount(Food, {
      propsData: {
        food: {}
      }
    })
    wrapper.find('.buy').trigger('click')
    expect(wrapper.vm.food.count).toEqual(1)
  })

  it('测试方法：needShow', () => {
    const wrapper = shallowMount(Food, {
      propsData: {
        food: {}
      }
    })
    wrapper.setData({ selectType: 2 })
    const type = 2
    const text = ''
    expect(wrapper.vm.needShow(type, text)).not.toBeTruthy()
  })
})
