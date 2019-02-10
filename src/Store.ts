type Observer = (() => void) | (() => Promise<void>);

export default class Store<State extends object> {

  state: State;

  private observers: Observer[] = [];

  async setState(
    updater: Partial<State> | ((prevState: State) => State),
  ) {

    const nextState = typeof updater === "function" ? updater(this.state) : updater;

    if (nextState == null) {
      return;
    }

    this.state = {
      ...this.state,
      ...nextState,
    };


    const promises = this.observers.map((observer) => observer());

    return Promise.all(promises);
  }

  subscribe(fn: Observer) {
    this.observers.push(fn);
  }

  unsubscribe(fn: Observer) {
    this.observers = this.observers.filter((f) => f !== fn);

  }

  afterHydration() {
    // can be overwritten
  }
}

export type StoreType<T extends object> = new (...args: any[]) => Store<T>;
