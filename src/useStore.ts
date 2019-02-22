import { StoreType } from ".";
import { SimstateContext } from "./StoreProvider";
import { useContext, useState, useLayoutEffect, useCallback } from "react";
import { noProviderError, notProvidedError } from "./common";
import { Dep } from "./types";

export default function useStore<ST extends StoreType<any>>(
  storeType: ST,
  dep?: Dep<ST>,
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
  const listener = useCallback(() => update({ }), []);

  useLayoutEffect(() => { // use layout effect to priorize subscription to location update in the top
    store.subscribe(listener, dep);

    return () => {
      store.unsubscribe(listener);
    };
  }, [store, ...(Array.isArray(dep) ? dep : [dep])]);

  return store;
}
