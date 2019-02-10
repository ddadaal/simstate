import React from "react";
import { Store, StoreType } from "..";
import { ProviderContext, IProviderContext } from "../StoreProvider";
import { noProviderError, notProvidedError } from "../Error";

export interface WithStoresProps {
  useStore: <ST extends StoreType<any>>(storeType: ST) => InstanceType<ST>;
}

interface RealProps {
  storeTypes: StoreType<any>[];
  children: (props: WithStoresProps) => React.ReactNode;
}

interface State {

}

export default class StoreConsumer extends React.Component<RealProps, State> {

  state = {};
  unmounted = false;
  storeMap: IProviderContext = new Map();

  componentWillUnmount() {
    this.unmounted = true;
    this.unsubscribe();
  }

  private unsubscribe() {
    Array.from(this.storeMap.values()).forEach((store) => {
      store.unsubscribe(this.update);
    })
  }

  update = () => {
    return new Promise((resolve) => {
      if (!this.unmounted) {
        this.setState({}, resolve)
      } else {
        resolve();
      }
    });
  }

  createInstances(map: IProviderContext) {
    this.unsubscribe();

    if (map == null) {
      noProviderError();
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

  render() {
    return (
      <ProviderContext.Consumer>
        {(map) => {
          this.createInstances(map);
          return this.props.children({
            useStore: this.useStore
          });
        }}
      </ProviderContext.Consumer>
    );
  }
}
