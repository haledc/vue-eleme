import { shallowMount, createLocalVue } from "@vue/test-utils";
import axios from "axios";
import Ratings from "../../src/views/Ratings";

const localVue = createLocalVue();
localVue.prototype.$axios = axios;

describe("Ratings.vue", () => {
  test("测试Props", () => {
    const wrapper = shallowMount(Ratings, {
      propsData: {
        seller: { a: "b" },
      },
      localVue,
    });
    expect(wrapper.vm.seller).toEqual({ a: "b" });
  });

  test("测试方法：needShow", () => {
    const wrapper = shallowMount(Ratings, {
      propsData: {
        seller: { a: "b" },
      },
      localVue,
    });
    wrapper.setData({ selectType: 2 });
    const type = 2;
    const text = "";
    expect(wrapper.vm.needShow(type, text)).toBeFalsy();
  });
});
