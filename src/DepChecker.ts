import { ArrayComparerDep, CustomComparerDep, Dep, DepItem } from "./types";

export type DepChecker = (prev: object, curr: object) => boolean;

function fullObserverHandler() {
  return true;
}

function customComparerHandler(dep: CustomComparerDep<{}>) {
  return (prev: object, curr: object) => {
    return dep(prev, curr);
  };
}

function mapStateWithDepItem(state: object) {
  return (dep: DepItem<{}>) => {
    if (typeof dep === "function") {
      return dep(state);
    } else {
      return state[dep];
    }
  };
}

function arrayComparerHandler(dep: ArrayComparerDep<any>) {

  return (prev: object, curr: object) => {
    const prevStates = dep.map(mapStateWithDepItem(prev));
    const nextStates = dep.map(mapStateWithDepItem(curr));

    return prevStates.some((value, index) => !Object.is(value, nextStates[index]));

  };
}

export function getChecker(dep: Dep | undefined): DepChecker {

  if (!dep) {
    return fullObserverHandler;
  } else if (typeof dep === "function") {
    return customComparerHandler(dep);
  } else {
    return arrayComparerHandler(dep);
  }

}
