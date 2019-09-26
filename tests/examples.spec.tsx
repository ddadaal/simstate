import React, { useState, useCallback, useRef } from "react";
import { useStore, StoreProvider, createStore } from "../src";
import { mount } from "enzyme";

describe("Basic test examples", () => {
  it("should work as intended", () => {
    function CounterStore(initialValue: number) {
      const [value, setValue] = useState(initialValue);

      const incrementStep = useRef(1).current;
      const increment = useCallback(() => setValue(value + incrementStep), [value]);

      return { value, setValue, increment };
    }

    const counterStore = createStore(CounterStore, 42);

    const RootComponent: React.FC = () => (
      <StoreProvider stores={[counterStore]}>
        <MyComponent />
      </StoreProvider>
    );

    const MyComponent: React.FC = () => {
      const counterStore = useStore(CounterStore);

      return (
        <div>
          <p>Current: <span>{counterStore.value}</span></p>
          <button id="btnIncrement" onClick={counterStore.increment}>Increment</button>
          <button id="btnDecrement" onClick={() => counterStore.setValue(counterStore.value - 1)}>Decrement</button>
        </div>
      );
    }

    const wrapper = mount(<RootComponent />);

    const span = wrapper.find("span");
    const btnIncrement = wrapper.find("#btnIncrement");
    const btnDecrement = wrapper.find("#btnDecrement");

    expect(span.text()).toEqual("42");

    btnIncrement.simulate("click");

    expect(span.text()).toEqual("43");

    btnDecrement.simulate("click");

    expect(span.text()).toEqual("42");

  })
});

describe("immutable store instance examples", () => {
  it("should work as intended", () => {
    function AStore() {
      const [count, setCount] = useState(1);
      return { count, setCount };
    }

    const MyComponent: React.FC = () => {
      const aStore = useStore(AStore);

      const increment = useCallback(() => {
        aStore.setCount(aStore.count + 1);
      }, [aStore]); // make sure aStore is one of the deps.

      return (
        <div>
          <span>{aStore.count}</span>
          <button onClick={increment}>Increment</button>
        </div>
      )
    };

    const wrapper = mount(<StoreProvider stores={[createStore(AStore)]}>
      <MyComponent />
    </StoreProvider>);

    const span = wrapper.find("span");
    const btnIncrement = wrapper.find("button");

    expect(span.text()).toEqual("1");

    btnIncrement.simulate("click");

    expect(span.text()).toEqual("2");
  })
});
