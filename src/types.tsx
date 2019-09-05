import React from "react";

export type StoreInit<TReturnValue, TParams extends unknown[]> = (...params: TParams) => TReturnValue;

export interface Store<TReturnValue, TParams extends unknown[]> {
  storeInit: StoreInit<TReturnValue, TParams>;
  Provider: React.ComponentType;
}
