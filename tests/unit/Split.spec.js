import { shallowMount } from '@vue/test-utils'
import Split from '../../src/components/Split'

describe('Split.vue', () => {
  it('测试组件是否生效', () => {
    const wrapper = shallowMount(Split)
    expect(wrapper.contains('div')).toBeTruthy()
  })
})
