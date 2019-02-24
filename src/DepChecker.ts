import { ArrayComparerDep, CustomComparerDep, Dependency, DepItem } from "./types";
import { compareArray } from "./common";

export type DepChecker = (prev: object, curr: object) => boolean;

function fullObserverHandler() {
  return true;
}

function customComparerHandler(comparer: CustomComparerDep<any>) {
  return (prev: object, curr: object) => {
    return !comparer(prev, curr);
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

    return !compareArray(prevStates, nextStates);

  };
}

export function getChecker(dep: Dependency | undefined): DepChecker {

  if (!dep) {
    return fullObserverHandler;
  } else if (typeof dep === "function") {
    return customComparerHandler(dep);
  } else {
    return arrayComparerHandler(dep);
  }

}
