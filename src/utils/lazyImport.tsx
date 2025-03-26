import * as React from "react";

export function lazyImport<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
): Promise<T> {
  return factory().then((module) => module.default);
}
