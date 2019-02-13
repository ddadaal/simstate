import React from "react";
import { StoreType } from ".";
import { SimstateContext, ISimstateContext } from "./StoreProvider";
import { noProviderError, notProvidedError, WithStoresProps, Instances } from "./common";

interface RealProps {
  storeTypes: StoreType<any>[];
  children: (props: WithStoresProps) => React.ReactNode;
}

interface State {

}

export default class StoreConsumer extends React.Component<RealProps, State> {

  state = {};
  unmounted = false;
  storeMap: ISimstateContext = new Map();

  componentWillUnmount() {
    this.unmounted = true;
    this.unsubscribe();
  }

  private unsubscribe() {
    Array.from(this.storeMap.values()).forEach((store) => {
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

    this.storeMap.clear();

    this.props.storeTypes.forEach((storeType) => {
      const store = map.get(storeType);
      if (!store) {
        throw notProvidedError(storeType);
      }

      store.unsubscribe(this.update);
      store.subscribe(this.update);

      this.storeMap.set(storeType, store);
    });
  }

  useStore = <ST extends StoreType<any>>(storeType: ST) => {
    const store = this.storeMap.get(storeType) as InstanceType<ST> | undefined;

    if (!store) {
      throw notProvidedError(storeType);
    }

    return store;
  }

  useStores = <T extends StoreType<any>[]>(...storeTypes: T): Instances<T> => {
    return storeTypes.map((storeType) => this.useStore(storeType)) as Instances<T>;
  }

  render() {
    return (
      <SimstateContext.Consumer>
        {(map) => {
          this.createInstances(map);
          return this.props.children({
            useStore: this.useStore,
            useStores: this.useStores,
          });
        }}
      </SimstateContext.Consumer>
    );
  }
}
