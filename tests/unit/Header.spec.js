import { shallowMount } from '@vue/test-utils'
import Header from '../../src/components/Header'

describe('Header.vue', () => {
  test('测试组件是否生效', () => {
    const wrapper = shallowMount(Header)
    expect(wrapper.contains('div')).toBeTruthy()
  })

  test('测试props属性', () => {
    const wrapper = shallowMount(Header, {
      propsData: {
        seller: { test: 'testData' }
      }
    })
    expect(wrapper.vm.seller).toEqual({ test: 'testData' })
  })

  test('测试计算属性：supportsFirst', () => {
    const wrapper = shallowMount(Header, {
      propsData: {
        seller: {
          supports: ['a', 'b', 'c', 'd', 'e']
        }
      }
    })
    expect(wrapper.vm.supportsFirst).toEqual(['a'])
  })

  test('测试method: showDetail', () => {
    const wrapper = shallowMount(Header)
    wrapper.find('.bulletin-wrapper .bulletin-title').trigger('click')
    expect(wrapper.vm.detailShow).toBeTruthy()
  })

  test('测试method: hideDetail', () => {
    const wrapper = shallowMount(Header)
    wrapper.find('.detail-close').trigger('click')
    expect(wrapper.vm.detailShow).toBeFalsy()
  })
})
