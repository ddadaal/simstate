import React, { createContext } from "react";
import { StoreInit, Store } from "./types";
import { contextMap } from "./contextMap";


export default function createStore<TReturnValue, TParams extends unknown[]>(storeInit: StoreInit<TReturnValue, TParams>, ...params: TParams): Store<TReturnValue, TParams> {

  let Context = contextMap.get(storeInit) as React.Context<TReturnValue | null>;

  if (!Context) {
    Context = createContext<TReturnValue | null>(null);
    contextMap.set(storeInit, Context as React.Context<unknown | null>);
  }

  const Provider: React.FC = ({ children }) => {
    const returnValue = storeInit(...params);
    return <Context.Provider value={returnValue}>{children}</Context.Provider>;
  }

  return {
    storeInit,
    Provider: Provider,
  };

}
