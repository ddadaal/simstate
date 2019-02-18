import { useContext, useState, useRef, useLayoutEffect } from "react";
import { noProviderError, notProvidedError } from "./common";
import { SimstateContext } from "./StoreProvider";
import { InjectedInstances, ObserveTarget, ObserveTargetTuple } from "./types";

/**
 * Get stores and observe their changes.
 * @param storeTypes the type of the stores to inject
 */
export default function useStores
  <S extends ObserveTargetTuple>(...targets: S): InjectedInstances<S> {
  const providedStores = useContext(SimstateContext);

  if (!providedStores) {
    throw noProviderError();
  }

  const stores = targets.map((target: ObserveTarget) => {
    const storeType = typeof target === "function" ? target : target[0];
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

  return stores as InjectedInstances<S>;
}
