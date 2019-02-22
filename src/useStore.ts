import { StoreType } from ".";
import { SimstateContext } from "./StoreProvider";
import { useContext, useState, useLayoutEffect, useCallback } from "react";
import { noProviderError, notProvidedError } from "./common";
import { Dependency } from "./types";

/**
 * Get store and observe their changes.
 * @param storeType the type of store to be observed
 * @param dep the props of the state which will update the component when changed,
 * or a custom comparer to decide when to update
 * @return InstanceType<ST> the store instance
 */
export default function useStore
  <ST extends StoreType<any>>(storeType: ST, dep?: Dependency<ST>): InstanceType<ST> {
  const providedStores = useContext(SimstateContext);

  if (!providedStores) {
    throw noProviderError();
  }

  const store = providedStores.get(storeType) as InstanceType<ST> | undefined;

  if (!store) {
    throw notProvidedError(storeType);
  }

  // dummy state used to cause update
  const [, update] = useState({});

  // create a persistent update function
  const listener = useCallback(() => update({ }), []);

  useLayoutEffect(() => { // use layout effect to priorize subscription to location update in the top
    store.subscribe(listener, dep);

    return () => {
      store.unsubscribe(listener);
    };
  }, [store, ...(Array.isArray(dep) ? dep : [dep])]);

  return store;
}
