import { Component, type ErrorInfo, type ReactNode } from 'react';
import * as Sentry from '@sentry/react';
import styles from './ErrorBoundary.module.css';

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
    Sentry.captureException(error, { extra: { info } });
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className={`main-content ${styles.fallback}`}>
          <h1>Something went wrong</h1>
          <p>An unexpected error occurred. Try reloading the page.</p>
          <button
            type="button"
            onClick={this.handleReload}
            className={styles.reloadButton}
          >
            Reload page
          </button>
        </main>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
