import { StoreType } from ".";
export type Omit<T, K extends keyof any> = T extends any ? Pick<T, Exclude<keyof T, K>> : never;

export type Dep<T extends StoreType<any> = StoreType<any>> =
  T extends StoreType<infer S>
  ? (keyof S)
  : never
  ;

export type PartialObserveTarget<T extends StoreType<any> = StoreType<any>> =
  [T, Dep<T>[]];

export type ObserveTarget<T extends StoreType<any> = StoreType<any>> =
  | T
  | PartialObserveTarget<T>
  ;

export type NormalizedObserveTarget<T extends ObserveTarget> =
  [ObservedStoreType<T>, Dep<ObservedStoreType<T>>[] | undefined];

export type ObservedStoreType<P extends ObserveTarget> =
  P extends StoreType<any> ? P
  : P extends [infer S, Dep<infer S>[]]
  ? S extends StoreType<any> ? S
  : never
  : never
  ;

export type ObserveTargetTuple = [ObserveTarget, ...ObserveTarget[]];

export type ObservedStoreInstance<P extends ObserveTarget> = InstanceType<ObservedStoreType<P>>;

export type InjectedInstances<S extends ObserveTarget[]>
  // @ts-ignore
  = { [P in keyof S]: ObservedStoreInstance<S[P]> };
