import { StoreType } from "..";
import { SimstateContext } from "../StoreProvider";
import { useContext, useState, useRef, useLayoutEffect } from "react";
import { noProviderError, notProvidedError } from "../Error";

export default function useStore<ST extends StoreType<any>>(storeType: ST) {
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
    store.subscribe(listener);

    return () => {
      store.unsubscribe(listener);
    };
  }, [store]);

  return store;
}
