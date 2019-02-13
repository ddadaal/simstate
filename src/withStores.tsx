import React from "react";
import { StoreType } from ".";
import StoreConsumer from "./StoreConsumer";
import { Omit, WithStoresProps } from "./common";

export default function withStores<T extends StoreType<any>[]>(...storeTypes: T) {
  return <P extends {}>
  (WrappedComponent: React.ComponentType<P & WithStoresProps>) => {

    const Component = (props: P) => (
      <StoreConsumer storeTypes={storeTypes}>
        {({ useStore, useStores }) => {

          return (
            <WrappedComponent
              useStore={useStore}
              useStores={useStores}
              {...props}
            />
          );
        }}
      </StoreConsumer>
    );

    return Component as any as React.ComponentType<Omit<P, keyof T>>;
  };
}
