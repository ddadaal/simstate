import React, { useState, useCallback, useRef } from "react";
import { useStore, StoreProvider, createStore } from "../src";

// 1. Define your stores as a custom hook.
//    Any hook supported by React is supported here!
function counterStore(initialValue: number) {
  const [value, setValue] = useState(initialValue);

  const incrementStep = useRef(1).current;
  const increment = useCallback(() => setValue(value + incrementStep), [value]);

  return { value, setValue, increment };
}

// 2. Create a store (Arguments as parameters to the function)
//    Arguments are type-checked so never pass bad arguments!
const store = createStore(counterStore, 42);

// 3. Wrap your component with StoreProvider
const RootComponent: React.FC = () => (
  <StoreProvider stores={[store]}>
    <MyComponent />
  </StoreProvider>
);

// 4. Pass the store function to useStore to get the store
const MyComponent: React.FC = () => {
  const store = useStore(counterStore);

  return (
    <div>
      <p>Current: <span>{store.value}</span></p>
      <button onClick={store.increment}>Increment</button>
      <button onClick={() => store.setValue(store.value - 1)}>Decrement</button>
    </div>
  );
}
