import { shallowMount } from '@vue/test-utils'
import Star from '../../src/components/Star'

describe('Star.vue', () => {
  test('测试props属性', () => {
    const wrapper = shallowMount(Star, {
      propsData: {
        size: 24,
        score: 4.2
      }
    })
    expect(wrapper.vm.size).toBe(24)
    expect(wrapper.vm.score).toBe(4.2)
  })

  test('测试计算属性', () => {
    const wrapper = shallowMount(Star, {
      propsData: {
        size: 24,
        score: 4.5
      }
    })
    expect(wrapper.vm.itemClasses).toEqual(['on', 'on', 'on', 'on', 'half'])
    expect(wrapper.vm.starType).toBe('star-24')
  })
})
