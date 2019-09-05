import { testStore, noParamStore } from "./common";
import { mount } from "enzyme";
import { useStore, StoreProvider, createStore } from "../src";
import React, { useState, useCallback } from "react";

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
    const wrapper = mount(
      <StoreProvider stores={[store]}>

      </StoreProvider>
    )
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

  it("should not update since UpdateBlocker blocks update", () => {

    const MyComponent: React.FC<{ value: number }> = ({ value }) => <span>{value}</span>;

    const Component: React.FC = () => {
      const [value, setValue] = useState(10);
      const increment = useCallback(() => setValue(value + 1), [value]);
      return (
        <UpdateBlocker>
          <MyComponent value={value} />
        </UpdateBlocker>
      )
    }
  });
});
