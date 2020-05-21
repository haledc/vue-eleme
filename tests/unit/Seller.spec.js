import { shallowMount } from "@vue/test-utils";
import Seller from "../../src/views/Seller";

describe("Seller.vue", () => {
  test("测试Props", () => {
    const wrapper = shallowMount(Seller, {
      propsData: {
        seller: { a: "b" },
      },
    });
    expect(wrapper.vm.seller).toEqual({ a: "b" });
  });

  test("测试计算属性", () => {
    const wrapper = shallowMount(Seller, {
      propsData: {
        seller: { a: "b" },
      },
    });
    wrapper.setData({ favorite: true });
    expect(wrapper.vm.favoriteText).toBe("已收藏");
  });
});
