import React from "react";
import StoreConsumer, { ConsumerActions } from "./StoreConsumer";
import { Omit } from "./types";

export type WithStoresProps = ConsumerActions;

/**
 * Higher-Order component usage
 * @param WrappedComponent
 */
export default function withStores
  <P extends {}>(WrappedComponent: React.ComponentType<P & WithStoresProps>) {
    const Component = (props: P) => (
      <StoreConsumer>
        {(actions) => {
          return (
            <WrappedComponent
              {...actions}
              {...props}
            />
          );
        }}
      </StoreConsumer>
    );

    return Component as unknown as React.ComponentType<Omit<P, keyof WithStoresProps>>;
}
