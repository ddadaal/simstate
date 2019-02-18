import React from "react";
import { StoreConsumer } from "../src";
import { mount } from "enzyme";
import StoreProvider from "../src/StoreProvider";
import { TestStore, AnotherStore } from "./common";
import { targets } from "../src/common";

describe("Render props", () => {

  const Component = () => (
    <StoreConsumer targets={[TestStore]}>
      {(store) => {
        return (
          <span>{store.state.value}</span>
        );
      }}
    </StoreConsumer>
  );

  const MultiStoreComponent = () => (
    <StoreConsumer targets={[TestStore, targets(AnotherStore, ["text"])]}>
      {(store, another) => {
        return (
          <div>
            <span id="test">{store.state.value}</span>
            <span id="another">{another.state.text}</span>
          </div>
        );
      }}
    </StoreConsumer>
  );

  it("should render with current store state", () => {
    const store = new TestStore(42);

    const wrapper = mount(
      <StoreProvider stores={[store]}>
        <Component />
      </StoreProvider>,
    );

    expect(wrapper.find("span").text()).toBe("42");
  });

  it("should inject multiple stores", () => {

    const wrapper = mount(
      <StoreProvider stores={[new TestStore(42), new AnotherStore("text")]}>
        <MultiStoreComponent />
      </StoreProvider>,
    );

    expect(wrapper.find("#test").text()).toBe("42");
    expect(wrapper.find("#another").text()).toBe("text");
  });

  it("should update the number after setState", async () => {
    const store = new TestStore(42);

    const wrapper = mount(
      <StoreProvider stores={[store]}>
        <Component />
      </StoreProvider>,
    );

    expect(wrapper.find("span").text()).toBe("42");

    await store.increment();

    expect(wrapper.find("span").text()).toBe("43");

    await store.setState(({ value }) => ({ value: value + 1 }));

    expect(wrapper.find("span").text()).toBe("44");

  });

  it("should update component when one of multiple injected stores setState", async () => {

    const test = new TestStore(42);
    const another = new AnotherStore("text");

    const wrapper = mount(
      <StoreProvider stores={[test, another]}>
        <MultiStoreComponent />
      </StoreProvider>,
    );

    const expectValues = (test: number, another: string) => {
      expect(wrapper.find("#test").text()).toBe(test + "");
      expect(wrapper.find("#another").text()).toBe(another);
    };

    expectValues(42, "text");

    await another.setState({  });

    expectValues(42, "text");

    await another.setState({ text: "123" });
    expectValues(42, "123");

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
