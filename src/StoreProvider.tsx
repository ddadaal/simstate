import React, { createContext, useRef } from "react";
import { Store, StoreType } from ".";

type IProviderContext = Map<StoreType<any>, Store<any>>;

export const ProviderContext = createContext<IProviderContext>(new Map());

interface Props {
  stores: Store<any>[];
  children: React.ReactNode;
}

export default function StoreProvider(props: Props) {

  const mapRef = useRef<IProviderContext | null>(null);

  if (!mapRef.current) {
    const map: IProviderContext = new Map();
    props.stores.forEach((store) => {
      map.set(store.constructor as any, store);
    });
    mapRef.current = map;
  }

  return (
    <ProviderContext.Provider value={mapRef.current}>
      {props.children}
    </ProviderContext.Provider>
  );
}
