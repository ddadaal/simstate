import React, { useCallback, useState } from "react";
import { useStore } from "../src";

function AStore() {
  const [count, setCount] = useState(1);
  return { count, setCount };
}

const MyComponent: React.FC = () => {
  const aStore = useStore(AStore);

  const increment = useCallback(() => {
    aStore.setCount(aStore.count + 1);
  }, [aStore]); // make sure aStore is one of the deps.

  return (
    <div>
      <span>{aStore.count}</span>
      <button onClick={increment}>Increment</button>
    </div>
  )
}

