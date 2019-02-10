import { StoreType } from '.';

export function noProviderError(): Error {
  return new Error("Wrap your component in StoreProvider.");
}

export function notProvidedError(storeType: StoreType<any>): Error {
  return new Error(`${storeType.name} has not been provided.`);
}
