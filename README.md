# simstate
[![npm](https://img.shields.io/npm/v/simstate.svg?style=flat-square)](https://www.npmjs.com/package/simstate)
[![types](https://img.shields.io/npm/types/simstate.svg?style=flat-square)](https://www.npmjs.com/package/simstate)
[![Build Status](https://img.shields.io/travis/viccrubs/simstate.svg?style=flat-square)](https://travis-ci.org/viccrubs/simstate) 
[![Coverage Status](https://img.shields.io/coveralls/github/viccrubs/simstate.svg?style=flat-square)](https://coveralls.io/github/viccrubs/simstate?branch=master) 

`simstate` is a React state management tool favoring [React Hooks](https://reactjs.org/docs/hooks-intro.html) .

# How to use

```jsx
import React from "react";
import { Store, useStore, StoreProvider } from "simstate";

// 1. Define your store

interface IStore {
  value: number;
}

class TestStore extends Store<IStore> {
  state = { value: 42 };

  increment() {
    this.setState({ value: this.state.value + 1 });
  }
}

// 2. Wrap your component with `StoreProvider`

const store = new TestStore();

const RootComponent = () => {
  return (
    <StoreProvider stores={[store]}>
      <CounterWithHook />
      <ComponentWithRenderProps />
      <ComponentWithHOC />
    </StoreProvider>
  );
};

// 3. Use `useStore` hook to get the store instance (recommended)

function CounterWithHook() {
  const store = useStore(TestStore);
  return (
    <div>
      <p>Current value: {store.state.value}</p>
      <button onClick={() => store.increment()}>Increment</button>
    </div>
  );
}

// 3.1 Use render props
function ComponentWithRenderProps() {
  <StoreConsumer storeTypes={[TestStore]}>
    {({ useStore }) => {
      const store = useStore(TestStore);
      return (
        <span>
          {store.state.value}
        </span>
      );
    }}
  </StoreConsumer>
}

// 3.2 Use HOC
const ComponentWithHOC = withStores(TestStore)(({ useStore }) => (
  <span>{useStore(TestStore).state.value}</span>
));

// For render props and HOC, setState can be awaited for actual component update
function AwaitedComponent() {
  <StoreConsumer storeTypes={[TestStore]}>
    {({ useStore }) => {
      const store = useStore(TestStore);
      return (
        <button onClick={async () => {
          console.log(store.state.value) // 42

          // update state via function
          await store.setState(({ value }) => ({ value: value + 2 }));

          console.log(store.state.value) // 44, and the innerText of this button will also be 44
        }}>
          {store.state.value}
        </button>
      );
    }}
  </StoreConsumer>
}

```

# Features

- Define states and actions in a class like a React class component
    - Update states using `setState`
    - For `render props` and `HOC`, the promise returned by `setState` is resolved when the component is updated (the callback for `setState`); for hook usage, the promise is immediately resolved. It is being worked on.
- Use provided stores in components with [hooks](https://reactjs.org/docs/hooks-intro.html) in state management
    - `render props` and `HOC` are also provided for compatibilities (like using store in a class component)
- No dependency but React 16.8 or higher
- Full support in TypeScript. All types can be automatically inferred.
- Basic SSR utilities support

## Roadmap

- [x] Store and `useStore` hook
- [x] Render props component
- [x] HOC
- [X] Add test
- [X] Achieve high test coverage
- [X] Implement `setState` promise resolve after component update for hook use
- [ ] SSR utilities and its example

# Credits

[unstated](https://github.com/jamiebuilds/unstated) - This tool is hugely inspired by unstated.

# License

MIT