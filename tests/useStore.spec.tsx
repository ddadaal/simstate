import { TestStore } from "./common";
import { mount } from "enzyme";
import { useStore, StoreProvider } from "../src";
import React from "react";

describe("UseStore", () => {

  const Component = () => {
    const store = useStore(TestStore);
    return (
      <span>{store.state.value}</span>
    );
  };

  it("should render with current store state", () => {
    const store = new TestStore(42);

    const wrapper = mount(
      <StoreProvider stores={[store]}>
        <Component />
      </StoreProvider>,
    );

    expect(wrapper.find("span").text()).toBe("42");
  });

  it("should add a listener when mounted and remove one when unmounted", () => {
    const store = new TestStore(42);

    // tslint:disable-next-line
    expect(store["observers"]).toHaveLength(0);

    const wrapper = mount(
      <StoreProvider stores={[store]}>
        <Component />
      </StoreProvider>,
    );

    // tslint:disable-next-line
    expect(store["observers"]).toHaveLength(1);

    wrapper.unmount();

    // tslint:disable-next-line
    expect(store["observers"]).toHaveLength(0);

  });

  it("should report error when using a store that is not provided", () => {
    const Component = () => {
      useStore(TestStore);
      return <div>mounted!</div>;
    };

    expect(() => mount(
      <StoreProvider stores={[]}>
        <Component />
      </StoreProvider>,
    )).toThrowError();
  });

  it("should report error with no StoreProvider", () => {
    expect(() => mount(<Component />)).toThrowError();
  });
});
