import { StoreType } from ".";
import { ObserveTarget, Dep, NormalizedObserveTarget } from "./types";

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

export function targets<T extends StoreType<any>>(storeType: T, deps: Dep<T>[]): [T, Dep<T>[]] {
  return [storeType, deps];
}
