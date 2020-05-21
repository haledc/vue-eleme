import { shallowMount, createLocalVue } from "@vue/test-utils";
import axios from "axios";
import Goods from "../../src/views/Goods";

const localVue = createLocalVue();
localVue.prototype.$axios = axios;

describe("Goods.vue", () => {
  test("测试Props", () => {
    const wrapper = shallowMount(Goods, {
      propsData: {
        seller: { a: "b" },
      },
      localVue,
    });
    expect(wrapper.vm.seller).toEqual({ a: "b" });
  });

  test("测试计算属性", () => {
    const wrapper = shallowMount(Goods, {
      propsData: {
        seller: {},
      },
      localVue,
    });
    wrapper.setData({
      listHeight: [0, 5, 10, 15, 20],
      scrollY: 5,
      goods: [
        { foods: [{ count: 1 }, { count: 10 }] },
        { foods: [{ count: 2 }] },
      ],
    });
    expect(wrapper.vm.currentIndex).toBe(1);
    expect(wrapper.vm.selectFoods).toEqual([
      { count: 1 },
      { count: 10 },
      { count: 2 },
    ]);
  });
});
