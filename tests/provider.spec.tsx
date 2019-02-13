import React from "react";
import { TestStore, AnotherStore } from "./common";
import { StoreProvider, Store } from "../src";
import { SimstateContext } from "../src/StoreProvider";
import { mount } from "enzyme";

describe("Provider", () => {
  it("should provide store", () => {
    const store = new TestStore(42);
    const Component = () => (
      <StoreProvider stores={[store]}>
        <SimstateContext.Consumer>
          {(map) => <span>{map!.get(TestStore)!.state.value}</span>}
        </SimstateContext.Consumer>
      </StoreProvider>
    );

    const wrapper = mount(<Component />);
    expect(wrapper.find("span").text()).toEqual("42");
  });

  it("should re-render when input stores have changed", () => {
    class Component extends React.Component<{ stores: Store<any>[] }> {

      render() {
        return (
          <StoreProvider stores={this.props.stores}>
            <SimstateContext.Consumer>
              {(map) => <span>{map!.get(TestStore)!.state.value}</span>}
            </SimstateContext.Consumer>
          </StoreProvider>
        );
      }
    }

    const wrapper = mount(<Component stores={[new TestStore(42)]} />);

    expect(wrapper.find("span").text()).toEqual("42");

    wrapper.setProps({ stores: [new TestStore(43)] });

    expect(wrapper.find("span").text()).toEqual("43");

    wrapper.setProps({ stores: [new TestStore(43), new AnotherStore("haha")] });

    expect(wrapper.find("span").text()).toEqual("43");
  });

  it("should not re-render if the input store hasn't changed", () => {

    class Child extends React.PureComponent {
      render() {
        return (
          <SimstateContext.Consumer>
            {(map) => {
              return (
                <span>{map!.get(TestStore)!.state.value}</span>
              );
            }}
          </SimstateContext.Consumer>
        );
      }
    }

    class Component extends React.Component<{ store: Store<any> }> {
      render() {
        return (
          <StoreProvider stores={[this.props.store]}>
            <Child />
          </StoreProvider>
        );
      }
    }

    const store = new TestStore(42);

    const wrapper = mount(<Component store={store} />);

    expect(wrapper.find("span").text()).toEqual("42");

    store.state.value = 43;
    wrapper.setProps({ store });

    expect(wrapper.find("span").text()).toEqual("42");

  });

  it("should support nested providers", () => {

    function Child() {
      return (
        <SimstateContext.Consumer>
          {(map) => (
            <div>
              <span id="TestStore">{map!.has(TestStore) ? map!.get(TestStore)!.state.value : "no"}</span>
              <span id="AnotherStore">{map!.has(AnotherStore) ? map!.get(AnotherStore)!.state.text : "no"}</span>
            </div>
          )}
        </SimstateContext.Consumer>
      );
    }

    const test = (Parent: React.ComponentType, testStore: string, anotherStore: string) => {
      const wrapper = mount(<Parent />);

      expect(wrapper.find("#TestStore").text()).toEqual(testStore);
      expect(wrapper.find("#AnotherStore").text()).toEqual(anotherStore);
    };

    const Parent1 = () => (
      <StoreProvider stores={[new TestStore(42)]}>
        <Child />
      </StoreProvider>
    );

    test(Parent1, "42", "no");

    const Parent2 = () => (
      <StoreProvider stores={[new AnotherStore("hahaha")]}>
        <Parent1 />
      </StoreProvider>
    );

    test(Parent2, "42", "hahaha");

    const Parent3 = () => (
      <StoreProvider stores={[new AnotherStore("outter")]}>
        <StoreProvider stores={[new AnotherStore("inner")]}>
          <Child />
        </StoreProvider>
      </StoreProvider>
    );

    test(Parent3, "no", "inner");

  });

});
