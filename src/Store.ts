type Observer = () => void;

export default class Store<State extends object> {

  state: State;

  private observers: Observer[] = [];

  setState(
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


    this.observers.forEach((observer) => observer());
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
