# restate

`restate` is a [React Hooks](https://reactjs.org/docs/hooks-intro.html) based state management tool.

# How to use

```tsx
import React from "react";
import { Store, useStore, StoreProvider } from "restate";

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

// 3.1 Use render props (in progress)

// 3.2 Use HOC (in progress)

```

# Features

- Define states and actions in a class like a React class component
    - Update states using `setState` which returns a Promise resolved when react component updated (yah)
- Use provided stores in components with [hooks](https://reactjs.org/docs/hooks-intro.html) in state management
    - `render props` and `HOC` are also provided for compatibilities (like using store in a class component)
- No dependency but React 16.8 or higher
- Full support in TypeScript. All types can be automatically inferred.
- Basic SSR utilities support

## Roadmap

- [x] Store and `useStore` hook
- [x] render props component
- [x] HOC
- [ ] SSR utilities and its example
- [ ] Add test
- [ ] Achieve 100% test coverage

# Credits

[unstated](https://github.com/jamiebuilds/unstated) - This tool is inspired by unstated.

# License

MIT