import { testStore, noParamStore } from "./common";
import { mount } from "enzyme";
import { useStore, StoreProvider, createStore } from "../src";
import React from "react";

describe("UseStore", () => {

  const Component: React.FC = () => {
    const store = useStore(testStore);
    return (
      <span>{store.value}</span>
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
    const store = createStore(testStore, 42);
    const wrapper = mount(
      <StoreProvider stores={[store]}>
        <UpdateBlocker>
          <Component />
        </UpdateBlocker>
      </StoreProvider>,
    );
    expect(wrapper.find("span").text()).toBe("42");
  });

  it("should update when store updated", () => {
    const store = createStore(testStore, 42);

    const Component = () => {
      const { value, setValue } = useStore(testStore);
      return (
        <div>
          <span>{value}</span>
          <button onClick={() => setValue(value + 1)}>Increment</button>
        </div>
      );
    }

    const wrapper = mount(
      <StoreProvider stores={[store]}>
        <Component />
      </StoreProvider>
    )

    const span = wrapper.find("span");
    const btn = wrapper.find("button");

    expect(span.text()).toBe("42");
    btn.simulate("click");
    expect(span.text()).toBe("43");


  });

  it("should report error when using a store that is not provided", () => {
    const Component: React.FC = () => {
      useStore(noParamStore);
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

  it("should update even UpdateBlocker blocks update", () => {
    const store = createStore(testStore, 42);

    const Component = () => {
      const { value, setValue } = useStore(testStore);
      return (
        <div>
          <span>{value}</span>
          <button onClick={() => setValue(value + 1)}>Increment</button>
        </div>
      );
    }

    const Root = () => (
      <StoreProvider stores={[store]}>
        <UpdateBlocker>
          <Component />
        </UpdateBlocker>
      </StoreProvider>
    );

    const wrapper = mount(<Root />);

    const span = wrapper.find("span");
    const btn = wrapper.find("button");

    expect(span.text()).toBe("42");
    btn.simulate("click");
    expect(span.text()).toBe("43");
  });

  it("should use latest provided store when multiple stores with the same storeInit is provided", () => {
    const store1 = createStore(testStore, 1);
    const store2 = createStore(testStore, 2);

    const Component = () => {
      const { value, setValue } = useStore(testStore);
      return (
        <div>
          <span>{value}</span>
          <button onClick={() => setValue(value + 1)}>Increment</button>
        </div>
      );
    }

    const wrapper = mount(
      <StoreProvider stores={[store1]}>
        <StoreProvider stores={[store2]}>
          <Component />
        </StoreProvider>
      </StoreProvider>
    );

    expect(wrapper.find("span").text()).toBe("2");
  });
});
