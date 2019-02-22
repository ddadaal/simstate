import { MultiStateStore, TestStore } from "./common";
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

  class UpdateBlocker extends React.PureComponent {
    render() {
      return (
        this.props.children
      );
    }
  }

  it("should render with current store state", () => {
    const store = new TestStore(42);

    const wrapper = mount(
      <StoreProvider stores={[store]}>
        <UpdateBlocker>
          <Component/>
        </UpdateBlocker>
      </StoreProvider>,
    );

    expect(wrapper.find("span").text()).toBe("42");
  });

  it("should add a listener when mounted and remove one when unmounted", () => {
    const store = new TestStore(42);

    // tslint:disable-next-line
    expect(store["observers"].size).toBe(0);

    const wrapper = mount(
      <StoreProvider stores={[store]}>
        <UpdateBlocker>
        <Component />
        </UpdateBlocker>
      </StoreProvider>,
    );

    // tslint:disable-next-line
    expect(store["observers"].size).toBe(1);

    wrapper.unmount();

    // tslint:disable-next-line
    expect(store["observers"].size).toBe(0);

  });

  it("should report error when using a store that is not provided", () => {
    const Component = () => {
      useStore(TestStore);
      return <div>mounted!</div>;
    };

    expect(() => mount(
      <StoreProvider stores={[]}>
        <UpdateBlocker>
        <Component />
        </UpdateBlocker>
      </StoreProvider>,
    )).toThrowError();
  });

  it("should report error with no StoreProvider", () => {
    expect(() => mount(<Component />)).toThrowError();
  });

  it("should not update when updating a not dependent state", () => {

    const store = new MultiStateStore("state1", "state2");

    const Component = () => {

      const store = useStore(MultiStateStore, ["state1"]);

      return (
        <span>{store.state.state2}</span>
      );
    };

    const wrapper = mount(
      <StoreProvider stores={[store]}>
        <UpdateBlocker>
          <Component />
        </UpdateBlocker>
      </StoreProvider>,
    );

    expect(wrapper.find("span").text()).toBe("state2");

    store.setState({ state2: "123" });

    wrapper.update();

    expect(wrapper.find("span").text()).toBe("state2");

  });
});
