import { shallowMount } from '@vue/test-utils'
import Supports from '../../src/components/Supports'

describe('Supports.vue', () => {
  it('测试Props', () => {
    const wrapper = shallowMount(Supports, {
      propsData: {
        supports: [1, 2, 3, 4, 5],
        size: 2
      }
    })
    expect(wrapper.vm.supports).toEqual([1, 2, 3, 4, 5])
    expect(wrapper.vm.size).toEqual(2)
  })

  it('测试计算属性：classType', () => {
    const wrapper = shallowMount(Supports, {
      propsData: {
        supports: [1, 2, 3, 4, 5],
        size: 2
      }
    })
    expect(wrapper.vm.classType).toEqual('supports-2')
  })
})
