import React from "react";
import { Store } from "./types";

export interface StoreProviderProps {
  stores: Store<unknown, unknown[]>[];
}

const StoreProvider: React.FC<StoreProviderProps> = ({ stores, children }) => {
  let providersLayout: React.ReactElement = <>{children}</>;

  stores.forEach((Store) => {
    providersLayout = <Store.Provider>{providersLayout}</Store.Provider>
  });

  return providersLayout;
}

export default StoreProvider;
