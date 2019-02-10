import { StoreType } from '.';

export function noProviderError(): Error {
  return new Error("Wrap your component in a StoreProvider.");
}

export function notProvidedError(storeType: StoreType<any>): Error {
  return new Error(`${storeType.name} has not been provided or specified.`);
}
