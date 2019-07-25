import { shallowMount } from '@vue/test-utils'
import Food from '../../src/components/Food'

describe('Food.vue', () => {
  test('测试Props', () => {
    const wrapper = shallowMount(Food, {
      propsData: {
        food: { test: 'testData' }
      }
    })
    expect(wrapper.vm.food).toEqual({ test: 'testData' })
  })

  test('测试方法: addFirst', () => {
    const wrapper = shallowMount(Food, {
      propsData: {
        food: {}
      }
    })
    wrapper.find('.buy').trigger('click')
    expect(wrapper.vm.food.count).toBe(1)
  })

  test('测试方法: needShow', () => {
    const wrapper = shallowMount(Food, {
      propsData: {
        food: {}
      }
    })
    wrapper.setData({ selectType: 2 })
    const type = 2
    const text = ''
    expect(wrapper.vm.needShow(type, text)).toBeFalsy()
  })

  test('测试方法: show', () => {
    const wrapper = shallowMount(Food, {
      propsData: {
        food: {}
      }
    })
    wrapper.vm.show()
    expect(wrapper.vm.showFlag).toBeTruthy()
    expect(wrapper.vm.selectType).toBe(2)
    expect(wrapper.vm.onlyContent).toBeTruthy()
  })

  test('测试方法: hide', () => {
    const wrapper = shallowMount(Food, {
      propsData: {
        food: {}
      }
    })
    wrapper.vm.hide()
    expect(wrapper.vm.showFlag).toBeFalsy()
  })

  test('测试方法: selectRating', () => {
    const wrapper = shallowMount(Food, {
      propsData: {
        food: {}
      }
    })
    wrapper.vm.selectRating(2)
    expect(wrapper.vm.selectType).toBe(2)
  })

  test('测试方法: toggleContent', () => {
    const wrapper = shallowMount(Food, {
      propsData: {
        food: {}
      }
    })
    wrapper.setData({ onlyContent: true })
    wrapper.vm.toggleContent()
    expect(wrapper.vm.onlyContent).toBeFalsy()
  })
})
