import React from "react";

export type StoreInit<TReturnValue, TParams extends unknown[]> = (...params: TParams) => TReturnValue;

export interface Store {
  Provider: React.ComponentType;
}
