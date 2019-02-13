import { StoreProvider } from "../src";
import { TestStore, AnotherStore } from "./common";
import { mount } from "enzyme";
import React from "react";
import useStores from "../src/useStores";

describe("UseStores", () => {
  it("should inject single store", () => {
    const Component = () => {
      const [store] = useStores(TestStore);
      return (
        <span>{store.state.value}</span>
      );
    };

    const store = new TestStore(42);

    const wrapper = mount(
      <StoreProvider stores={[store]}>
        <Component />
      </StoreProvider>,
    );

    expect(wrapper.find("span").text()).toBe("42");
  });

  it("should inject multiple stores", () => {

    const Component = () => {
      const [store, another] = useStores(TestStore, AnotherStore);
      return (
        <div>
          <span id="test">{store.state.value}</span>
          <span id="another">{another.state.text}</span>
        </div>
      );
    };

    const store = new TestStore(42);

    const wrapper = mount(
      <StoreProvider stores={[store, new AnotherStore("haha")]}>
        <Component />
      </StoreProvider>,
    );

    expect(wrapper.find("#test").text()).toBe("42");
    expect(wrapper.find("#another").text()).toBe("haha");

  });

  it("should add a listener when mounted and remove one when unmounted", () => {
    const store = new TestStore(42);
    const another = new AnotherStore("haha");

    // tslint:disable
    expect(store["observers"]).toHaveLength(0);
    expect(another["observers"]).toHaveLength(0);

    const Component = () => {
      const [store, another] = useStores(TestStore, AnotherStore);
      return (
        <div>
          <span id="test">{store.state.value}</span>
          <span id="another">{another.state.text}</span>
        </div>
      );
    };

    const wrapper = mount(
      <StoreProvider stores={[store, another]}>
        <Component />
      </StoreProvider>,
    );

    expect(store["observers"]).toHaveLength(1);
    expect(another["observers"]).toHaveLength(1);


    wrapper.unmount();

    expect(store["observers"]).toHaveLength(0);
    expect(another["observers"]).toHaveLength(0);

  });

  const Component = () => {
    useStores(TestStore);
    return <div>mounted!</div>;
  };

  it("should report error when using a store that is not provided", () => {


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
