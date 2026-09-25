import { ComponentType, createElement } from "react";

export function MainPage<P extends object>(Component: ComponentType<P>) {
  return function Wrapped(props: P) {
    return (
      <div className="main-page">
        {createElement<P>(Component, props)}
      </div>
    );
  };
}