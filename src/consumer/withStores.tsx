import React from "react";
import { StoreType } from "..";
import StoreConsumer, { WithStoresProps } from "./StoreConsumer";

declare type Omit<T, K extends keyof any> = T extends any ? Pick<T, Exclude<keyof T, K>> : never;

export default function withStores(...storeTypes: Array<StoreType<any>>) {
  return <P extends {}>
  (WrappedComponent: React.ComponentType<P & WithStoresProps>) => {

    const Component = (props: P) => (
      <StoreConsumer storeTypes={storeTypes}>
        {({ useStore }) => {

          return (
            <WrappedComponent
              useStore={useStore}
              {...props}
            />
          );
        }

        }
      </StoreConsumer>
    );

    return Component as any as React.ComponentType<Omit<P, keyof WithStoresProps>>;
  };
}
