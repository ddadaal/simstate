import { StoreInit } from "./types";

export const contextMap = new Map<StoreInit<unknown, unknown[]>, React.Context<unknown | null>>();
