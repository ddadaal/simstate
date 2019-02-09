import { StoreType } from "..";
import { ProviderContext } from "../StoreProvider";
import { useContext, useState, useRef, useLayoutEffect } from "react";

export default function useStore<ST extends StoreType<any>>
(storeType: ST): InstanceType<ST> {
  const providedStores = useContext(ProviderContext);

  const store = providedStores.get(storeType) as InstanceType<ST> | undefined;

  if (!store) {
    throw new Error(`${storeType.name} hasn't been provided.`);
  }

  // dummy state used to cause update
  const [_, update] = useState({});

  // create a persistent update function
  const { current: listener } = useRef(() => update({}));

  useLayoutEffect(() => { // use layout effect to priorize subscription to location update in the top
    store.subscribe(listener);

    return () => {
      store.unsubscribe(listener);
    };
  }, []);

  return store;
}
