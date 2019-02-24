import { StoreType } from ".";

export type Omit<T, K extends keyof any> = T extends any ? Pick<T, Exclude<keyof T, K>> : never;

export type DepItem<S extends any> =
  | keyof S
  | ((state: S) => unknown)
  ;

export type ArrayComparerDep<S extends any> =
  [...DepItem<S>[]]
  ;

export type CustomComparerDep<S extends any> =
  ((prev: S, next: S) => boolean)
  ;

export type Dependency<T extends StoreType<any> = StoreType<any>> =
  T extends StoreType<infer S>
  ? ArrayComparerDep<S> | CustomComparerDep<S>
  : never
  ;

export type PartialObserveTarget<T extends StoreType<any> = StoreType<any>> =
  [T, Dependency<T>];

export type ObserveTarget<T extends StoreType<any> = StoreType<any>> =
  | T
  | PartialObserveTarget<T>
  ;

export type NormalizedObserveTarget<T extends ObserveTarget = ObserveTarget> =
  [ObservedStoreType<T>, Dependency<ObservedStoreType<T>> | undefined];

export type ObservedStoreType<P extends ObserveTarget> =
  P extends StoreType<any> ? P
  : P extends [infer S, Dependency]
  ? S extends StoreType<any> ? S
  : never
  : never
  ;

export type ObserveTargetTuple = [ObserveTarget, ...ObserveTarget[]];

export type ObservedStoreInstance<P extends ObserveTarget> = InstanceType<ObservedStoreType<P>>;

export type InjectedInstances<S extends ObserveTarget[]>
  // @ts-ignore
  = { [P in keyof S]: ObservedStoreInstance<S[P]> };
