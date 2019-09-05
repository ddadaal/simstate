import React from "react";
import { mount } from "enzyme";

describe("Metatest", () => {

  test("createStore should add")

  test("Empty test should run without error", () => {


  });

  test("Enzyme should work properly.", () => {
    const testRenderer = mount(<span>42</span>);

    expect(testRenderer.find("span").text()).toBe("42");
  });

});
