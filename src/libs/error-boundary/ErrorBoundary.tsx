import React, { Component, ErrorInfo } from 'react';
import FallbackComponent from './FallbackComponent';
import { ErrorBoundaryProps, ErrorBoundaryState } from './types';

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      stackTrace: '',
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const stackTrace = errorInfo.componentStack || '';
    this.setState({ stackTrace });

    if (__DEV__) {
      console.error('🚨 [ErrorBoundary] Caught unhandled render error:', error, stackTrace);
    }

    if (typeof this.props.onError === 'function') {
      try {
        this.props.onError(error, stackTrace);
      } catch (e) {
        if (__DEV__) {
          console.warn('[ErrorBoundary] Failed to execute onError callback:', e);
        }
      }
    }
  }

  resetError = (): void => {
    if (typeof this.props.onReset === 'function') {
      try {
        this.props.onReset();
      } catch (e) {
        if (__DEV__) {
          console.warn('[ErrorBoundary] Failed to execute onReset callback:', e);
        }
      }
    }

    this.setState({
      hasError: false,
      error: null,
      stackTrace: '',
    });
  };

  render(): React.ReactNode {
    const { hasError, error, stackTrace } = this.state;
    const { children, FallbackComponent: CustomFallback } = this.props;

    if (hasError && error) {
      const Fallback = CustomFallback || FallbackComponent;
      return <Fallback error={error} resetError={this.resetError} stackTrace={stackTrace} />;
    }

    return children;
  }
}

export default ErrorBoundary;
