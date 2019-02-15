import { Dep } from "./common";

type Observer = (() => void) | (() => Promise<void>);

interface InternalObserver {
  observer: Observer;
  deps: Array<Dep<any>> | undefined;
}

export default class Store<State extends object> {

  state: State;

  private observers: InternalObserver[] = [];

  async setState(
    updater: Partial<State> | ((prevState: State) => State),
  ) {

    const nextState = typeof updater === "function" ? updater(this.state) : updater;

    const changedStates = Object.keys(nextState)
      .filter((key) => (this.state as any)[key] !== (nextState as any)[key]);

    this.state = {
      ...this.state,
      ...nextState,
    };

    const promises = [];

    for (const observer of this.observers) {
      if (!observer.deps || observer.deps.some((dep) => changedStates.includes(dep))) {
        promises.push(observer.observer());
      }
    }

    return Promise.all(promises);
  }

  subscribe(fn: Observer, deps?: Dep<any>[]) {
    this.observers.push({ observer: fn, deps });
  }

  unsubscribe(fn: Observer) {
    this.observers = this.observers.filter((ob) => ob.observer !== fn);
  }

  // afterHydration() {
  //
  // }
}

export type StoreType<T extends object, S extends Store<T> = Store<T>> = new (...args: any[]) => S;
