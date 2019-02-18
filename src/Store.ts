import { Dep } from "./types";

type Observer = (() => void) | (() => Promise<void>);

interface ObserverInfo {
  deps: Array<Dep> | undefined;
}

export default class Store<State extends object> {

  state: State;

  private observers: Map<Observer, ObserverInfo> = new Map();

  async setState(
    updater: Partial<State> | ((prevState: State) => State),
  ) {

    const nextState = typeof updater === "function" ? updater(this.state) : updater;

    const changedStates: PropertyKey[] = Object.keys(nextState)
      .filter((key) => (this.state as any)[key] !== (nextState as any)[key]);

    this.state = {
      ...this.state,
      ...nextState,
    };

    const promises = [];

    for (const [observer, info] of this.observers) {
      if (!info.deps || info.deps.some((dep) => changedStates.includes(dep))) {
        promises.push(observer());
      }
    }

    return Promise.all(promises);
  }

  subscribe(fn: Observer, deps?: Dep[]) {
    this.observers.set(fn , { deps });
  }

  unsubscribe(fn: Observer) {
    this.observers.delete(fn);
  }

  // afterHydration() {
  //
  // }
}

export type StoreType<T extends object> = new (...args: any[]) => Store<T>;
