import { Store } from "../src";

interface IStore {
  value: number;
}

export class TestStore extends Store<IStore> {

  constructor(value: number) {
    super();
    this.state = { value };
  }

  increment() {
    return this.setState({ value: this.state.value + 1 });
  }
}

interface IAnotherStore {
  text: string;
}

export class AnotherStore extends Store<IAnotherStore> {
  constructor(text: string) {
    super();
    this.state = { text };
  }
}

interface IMultiStateStore {
  state1: string;
  state2: string;
  state3: string;
}

export class MultiStateStore extends Store<IMultiStateStore> {
  constructor(state1: string, state2: string, state3: string) {
    super();
    this.state = { state1, state2, state3 };
  }
}
