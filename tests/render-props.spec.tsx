import React from "react";
import { StoreConsumer } from "../src";
import { mount } from "enzyme";
import StoreProvider from "../src/StoreProvider";
import { TestStore, AnotherStore, MultiStateStore } from "./common";

describe("Render props", () => {

  class Component extends React.PureComponent {
    render() {
      return (
        <StoreConsumer>
          {({ useStore }) => {
            const store = useStore(TestStore);
            return (
              <span>{store.state.value}</span>
            );
          }}
        </StoreConsumer>
      );
    }
  }

  class MultiStoreComponent extends React.PureComponent {
    render() {
      return (
        <StoreConsumer>
          {({ useStore }) => {
            const store = useStore(TestStore);
            const another = useStore(AnotherStore, [(s) => s.text]);
            return (
              <div>
                <span id="test">{store.state.value}</span>
                <span id="another">{another.state.text}</span>
              </div>
            );
          }}
        </StoreConsumer>
      );
    }
  }

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
      try {
        expect(wrapper.find("#test").text()).toBe(test + "");
        expect(wrapper.find("#another").text()).toBe(another);
      } catch (e) {
        fail(e);
      }

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
    expect(store["observers"].size).toBe(0);

    const wrapper = mount(
      <StoreProvider stores={[store]}>
        <Component />
      </StoreProvider>,
    );

    // tslint:disable-next-line
    expect(store["observers"].size).toBe(1);

    wrapper.unmount();

    // tslint:disable-next-line
    expect(store["observers"].size).toBe(0);

  });

  it("should not update when updating a not dependent state", async () => {

    const store = new MultiStateStore("state1", "state2", "state3");

    class Component extends React.PureComponent {
      render() {
        return (
          <StoreConsumer>
            {({ useStore }) => {
              const store = useStore(MultiStateStore, ["state1"]);
              return (
                <span>{store.state.state2}</span>
              );
            }}
          </StoreConsumer>
        );
      }
    }

    const wrapper = mount(
      <StoreProvider stores={[store]}>
        <Component />
      </StoreProvider>,
    );

    expect(wrapper.find("span").text()).toBe("state2");

    await store.setState({ state2: "123" });

    expect(wrapper.find("span").text()).toBe("state2");

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
