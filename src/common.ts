import { StoreType } from ".";

export function noProviderError(): Error {
  return new Error("Wrap your component in a StoreProvider.");
}

export function notProvidedError(storeType: StoreType<any>): Error {
  return new Error(`${storeType.name} has not been provided or specified.`);
}

// @ts-ignore
export type Instances<T extends StoreType<any>[]> = { [K in keyof T]: InstanceType<T[K]> };

export type Omit<T, K extends keyof any> = T extends any ? Pick<T, Exclude<keyof T, K>> : never;

export interface WithStoresProps {
  useStore: <ST extends StoreType<any>>(storeType: ST) => InstanceType<ST>;
  useStores: <T extends StoreType<any>[]>(...storeTypes: T) => Instances<T>;
}
