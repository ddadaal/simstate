import { Dep } from "./types";
import { getChecker, DepChecker } from "./DepChecker";

type Observer = (() => void) | (() => Promise<void>);

interface ObserverInfo<State extends object> {
  shouldUpdate: DepChecker;
}

export default class Store<State extends object> {

  state: State;

  private observers: Map<Observer, ObserverInfo<State>> = new Map();

  async setState(
    updater: Partial<State> | ((prevState: State) => State),
  ): Promise<void[]> {

    const updatedState = typeof updater === "function" ? updater(this.state) : updater;

    const nextState = { ...this.state, ...updatedState };

    const causedObserver = [] as (() => void|Promise<void>)[];

    this.observers.forEach((info, observer) => {
      if (info.shouldUpdate(this.state, nextState)) {
        causedObserver.push(observer);
      }
    });

    this.state = nextState;

    return Promise.all(causedObserver.map((observer) => observer()));
  }

  subscribe(fn: Observer, dep?: Dep) {
    this.observers.set(fn , { shouldUpdate: getChecker(dep) });
  }

  unsubscribe(fn: Observer) {
    this.observers.delete(fn);
  }

  // afterHydration() {
  //
  // }
}

export type StoreType<T extends object> = new (...args: any[]) => Store<T>;
