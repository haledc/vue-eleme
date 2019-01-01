import { shallowMount } from '@vue/test-utils'
import Header from '../../src/components/Header'

describe('Header.vue', () => {
  it('测试组件是否生效', () => {
    const wrapper = shallowMount(Header)
    expect(wrapper.contains('div')).toBeTruthy()
  })

  it('测试props属性', () => {
    const wrapper = shallowMount(Header, {
      propsData: {
        seller: { test: 'testData' }
      }
    })
    expect(wrapper.vm.seller).toEqual({ test: 'testData' })
  })

  it('测试计算属性：supportsFirst', () => {
    const wrapper = shallowMount(Header, {
      propsData: {
        seller: {
          supports: ['a', 'b', 'c', 'd', 'e']
        }
      }
    })
    expect(wrapper.vm.supportsFirst).toEqual(['a'])
  })

  it('测试method :showDetail', () => {
    const wrapper = shallowMount(Header)
    wrapper.find('.bulletin-wrapper .bulletin-title').trigger('click')
    expect(wrapper.vm.detailShow).toEqual(true)
  })

  it('测试method :hideDetail', () => {
    const wrapper = shallowMount(Header)
    wrapper.find('.detail-close').trigger('click')
    expect(wrapper.vm.detailShow).toEqual(false)
  })
})
