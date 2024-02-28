import React from 'react';

export class ErrorBoundary extends React.Component<any, { hasError: boolean }> {
  constructor(props: any) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.log(error, errorInfo);

    this.setState({ hasError: true });
  }

  static getDerrivedStateFromError(error: Error) {
    console.log(error);

    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <div>Ooops... Error!</div>;
    }

    return this.props.children;
  }
}
