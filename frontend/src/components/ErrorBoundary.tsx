import { Component, type ErrorInfo, type ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';

interface Props {
  children: ReactNode;
  /** Override the default whole-page fallback. Used by per-route boundaries
   *  that want to keep the surrounding chrome (nav, footer) mounted. */
  fallback?: ReactNode;
  /** When this value changes, the boundary clears any error state. Lets a
   *  parent reset the boundary on route change without remounting the whole
   *  subtree (which would force the page below to remount on every nav). */
  resetKey?: string | number;
}

interface State {
  hasError: boolean;
  lastResetKey?: string | number;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): Partial<State> {
    return { hasError: true };
  }

  static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null {
    if (props.resetKey !== state.lastResetKey) {
      return { hasError: false, lastResetKey: props.resetKey };
    }
    return null;
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('ErrorBoundary caught:', error, info);
    import('@sentry/react').then(({ captureException }) =>
      captureException(error, { extra: { info } }),
    );
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback !== undefined) return this.props.fallback;
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
