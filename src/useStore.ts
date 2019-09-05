import { useContext } from "react";
import { StoreInit } from "./types";
import { contextMap } from "./contextMap";

export default function useStore<TReturnValue>(storeInit: StoreInit<TReturnValue, unknown[]>): TReturnValue {
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
