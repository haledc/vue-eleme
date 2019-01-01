import { shallowMount } from '@vue/test-utils'
import RatingSelect from '../../src/components/RatingSelect'

describe('RatingSelect.vue', () => {
  it('测试Props', () => {
    const wrapper = shallowMount(RatingSelect, {
      propsData: {
        ratings: [1, 2, 3, 4, 5],
        selectType: 2,
        onlyContent: true,
        desc: { a: 'b' }
      }
    })
    expect(wrapper.vm.ratings).toEqual([1, 2, 3, 4, 5])
    expect(wrapper.vm.selectType).toEqual(2)
    expect(wrapper.vm.onlyContent).toBeTruthy()
    expect(wrapper.vm.desc).toEqual({ a: 'b' })
  })

  it('测试计算属性', () => {
    const wrapper = shallowMount(RatingSelect, {
      propsData: {
        ratings: [
          {
            rateType: 0
          },
          {
            rateType: 1
          },
          {
            rateType: 2
          }
        ],
        selectType: 2,
        onlyContent: true,
        desc: { a: 'b' }
      }
    })
    expect(wrapper.vm.positives).toEqual([{ rateType: 0 }])
    expect(wrapper.vm.negatives).toEqual([{ rateType: 1 }])
  })
})
