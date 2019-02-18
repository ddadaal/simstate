import React from "react";
import { StoreType } from ".";
import StoreConsumer from "./StoreConsumer";
import { ObserveTarget, Omit, ObservedStoreInstance, ObserveTargetTuple, InjectedInstances } from "./types";

interface InjectedProps<T extends ObserveTargetTuple> {
  stores: InjectedInstances<T>;
}

export default function withStores<T extends ObserveTargetTuple>(...targets: T) {
  return <P extends {}>
  (WrappedComponent: React.ComponentType<P & InjectedProps<T>>) => {

    const Component = (props: P) => (
      <StoreConsumer targets={targets}>
        {(...stores) => {
          return (
            <WrappedComponent
              stores={stores}
              {...props}
            />
          );
        }}
      </StoreConsumer>
    );

    return Component as any as React.ComponentType<Omit<P, keyof InjectedProps<T>>>;
  };
}
