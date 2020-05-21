import { shallowMount } from "@vue/test-utils";
import ShopCart from "../../src/components/ShopCart";

describe("ShopCart.vue", () => {
  test("测试Props", () => {
    const wrapper = shallowMount(ShopCart, {
      propsData: {
        selectFoods: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
        deliveryPrice: 10,
        minPrice: 20,
      },
    });
    expect(wrapper.vm.selectFoods).toEqual([
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 },
    ]);
    expect(wrapper.vm.deliveryPrice).toBe(10);
    expect(wrapper.vm.minPrice).toBe(20);
  });

  test("测试计算属性", () => {
    const wrapper = shallowMount(ShopCart, {
      propsData: {
        selectFoods: [
          {
            price: 10,
            count: 3,
          },
          {
            price: 15,
            count: 2,
          },
        ],
        deliveryPrice: 10,
        minPrice: 20,
      },
    });
    wrapper.setData({ fold: false });
    expect(wrapper.vm.totalPrice).toBe(60);
    expect(wrapper.vm.totalCount).toBe(5);
    expect(wrapper.vm.payDesc).toBe("去结算");
    expect(wrapper.vm.listShow).toBeTruthy();
  });
});
