# simstate
[![npm](https://img.shields.io/npm/v/simstate.svg?style=flat-square)](https://www.npmjs.com/package/simstate)
[![types](https://img.shields.io/npm/types/simstate.svg?style=flat-square)](https://www.npmjs.com/package/simstate)
[![Build Status](https://img.shields.io/travis/viccrubs/simstate.svg?style=flat-square)](https://travis-ci.org/viccrubs/simstate) 
[![Coverage Status](https://img.shields.io/coveralls/github/viccrubs/simstate.svg?style=flat-square)](https://coveralls.io/github/viccrubs/simstate?branch=master) 

`simstate` is a strongly-typed React state management tool favoring [React Hooks](https://reactjs.org/docs/hooks-intro.html) and [TypeScript](https://www.typescriptlang.org/).

# How to use

Talk is cheap. Here is the code. :smile:

```jsx
import React, { useState, useCallback, useRef } from "react";
import { useStore, StoreProvider, createStore } from "simstate";

// 1. Define your stores as a custom hook.
//    Any hook supported by React is supported here!
function counterStore(initialValue: number) {
  const [value, setValue] = useState(initialValue);

  const incrementStep = useRef(1).current;
  const increment = useCallback(() => setValue(value + incrementStep), []);

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
```

# Features

- Simple APIs and you just read all of them
- No dependency but React 16.8 or higher and [tslib](https://github.com/Microsoft/tslib) for TypeScript projects
- Strongly typed with TypeScript, and all types can be inferred.
- Nested providers. Inner provided stores will override outer stores

# v2 

Since v3, `simstate` has been revamped to fully embrace react hooks. Looking for v2 for more traditional usage and implementation? Check out [v2 branch](https://github.com/viccrubs/simstate/tree/v2).

# Related Articles

Why I write this library: [Simstate and Why](https://viccrubs.me/articles/simstate-and-why/en)

# Credits

[unstated-next](https://github.com/jamiebuilds/unstated-next) - This tool is hugely inspired by unstated-next.

# License

MIT