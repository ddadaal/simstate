# simstate
[![npm](https://img.shields.io/npm/v/simstate.svg?style=flat-square)](https://www.npmjs.com/package/simstate)
[![types](https://img.shields.io/npm/types/simstate.svg?style=flat-square)](https://www.npmjs.com/package/simstate)
[![Build Status](https://img.shields.io/travis/viccrubs/simstate.svg?style=flat-square)](https://travis-ci.org/viccrubs/simstate) 
[![Coverage Status](https://img.shields.io/coveralls/github/viccrubs/simstate.svg?style=flat-square)](https://coveralls.io/github/viccrubs/simstate?branch=master) 

`simstate` is a strongly-typed React state management tool favoring [React Hooks](https://reactjs.org/docs/hooks-intro.html) and [TypeScript](https://www.typescriptlang.org/).

# How to use

Talk is cheap. Here is the code. :smile:

```jsx
import React from "react";
import { Store, useStore, StoreProvider } from "simstate";

// 1. Define your stores

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

// 2. Wrap your component tree with `StoreProvider`

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

// 3.1 Use render props
function ComponentWithRenderProps() {
  return (
    <StoreConsumer>
      {({ useStore }: ConsumerActions) => { // inject a ConsumerActions object. Explicitly specifying type is not required.
        const store = useStore(TestStore); 
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

// extends WithStoresProps to get `useStore` function
interface Props extends WithStoresProps { }

const ComponentWithHOC = withStores(({ useStore }: Props) => (
  <span>{useStore(TestStore).state.value}</span>
));

// Once the promise returned by `setState` resolves,
// components that use render props and HOC will have updated,
// but these using `useStore` hook may not.
function AwaitedComponent() {
  return (
    <StoreConsumer>
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

// 4. Partial observer feature

class MultiStateStore extends Store<{state1: string; state2: string;}> { }

function PartialObserver() {

  // Update the component as soon as the state is updated
  const store = useStore(MultiStateStore);

  // Update ONLY WHEN state property "state1" OR "state2" is changed (using Object.is for identity)
  const store1 = useStore(MultiStateStore, ["state1", "state2"]);

  // The followings have the same effect as above
  const store2 = useStore(MultiStateStore, [(s) => s.state1, "state2"]);
  const store3 = useStore(MultiStateStore, ["state1", (s) => s.state2]);
  const store4 = useStore(MultiStateStore, 
    (prevState, currState) => 
      Object.is(prevState.state1, currState.state1) 
      && Object.is(prevState.state2, currState.state2)
  ); // the function determines whether two state are equal

  // Type Error: "b" is not in {state1: string; state2: string;}
  const store5 = useStore(MultiStateStore, ["b"]);
  const store6 = useStore(MultiStateStore, [(s) => s.b]);

  // ...
}


```

# Features

- Simple APIs and you just read all of them
- No dependency but React 16.8 or higher and [tslib](https://github.com/Microsoft/tslib) for TypeScript projects
- Strongly typed with TypeScript. All types can be inferred so you don't have to `as` or `any` anymore!
- Nested providers. Inner provided stores will override outer stores
- Designed with performance in mind
- (WIP) Basic SSR utilities support

# Common Pitfalls

- Under the hood, the provided stores will be stored in a `Map` with `store's constructor` as the key and `store instance itself` as the value. To avoid unnecessary re-renders, `StoreProvider` caches inner context and only reassigns context if the provided maps are different. Two maps are different if they contain different stores. 

- Once the promise returned by `setState` resolves, it is guaranteed that components that use render props and HOC have updated, but these using `useStore` hook will not wait for the update. It is due to [the missing callback support for setState hook](https://github.com/facebook/react/issues/14174). Consider using render-props or HOC if it is needed: the APIs are the same, so the migration should not be a big trouble.

- `useStores` is deprecated since 2.0 and will be removed in a future release. Use `useStore` for better maintainability.

- Using getter-only property in stores to compute derived state (like MobX's `@computed`) is discouraged, because underlying state properties when using the `partial observer` feature may be missed. The TypeScript will also emit error if you specify a property name that is not included in the store's `state`. Consider including the derived state into state object, and export a updater which updates the original and the derived state at the same time.

```jsx
class AStore extends Store<{ text: string }> {
  state = { text: "123" };
  
  // discouraged
  get derivedState() {
    return this.text + " ";
  } 
}

function AComponentUsingDerivedState() {

  // Not use the partial observer feature
  // everything works fine
  const store0 = useStore(AStore);

  // Type error: State doesn't contain a key named "derivedState"
  const store1 = useStore(AStore, ["derivedState"]); 

  // This will work, but not encouraged
  // Since you can't ensure that users (incluing yourself!) will pass in "text" every time
  // And also you have to manually change all such occurrences after the original store is redesigned
  const store2 = useStore(AStore, ["text"]);

  // if you ignore the error and pass an empty array in...
  // the component will not update even text is updated
  const store3 = useStore(AStore, []); 

  // ...
}


// Recommended
class BStore extends Store<{ text: string; derived: string; }> {
  state = { text: "123", derived: "123 "};

  update(text: string) {
    this.setState({ text, derived: `${text} ` });
  }
}

```

## Roadmap

- [x] Store and `useStore` hook
- [x] Render props component
- [x] HOC
- [X] Add test
- [X] Achieve high test coverage
- [X] Implement `setState` promise resolve after component update for hook use
- [X] [Partial observer](https://github.com/viccrubs/simstate/blob/partial-observer/partial-observer-proposal.md)
- [ ] SSR utilities and its example

# Related Articles

Why I write this library: [Simstate and Why](https://viccrubs.me/articles/simstate-and-why/en)

# Credits

[unstated](https://github.com/jamiebuilds/unstated) - This tool is hugely inspired by unstated.

# License

MIT