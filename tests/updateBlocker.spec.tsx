import React, { useState, useCallback } from "react";
import { UpdateBlocker } from "./common";
import { mount } from "enzyme";

describe("UpdateBlocker", () => {
  it("should block update.", () => {
    const MyComponent: React.FC<{ value: number }> = ({ value }) => <span>{value}</span>;

    const Component: React.FC = () => {
      const [value, setValue] = useState(1);
      const increment = useCallback(() => setValue(value + 1), [value]);
      return (
        <div>
          <UpdateBlocker>
            <MyComponent value={value} />
          </UpdateBlocker>
          <button onClick={increment}>Increment</button>
        </div>
      )
    };

    const wrapper = mount(<Component />);

    expect(wrapper.find("span").text()).toEqual("1");
    wrapper.find("button").simulate("click");

    expect(wrapper.find("span").text()).toEqual("1");
  });

});
