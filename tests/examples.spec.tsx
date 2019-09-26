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
})
