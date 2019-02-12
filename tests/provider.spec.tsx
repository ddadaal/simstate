import React from "react";
import { TestStore } from "./common";
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

    class AnotherStore extends Store<{}> { }

    const wrapper = mount(<Component stores={[new TestStore(42)]} />);

    expect(wrapper.find("span").text()).toEqual("42");

    wrapper.setProps({ stores: [new TestStore(43)] });

    expect(wrapper.find("span").text()).toEqual("43");

    wrapper.setProps({ stores: [new TestStore(43), new AnotherStore() ] });

    expect(wrapper.find("span").text()).toEqual("43");
  });

  it("should not re-render if the input store hasn't changed", () => {

    function Child() {
      return (
        <SimstateContext.Consumer>
          {(map) => {
            return (
              <span>{map!.get(TestStore)!.state.value}</span>
            );
          }
          }
        </SimstateContext.Consumer>
      );
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

});
