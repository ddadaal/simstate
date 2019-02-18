import React from "react";
import { SimstateContext, ISimstateContext } from "./StoreProvider";
import { noProviderError, notProvidedError, normalizeTarget } from "./common";
import { InjectedInstances, ObserveTargetTuple } from "./types";

interface Props<T extends ObserveTargetTuple> {
  targets: T;
  children(...instances: InjectedInstances<T>): React.ReactNode;
}

interface State {

}

export default class StoreConsumer<T extends ObserveTargetTuple>
  extends React.Component<Props<T>, State> {

  state = {};
  unmounted = false;
  instances: InjectedInstances<T>;

  componentWillUnmount() {
    this.unmounted = true;
    this.unsubscribe();
  }

  private unsubscribe() {
    this.instances.forEach((store) => {
      store.unsubscribe(this.update);
    });
  }

  update = () => {
    return new Promise((resolve) => {
      if (!this.unmounted) {
        this.setState({}, resolve);
      } else {
        // hard to test so just ignore it :D
        /* istanbul ignore next line */
        resolve();
      }
    });
  }

  createInstances(map: ISimstateContext | undefined) {
    this.unsubscribe();

    if (!map) {
      throw noProviderError();
    }

    this.instances = this.props.targets.map((t) => {
      const [storeType, deps] = normalizeTarget(t);

      const store = map.get(storeType);
      if (!store) {
        throw notProvidedError(storeType);
      }

      store.unsubscribe(this.update);
      store.subscribe(this.update, deps);

      return store;
    }) as InjectedInstances<T>;

    return this.instances;
  }

  render() {
    return (
      <SimstateContext.Consumer>
        {(map) => {
          this.createInstances(map);
          return this.props.children(...(this.instances as any));
        }}
      </SimstateContext.Consumer>
    );
  }
}
