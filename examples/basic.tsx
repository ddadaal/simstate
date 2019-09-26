import React, { useState, useCallback, useRef } from "react";
import { useStore, StoreProvider, createStore } from "../src";

// 1. Define your stores as a custom hook.
//    Any hook supported by React is supported here!
function CounterStore(initialValue: number) {
  const [value, setValue] = useState(initialValue);

  const incrementStep = useRef(1).current;
  const increment = useCallback(() => setValue(value + incrementStep), [value]);

  return { value, setValue, increment };
}

// 2. Create a store (Arguments as parameters to the function)
//    Arguments are type-checked so never pass bad arguments!
const counterStore = createStore(CounterStore, 42);

// 3. Wrap your component with StoreProvider
const RootComponent: React.FC = () => (
  <StoreProvider stores={[counterStore]}>
    <MyComponent />
  </StoreProvider>
);

// 4. Pass the store function to useStore to get the store
const MyComponent: React.FC = () => {
  const counterStore = useStore(CounterStore);

  return (
    <div>
      <p>Current: <span>{counterStore.value}</span></p>
      <button onClick={counterStore.increment}>Increment</button>
      <button onClick={() => counterStore.setValue(counterStore.value - 1)}>Decrement</button>
    </div>
  );
}
