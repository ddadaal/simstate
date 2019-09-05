import { useState } from "react";

export function testStore() {
  const [value, setValue] = useState(42);

  return { value, setValue };
}

export function anotherStore(initialValue: number) {
  const [value1, setValue1] = useState(42);

  const [value2, setValue2] = useState(initialValue);

  return { value1, setValue1, value2, setValue2 };
}
