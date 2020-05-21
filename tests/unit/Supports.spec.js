import { shallowMount } from "@vue/test-utils";
import Supports from "../../src/components/Supports";

describe("Supports.vue", () => {
  test("测试Props", () => {
    const wrapper = shallowMount(Supports, {
      propsData: {
        supports: [1, 2, 3, 4, 5],
        size: 2,
      },
    });
    expect(wrapper.vm.supports).toEqual([1, 2, 3, 4, 5]);
    expect(wrapper.vm.size).toBe(2);
  });

  test("测试计算属性：classType", () => {
    const wrapper = shallowMount(Supports, {
      propsData: {
        supports: [1, 2, 3, 4, 5],
        size: 2,
      },
    });
    expect(wrapper.vm.classType).toBe("supports-2");
  });

  test("非响应数据: classMap", () => {
    const wrapper = shallowMount(Supports, {
      propsData: {
        supports: [1, 2, 3, 4, 5],
        size: 2,
      },
    });
    expect(wrapper.vm.classMap).toEqual([
      "decrease",
      "discount",
      "special",
      "invoice",
      "guarantee",
    ]);
  });
});
