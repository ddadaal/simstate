import React, { useState, useCallback, useRef } from "react";
import { useStore, StoreProvider, createStore } from "../src";

export function testStore(initialValue: number) {
  const [value, setValue] = useState(initialValue);

  return { value, setValue };
}

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

const Root = () => (
  <StoreProvider stores={[store1]}>
    <StoreProvider stores={[store2]}>
      <Component />
    </StoreProvider>
  </StoreProvider>
);

// the span will contain 2, since store2 is the latest testStore store provided.
