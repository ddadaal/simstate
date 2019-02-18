import { StoreType } from ".";
import { SimstateContext } from "./StoreProvider";
import { useContext, useState, useRef, useLayoutEffect } from "react";
import { noProviderError, notProvidedError } from "./common";
import { Dep } from "./types";

/**
 * Get a store and observe their changes.
 * @param storeType the type of the store to be injected
 */
export default function useStore<ST extends StoreType<any>>(
  storeType: ST,
  deps?: Dep<ST>[],
) {
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
  const { current: listener } = useRef(() => update({}));

  useLayoutEffect(() => { // use layout effect to priorize subscription to location update in the top
    store.subscribe(listener, deps);

    return () => {
      store.unsubscribe(listener);
    };
  }, [store]);

  return store;
}
