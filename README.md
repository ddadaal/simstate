# simstate
[![npm](https://img.shields.io/npm/v/simstate.svg?style=flat-square)](https://www.npmjs.com/package/simstate)
[![types](https://img.shields.io/npm/types/simstate.svg?style=flat-square)](https://www.npmjs.com/package/simstate)
[![Build Status](https://img.shields.io/travis/viccrubs/simstate.svg?style=flat-square)](https://travis-ci.org/viccrubs/simstate) 
[![Coverage Status](https://img.shields.io/coveralls/github/viccrubs/simstate.svg?style=flat-square)](https://coveralls.io/github/viccrubs/simstate?branch=master) 

`simstate` is a React state management tool favoring [React Hooks](https://reactjs.org/docs/hooks-intro.html) and [TypeScript](https://www.typescriptlang.org/).

# How to use

Talk is cheap. Here is the code. :smile:

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

class AnotherStore extends Store<{}> { }

// 2. Wrap your component with `StoreProvider`

const store = new TestStore();
const anotherStore = new AnotherStore();

const RootComponent = () => {
  return (
    <StoreProvider stores={[store, anotherStore]}>
      <CounterWithHook />
      <ComponentWithRenderProps />
      <ComponentWithHOC />
    </StoreProvider>
  );
};

// 3. Use `useStore` hook to get one single store instance (recommended)

function CounterWithHook() {
  const store = useStore(TestStore); // the type of `store` is inferred!
  return (
    <div>
      <p>Current value: {store.state.value}</p>
      <button onClick={() => store.increment()}>Increment</button>
    </div>
  );
}

// 3. Use `useStores` hook to get multiple store instances with each type being inferred (yah)
// Perfer this one if you want multiple stores in one component

function CounterWithStoresHook() {
  const [store, another] = useStores(TestStore, AnotherStore); 
  // store is inferred with type TestStore whilst another is inferred with type AnotherStore
    return (
    <div>
      <p>Current value: {store.state.value}</p>
      <button onClick={() => store.increment()}>Increment</button>
    </div>
  );
}

// 3.1 Use render props
function ComponentWithRenderProps() {
  return (
    <StoreConsumer storeTypes={[TestStore]}>
      {({ useStore, useStores }) => { // inject only these two method
        const store = useStore(TestStore); // useStore for single store
        const [testStore, anotherStore] = useStores(TestStore, AnotherStore); // useStores for multiple stores
        return (
          <span>
            {store.state.value}
          </span>
        );
      }}
    </StoreConsumer>
  );
}

// 3.2 Use HOC
const ComponentWithHOC = withStores(TestStore)(({ useStore, useStores }) => (
  <span>{useStore(TestStore).state.value}</span>
  <span>{useStores(AnotherStore)[0].constructor.name}</span>
));

// Once the promise returned by `setState` resolves,
// it is guaranteed for components that use render props and HOC that have updated,
// but these using `useStore` hook will not have the guarantee.
function AwaitedComponent() {
  return (
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
  );
}

```

# Features

- Simple APIs and you just read all of them
- No dependency but React 16.8 or higher and [tslib](https://github.com/Microsoft/tslib) for TypeScript projects
- Strongly typed with TypeScript. All types can be inferred so you don't have to `as` or `any` anymore!
- Nested providers. Inner provided stores will override outer stores.
- (WIP) Basic SSR utilities support

# Common Pitfalls

- Under the hood, the provided stores will be stored in a `Map` with store's constructor as the key and store instance itself as the value. To avoid unnecessary re-renders, `StoreProvider` is designed to cache inner context and only reassign context only if the provided maps are different. Two maps are different if they have different length, or contains different stores. 
- Once the promise returned by `setState` resolves, it is guaranteed for components that use render props and HOC that have updated, but these using `useStore` hook will not have the guarantee. I am working on it.


## Roadmap

- [x] Store and `useStore` hook
- [x] Render props component
- [x] HOC
- [X] Add test
- [X] Achieve high test coverage
- [X] Implement `setState` promise resolve after component update for hook use
- [ ] [Partial observer](https://github.com/viccrubs/simstate/blob/partial-observer/partial-observer-proposal.md)
- [ ] SSR utilities and its example

# Related Articles

Why I write this library: [Simstate and Why](https://viccrubs.me/articles/simstate-and-why/en)

# Credits

[unstated](https://github.com/jamiebuilds/unstated) - This tool is hugely inspired by unstated.

# License

MIT