import { Dependency } from "./types";
import { getChecker, DepChecker } from "./DepChecker";

type Observer = (() => void) | (() => Promise<void>);

interface ObserverInfo<State extends object> {
  dep: Dependency | undefined;
  shouldUpdate: DepChecker;
}

export default class Store<State extends object> {

  state: State;

  private observers = new Map<Observer, ObserverInfo<State>>();

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

  subscribe(observer: Observer, dep?: Dependency) {
    this.observers.set(observer, { dep, shouldUpdate: getChecker(dep) });
  }

  unsubscribe(observer: Observer) {
    this.observers.delete(observer);
  }

  // afterHydration() {
  //
  // }
}

export type StoreType<T extends object> = new (...args: any[]) => Store<T>;
