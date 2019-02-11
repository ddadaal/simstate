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
    this.setState({ value: this.state.value + 1 });
  }
}
