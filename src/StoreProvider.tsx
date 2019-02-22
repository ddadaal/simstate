import React, { createContext, useState, useContext, useLayoutEffect } from "react";
import { Store, StoreType } from ".";

export type ISimstateContext = Map<StoreType<any>, Store<any>>;

export const SimstateContext = createContext<ISimstateContext | undefined>(undefined);

interface Props {
  stores: Store<any>[];
  children: React.ReactNode;
}

function contextEqual(a: ISimstateContext, b: ISimstateContext) {
  if (a === b) {
    return true;
  }

  if (a.size !== b.size) {
    return false;
  }

  for (const [key, val] of a) {
    if (b.get(key) !== val) {
      return false;
    }
  }

  return true;
}

function constructMap(prev: ISimstateContext | undefined, stores: Store<any>[]): ISimstateContext {
  const map: ISimstateContext = new Map(prev!); // new Map(undefined) will work

  stores.forEach((store) => {
    map.set(store.constructor as StoreType<any>, store);
  });

  return map;
}

export default function StoreProvider({ stores, children }: Props) {
  const context = useContext(SimstateContext);

  const currentMap = constructMap(context, stores);

  const [map, setMap] = useState(currentMap);

  useLayoutEffect(() => {
    if (!contextEqual(map, currentMap)) {
      setMap(currentMap);
    }
  });

  return (
    <SimstateContext.Provider value={map}>
      {children}
    </SimstateContext.Provider>
  );

}
