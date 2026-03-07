import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="main-content" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <h1>Something went wrong</h1>
          <p>Please try refreshing the page.</p>
        </main>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
