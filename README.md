# simstate
[![npm](https://img.shields.io/npm/v/simstate.svg?style=flat-square)](https://www.npmjs.com/package/simstate)
[![types](https://img.shields.io/npm/types/simstate.svg?style=flat-square)](https://www.npmjs.com/package/simstate)
[![Build Status](https://img.shields.io/travis/ddadaal/simstate.svg?style=flat-square)](https://travis-ci.org/ddadaal/simstate) 
[![Coverage Status](https://img.shields.io/coveralls/github/ddadaal/simstate.svg?style=flat-square)](https://coveralls.io/github/ddadaal/simstate?branch=master) 

`simstate` is a strongly-typed React state management tool favoring [React Hooks](https://reactjs.org/docs/hooks-intro.html) and [TypeScript](https://www.typescriptlang.org/).

# Install

```bash
npm install --save simstate
```

# How to use

Talk is cheap. Here is the code. :smile:

```jsx
import React, { useState, useCallback, useRef } from "react";
import { useStore, StoreProvider, createStore } from "simstate";

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
```

# Features

- Simple APIs and you just read all of them
- No dependency but React 16.8 or higher and [tslib](https://github.com/Microsoft/tslib) for TypeScript projects
- Strongly typed with TypeScript, and all types can be inferred.
- Nested providers. Inner provided stores will override outer stores

# v2 

Since v3, `simstate` has been revamped to fully embrace react hooks. Looking for more traditional usage and implementation? Check out [v2 branch](https://github.com/ddadaal/simstate/tree/v2).

# Tips

- Check [examples](https://github.com/ddadaal/simstate/tree/master/examples) for more usage
- Name your store with **capital letter** (`AStore`), and name with store instance **with lowercase letter** (`aStore`). It makes it easy to work with multiple stores in one component.

```tsx
const MyComponent = () => {
  const aStore = useStore(AStore);
  const bStore = useStore(BStore);
  // ...
}
```

- Store instance is **immutable**. Every time a state is changed, a new store instance is created. Therefore, when store instance is used in combination with your custom hook, make sure that **store instance is one of your hook deps**. [(examples/immutable_store_instance.tsx)](https://github.com/ddadaal/simstate/blob/master/examples/immutable_store_instance.tsx)

# Related

[Simstate and Why](https://ddadaal.me/articles/simstate-and-why/en) (English): This article talks about why I write this library. 
[simstate-i18n](https://github.com/ddadaal/simstate-i18n): A Strongly-typed React i18n Library based on simstate.

# Credits

[unstated-next](https://github.com/jamiebuilds/unstated-next) - This tool is hugely inspired by unstated-next.

[outstated](https://github.com/yamalight/outstated/) - The implementation looks alike. 

# License

MIT © [ddadaal](https://github.com/ddadaal)