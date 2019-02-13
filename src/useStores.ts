import { StoreType } from ".";
import { useContext, useState, useRef, useLayoutEffect } from "react";
import { noProviderError, notProvidedError, Instances } from "./common";
import { SimstateContext } from "./StoreProvider";

export default function useStores<T extends StoreType<any>[]>(...storeTypes: T): Instances<T> {
  const providedStores = useContext(SimstateContext);

  if (!providedStores) {
    throw noProviderError();
  }

  const stores = storeTypes.map((storeType) => {
    const instance = providedStores.get(storeType);
    if (!instance) {
      throw notProvidedError(storeType);
    }
    return instance;
  });

  // dummy state used to cause update
  const [, update] = useState({});

  // create a persistent update function
  const { current: listener } = useRef(() => update({}));

  useLayoutEffect(() => { // use layout effect to priorize subscription to location update in the top
    stores.forEach((store) => store.subscribe(listener));

    return () => {
      stores.forEach((store) => store.unsubscribe(listener));
    };
  }, stores);

  return stores as Instances<T>;
}
