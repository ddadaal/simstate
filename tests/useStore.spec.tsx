import { MultiStateStore, TestStore } from "./common";
import { mount } from "enzyme";
import { useStore, StoreProvider } from "../src";
import React from "react";
describe("UseStore", () => {
  const Component: React.FC = () => {
    const store = useStore(TestStore);
    return (
      <span>{store.state.value}</span>
    );
  };
  class UpdateBlocker extends React.PureComponent {
    render(): React.ReactNode {
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
    const Component: React.FC = () => {
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
    const store = new MultiStateStore("state1", "state2", "state3");
    const Component: React.FC = () => {
      const store = useStore(MultiStateStore, ["state1", (s) => s.state3 ]);
      return (
        <div>
          <span id="state1">{store.state.state1}</span>
          <span id="state2">{store.state.state2}</span>
          <span id="state3">{store.state.state3}</span>
        </div>
      );
    };
    const wrapper = mount(
      <StoreProvider stores={[store]}>
        <UpdateBlocker>
          <Component />
        </UpdateBlocker>
      </StoreProvider>,
    );
    const expectValues = (state1: string, state2: string, state3: string): void => {
      expect(wrapper.find("#state1").text()).toBe(state1);
      expect(wrapper.find("#state2").text()).toBe(state2);
      expect(wrapper.find("#state3").text()).toBe(state3);
    };
    expectValues("state1", "state2", "state3");
    store.setState({ state2: "123" });
    expectValues("state1", "state2", "state3");
    store.setState({ state3: "new state3"});
    expectValues("state1", "123", "new state3");
  });
  it("should not update when the custom comparer returns true", async () => {
    const store = new TestStore(42);
    const Component: React.FC = () => {
      const store = useStore(TestStore, (prev, curr) => prev.value === curr.value - 1);
      return (
          <span>{store.state.value}</span>
      );
    };
    const wrapper = mount(
      <StoreProvider stores={[store]}>
        <UpdateBlocker>
          <Component />
        </UpdateBlocker>
      </StoreProvider>,
    );
    expect(wrapper.find("span").text()).toBe("42");
    await store.increment();
    wrapper.update();
    expect(wrapper.find("span").text()).toBe("42");
    await store.setState((s) => ({ value: s.value }));
    wrapper.update();
    expect(wrapper.find("span").text()).toBe("43");
  });
});
