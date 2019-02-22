import { StoreType } from ".";
import { ObserveTarget, NormalizedObserveTarget, Dependency } from "./types";

export function noProviderError(): Error {
  return new Error("Wrap your component in a StoreProvider.");
}

export function notProvidedError(storeType: StoreType<any>): Error {
  return new Error(`${storeType.name} has not been provided or specified.`);
}

export function normalizeTarget<T extends ObserveTarget>(target: T): NormalizedObserveTarget<T> {
  if (typeof target === "function") {
    return [target as any, undefined];
  } else {
    return target as any;
  }
}

export function compareArray(arr1: any[], arr2: any[]): boolean {
  return arr1.length === arr2.length && arr1.every((value, index) => Object.is(value, arr2[index]));
}

/**
 * Use
 * @param storeType
 * @param dep
 */
export function target<T extends StoreType<any>>(storeType: T, dep: Dependency<T>): [T, Dependency<T>] {
  return [storeType, dep];
}
