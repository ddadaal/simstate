import { testStore, noParamStore } from "./common";
import {  createStore } from "../src";
import { contextMap } from "../src/contextMap";

describe("createStore", () => {

  beforeEach(() => contextMap.clear());

  it("should add an entry when a new store is passed into createStore.", () => {
    createStore(noParamStore);
    expect(contextMap.size).toEqual(1);

    createStore(testStore, 3);
    expect(contextMap.size).toEqual(2);
  });

  it("should reuse the context when multiple calls to one testStore", () => {
    createStore(noParamStore);
    const context1 = contextMap.get(testStore);
    expect(contextMap.size).toEqual(1);

    createStore(noParamStore);
    const context2 = contextMap.get(testStore);
    expect(contextMap.size).toEqual(1);
    expect(context1).toEqual(context2);
  });

});
