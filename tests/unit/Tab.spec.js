import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Tab from '../../src/components/Tab'

describe('Tab.vue', () => {
  test('测试组件是否生效', () => {
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = new VueRouter()
    const wrapper = shallowMount(Tab, {
      localVue,
      router
    })
    expect(wrapper.contains('div')).toBeTruthy()
  })
})
