import React from "react";
import { SimstateContext, ISimstateContext } from "./StoreProvider";
import { noProviderError, notProvidedError } from "./common";
import { Dependency } from "./types";
import { Store, StoreType } from "./index";

export interface ConsumerActions {
  useStore<ST extends StoreType<any>>(storeType: ST, dep?: Dependency<ST>): InstanceType<ST>;
}

interface Props {
  children(actions: ConsumerActions): React.ReactElement;
}

interface State {

}

/**
 * Render-props usage
 */
export default class StoreConsumer extends React.Component<Props, State> {

  state = {};
  unmounted = false;
  instances = new Set<Store<any>>();
  map: ISimstateContext;

  componentWillUnmount() {
    this.unmounted = true;
    this.unsubscribeAll();
  }

  private unsubscribeAll() {
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

  useStore = <ST extends StoreType<any>>(storeType: ST, dep?: Dependency<ST>): InstanceType<ST> => {
    const store = this.map.get(storeType);
    if (!store) {
      throw notProvidedError(storeType);
    }

    // multiple useStore on one store will override previous registration
    store.subscribe(this.update, dep);

    this.instances.add(store);

    return store as InstanceType<ST>;
  }

  render() {
    return (
      <SimstateContext.Consumer>
        {(map) => {
          if (!map) {
            throw noProviderError();
          }
          this.map = map;
          this.unsubscribeAll();
          this.instances.clear();
          return this.props.children({ useStore: this.useStore });
        }}
      </SimstateContext.Consumer>
    );
  }
}
