import { Component, type ErrorInfo, type ReactNode } from "react";
import { useLocation } from "react-router";

import ErrorScreen from "./ErrorScreen";

type Props = {
  children: ReactNode;
};

type State = {
  error: Error | null;
};

class AppErrorBoundaryInner extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Unhandled app render error", error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorScreen
          title="This page hit an error"
          copy="The app could not render this view. Try another page, or refresh after the data updates."
          msg={this.state.error.message}
        />
      );
    }

    return this.props.children;
  }
}

export default function AppErrorBoundary({ children }: Props) {
  const location = useLocation();

  return (
    <AppErrorBoundaryInner key={`${location.pathname}?${location.search}`}>
      {children}
    </AppErrorBoundaryInner>
  );
}
