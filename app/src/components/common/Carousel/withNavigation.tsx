// withNavigation.tsx
import { useNavigate } from "react-router";
import React from "react";

export function withNavigation(Component: React.ComponentType<any>) {
  return function WrappedComponent(props: any) {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
}
