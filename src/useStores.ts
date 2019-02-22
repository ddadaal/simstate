import { useContext, useState, useLayoutEffect, useCallback } from "react";
import { noProviderError, normalizeTarget, notProvidedError } from "./common";
import { SimstateContext } from "./StoreProvider";
import { Dependency, InjectedInstances, NormalizedObserveTarget, ObserveTargetTuple } from "./types";
import { Store } from "./index";

/**
 * Get stores and observe their changes
 * @deprecated Perfer useStore to observe store one by one.
 */
export default function useStores
  <S extends ObserveTargetTuple>(...targets: S): InjectedInstances<S> {

  const normalizedTargets = targets.map(normalizeTarget);

  const providedStores = useContext(SimstateContext);

  if (!providedStores) {
    throw noProviderError();
  }

  const storesWithDeps = normalizedTargets.map((target: NormalizedObserveTarget) => {
    const storeType = target[0];
    const instance = providedStores.get(storeType);
    if (!instance) {
      throw notProvidedError(storeType);
    }
    return [instance, target[1]] as [Store<any>, Dependency | undefined];
  });

  // dummy state used to cause update
  const [, update] = useState({});

  // create a persistent update function
  const listener = useCallback(() => update({ }), []);

  useLayoutEffect(() => { // use layout effect to priorize subscription to location update in the top
    storesWithDeps.forEach(([store, dep]) => store.subscribe(listener, dep));

    return () => {
      storesWithDeps.forEach(([store, deps]) => store.unsubscribe(listener));
    };
  }, storesWithDeps.map(([store]) => store));

  return storesWithDeps.map((x) => x[0]) as InjectedInstances<S>;
}
