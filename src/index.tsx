import React, { createContext, useContext } from "react";

export type StoreInit<TReturnValue, TParams extends unknown[]> = (...params: TParams) => TReturnValue;

export interface Store {
  Provider: React.ComponentType;
}

export interface StoreProviderProps {
  stores: Store[];
}

const contextMap = new Map<StoreInit<unknown, unknown[]>, React.Context<unknown | null>>();

export const StoreProvider: React.FC<StoreProviderProps> = ({ stores, children }) => (
  stores.reduce((prev, Store) => <Store.Provider>{prev}</Store.Provider>, <>{children}</>)
);

export function createStore<TReturnValue, TParams extends unknown[]>
  (storeInit: StoreInit<TReturnValue, TParams>, ...params: TParams): Store {

  let Context = contextMap.get(storeInit) as React.Context<TReturnValue | null>;

  if (!Context) {
    Context = createContext<TReturnValue | null>(null);
    contextMap.set(storeInit, Context as React.Context<unknown | null>);
  }

  const Provider: React.FC = ({ children }) => {
    const returnValue = storeInit(...params);
    return <Context.Provider value={returnValue}>{children}</Context.Provider>;
  }

  return { Provider };

}

export function useStore<TReturnValue>(storeInit: StoreInit<TReturnValue, unknown[]>): TReturnValue {
  const Context = contextMap.get(storeInit) as React.Context<TReturnValue | null>;
  if (!Context) {
    throw new Error(`${storeInit.name} is not created! Call createStore on this storeInit before using it!`);
  }

  const value = useContext(Context);
  if (!value) {
    throw new Error(`${storeInit.name} is not provided! Wrap your components with StoreProvider.`);
  }

  return value;
}
