import React, { useState, useRef, useCallback } from "react";

export function testStore(initialValue: number) {
  const [value, setValue] = useState(initialValue);

  return { value, setValue };
}

export function noParamStore() {
  const [value, setValue] = useState(1);
  const [value2, setValue2] = useState(2);

  return { value, setValue, value2, setValue2 };
}

export function counterStore(initialValue: number) {
  const [value, setValue] = useState(initialValue);

  const incrementStep = useRef(1).current;
  const increment = useCallback(() => setValue(value + incrementStep), []);

  return { value, setValue, increment };
}

export class UpdateBlocker extends React.PureComponent {
  render() {
    return (
      this.props.children
    );
  }
}
