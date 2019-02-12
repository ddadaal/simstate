import React, { createContext } from "react";
import { Store, StoreType } from ".";

export type ISimstateContext = Map<StoreType<any>, Store<any>>;

export const SimstateContext = createContext<ISimstateContext | undefined>(undefined);

interface Props {
  stores: Store<any>[];
  children: React.ReactNode;
}

// interface State {
//   map: ISimstateContext;
// }

function arrayEquals<T>(array1: T[], array2: T[]) {
  const len = array1.length;
  if (len !== array2.length) {
    return false;
  }

  for (let i = 0; i < len; i++) {
    if (array1[i] !== array2[i]) {
      return false;
    }
  }

  return true;

}

function constructMap(stores: Store<any>[]) {
  const map: ISimstateContext = new Map();
  stores.forEach((store) => {
    map.set(store.constructor as StoreType<any>, store);
  });
  return map;
}

export default class StoreProvider extends React.Component<Props> {

  shouldComponentUpdate(prevProps: Props) {
    return !arrayEquals(prevProps.stores, this.props.stores);
  }

  render() {

    const map = constructMap(this.props.stores);

    return (
      <SimstateContext.Provider value={map}>
        {this.props.children}
      </SimstateContext.Provider>
    );
  }
}
