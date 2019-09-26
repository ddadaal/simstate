import React, { useState } from "react";
import { useStore, StoreProvider, createStore } from "../src";

export function TestStore(initialValue: number) {
  const [value, setValue] = useState(initialValue);

  return { value, setValue };
}

const testStore1 = createStore(TestStore, 1);
const testStore2 = createStore(TestStore, 2);

const Component = () => {
  const { value, setValue } = useStore(TestStore);
  return (
    <div>
      <span>{value}</span>
      <button onClick={() => setValue(value + 1)}>Increment</button>
    </div>
  );
}

const Root = () => (
  <StoreProvider stores={[testStore1]}>
    <StoreProvider stores={[testStore2]}>
      <Component />
    </StoreProvider>
  </StoreProvider>
);

// the span will contain 2, since store2 is the latest testStore store provided.
