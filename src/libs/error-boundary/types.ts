import React from 'react';

export interface FallbackProps {
  error: Error;
  resetError: () => void;
  stackTrace?: string;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  FallbackComponent?: React.ComponentType<FallbackProps>;
  onError?: (error: Error, stackTrace: string) => void;
  onReset?: () => void;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  stackTrace: string;
}
