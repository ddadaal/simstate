import { normalizeTarget } from "./common";
import { Dependency, InjectedInstances, ObserveTargetTuple } from "./types";
import useStore from "./useStore";
import { StoreType } from "./Store";

/**
 * Use this function to get typecheck when passing parameters to {@link useStores}
 * @param storeType the types of store to be observed
 * @param dep the dependencies
 */
export function target<T extends StoreType<any>>(storeType: T, dep: Dependency<T>): [T, Dependency<T>] {
  return [storeType, dep];
}

/**
 * Get stores and observe their changes,
 * @deprecated Perfer {@link useStore} to observe one store at one time
 * @param targets target stores
 * @return the instances of stores
 */
export default function useStores
  <S extends ObserveTargetTuple>(...targets: S): InjectedInstances<S> {

  return targets.map((target) => useStore(...normalizeTarget(target))) as InjectedInstances<S>;
}
