import React from "react";
import StoreConsumer, { ConsumerActions } from "./StoreConsumer";
import { Omit } from "./types";

export default function withStores
  <P extends {}>(WrappedComponent: React.ComponentType<P & ConsumerActions>) {
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

    return Component as unknown as React.ComponentType<Omit<P, keyof ConsumerActions>>;
}
