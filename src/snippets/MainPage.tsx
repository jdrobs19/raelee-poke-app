import { ComponentType } from "react";

export function MainPage<P>(Component: ComponentType<P>) {
  const WrappedComponent = Component as ComponentType<any>;

  return function Wrapped(props: P) {
    return (
      <div className="main-page">
        <WrappedComponent {...(props as any)} />
      </div>
    );
  };
}