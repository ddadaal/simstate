import { TestStore } from "./common";
import React from "react";
import { StoreConsumer } from "..";
import { mount } from "enzyme";
import StoreProvider from "../StoreProvider";

describe("Render props", () => {

  const Component = () => (
    <StoreConsumer storeTypes={[TestStore]}>
      {({ useStore }) => {
        const store = useStore(TestStore);
        return (
          <span>{store.state.value}</span>
        );
      }}
    </StoreConsumer>
  );

  it("should render with current store state", () => {
    const store = new TestStore(42);

    const wrapper = mount(
      <StoreProvider stores={[store]}>
        <Component />
      </StoreProvider>
    );

    expect(wrapper.find("span").text()).toBe("42");
  });

  it("should update the number after setState", async () => {
    const store = new TestStore(42);

    const wrapper = mount(
      <StoreProvider stores={[store]}>
        <Component />
      </StoreProvider>
    );

    expect(wrapper.find("span").text()).toBe("42");

    await store.increment();

    expect(wrapper.find("span").text()).toBe("43");

    await store.setState(({ value }) => ({ value: value + 1 }));

    expect(wrapper.find("span").text()).toBe("44");

  });

  it("should add a listener when mounted and remove one when unmounted", () => {

    const store = new TestStore(42);

    expect(store["observers"]).toHaveLength(0);

    const wrapper = mount(
      <StoreProvider stores={[store]}>
        <Component />
      </StoreProvider>
    );

    expect(store["observers"]).toHaveLength(1);

    wrapper.unmount();

    expect(store["observers"]).toHaveLength(0);


  });


  it("should report error when using a store that is not specified", () => {
    console.error = () => { };

    const Component = () => (
      <StoreConsumer storeTypes={[]}>
        {({ useStore }) => {
          useStore(TestStore);
          return "never reach here!";
        }}
      </StoreConsumer>
    )

    // provided but not specified
    expect(() => mount(
      <StoreProvider stores={[new TestStore(42)]}>
        <Component />
      </StoreProvider>
    )).toThrowError();
  });

  it("should report error when using a store that is not provided", () => {

    const Root = () => (
      <StoreProvider stores={[]}>
        <Component />
      </StoreProvider>
    );

    expect(() => mount(<Root />)).toThrowError();
  });

  it("should report error with no StoreProvider", () => {
    expect(() => mount(<Component />)).toThrowError();
  });

});
