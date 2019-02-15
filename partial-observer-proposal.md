# Partial Observer

Sometimes, a component that relies on a store (called an **observer** component) may not depend on all of the states. Currently, such a observer will update even when the state not dependent on is updated, which is not optimal. The traditional solution for this is to split the store into multiple stores, but it might be too much of work, and the resulting stores might be too fragmented to understand and maintain effectively. With this proposal, an observer will only update when the state it declares to rely on updates, which solves the problem with only little extra effort to declare the state it relies on.

```tsx
class AStore extends Store<{ a: number, b: number}> {
  state = { a: 1, b: 1};
  // only modify one of the prop
  incrementB = () => { this.setState({ b: this.state.b + 1 }); };
}

// currently the component will update when incrementB is called,
// even the component doesn't relies on prop b at all!
const Component = () => {
  const store = useStore(AStore);
  return <span>{store.state.a}</span>;
}s

// expected: the component will not update when incrementB is called
const Expected = () => {
  const store = useStore(AStore, "a"); // dependent state are specified with types checked
  return <span>{store.state.a}</span>;
}

// Looks so similar to MobX....
```