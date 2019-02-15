import { StoreType, Store } from ".";
import { useContext, useState, useRef, useLayoutEffect } from "react";
import { noProviderError, notProvidedError, Instances, Dep } from "./common";
import { SimstateContext } from "./StoreProvider";

export function makeTuple<T extends StoreType<any>>(storeType: T, deps: Dep<T>[]): [T, Dep<T>[]] {
  return [storeType, deps];
}

type Param<T extends StoreType<any>> =
  | T
  | [T, Dep<T>[]]
  ;

type StoreInstanceType<P extends Param<any>> =
  P extends StoreType<any> ? InstanceType<P>
  : P extends [infer S, Dep<infer S>[]]
    ? S extends StoreType<any> ? InstanceType<S>
    : never
  : never
  ;

type InjectedInstances<Params extends Param<any>[]> = { [P in keyof Params]: StoreInstanceType<Params[P]> };

/**
 * Get stores and observe their changes.
 * @param storeTypes the type of the stores to inject
 */
export default function useStores<Params extends Param<any>[]>(...deps: Params): InjectedInstances<Params> {
  const providedStores = useContext(SimstateContext);

  if (!providedStores) {
    throw noProviderError();
  }

  const stores = deps.map((dep: Param<StoreType<any>>) => {
    const storeType = typeof dep === "function" ? dep : dep[0];
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

  return stores as any;
}

class AStore extends Store<{ aStoreProp: number }> { }
class BStore extends Store<{ bStoreProps: number }> { }

const [aStore] = useStores(AStore);
const [bStore, a] = useStores([BStore, ["bStoreProps"]], AStore);
