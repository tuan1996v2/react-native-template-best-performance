import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import FallbackComponent from './FallbackComponent';
import { ErrorBoundaryProps, FallbackProps } from './types';

export { ErrorBoundary, FallbackComponent };
export type { ErrorBoundaryProps, FallbackProps };

/**
 * HOC to wrap any screen or component with ErrorBoundary
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>,
): React.FC<P> {
  const ComponentWithErrorBoundary: React.FC<P> = props => (
    <ErrorBoundary {...errorBoundaryProps}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  ComponentWithErrorBoundary.displayName = `withErrorBoundary(${displayName})`;

  return ComponentWithErrorBoundary;
}

export default ErrorBoundary;
