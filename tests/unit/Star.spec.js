import { shallowMount } from '@vue/test-utils'
import Star from '../../src/components/Star'

describe('Star.vue', () => {
  it('测试props属性', () => {
    const wrapper = shallowMount(Star, {
      propsData: {
        size: 24,
        score: 4.2
      }
    })
    expect(wrapper.vm.size).toEqual(24)
    expect(wrapper.vm.score).toEqual(4.2)
  })

  it('测试计算属性', () => {
    const wrapper = shallowMount(Star, {
      propsData: {
        size: 24,
        score: 4.5
      }
    })
    expect(wrapper.vm.itemClasses).toEqual(['on', 'on', 'on', 'on', 'half'])
    expect(wrapper.vm.starType).toEqual('star-24')
  })
})
