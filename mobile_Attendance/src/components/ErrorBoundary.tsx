import React, { useState, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
  onError?: (error: Error) => void;
  testID?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary component - Catches errors gracefully and displays error message with retry option
 * Prevents app crashes from component errors
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error) {
    console.error('ErrorBoundary caught error:', error);
    this.props.onError?.(error);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallback, testID = 'error-boundary' } = this.props;

    if (hasError && error) {
      if (fallback) {
        return fallback(error, this.handleRetry);
      }

      return (
        <View style={styles.container} testID={testID}>
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Icon name="alert-circle" size={56} color="#ff4444" />
            </View>

            <Text style={styles.title}>Something went wrong</Text>

            <View style={styles.errorBox}>
              <Text style={styles.errorMessage}>{error.message}</Text>
            </View>

            <Text style={styles.description}>
              The app encountered an unexpected error. Please try again or contact support if the problem persists.
            </Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={this.handleRetry}
              testID={`${testID}-retry`}
            >
              <Icon name="refresh" size={18} color="#fff" />
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  errorBox: {
    backgroundColor: '#fff3f3',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ff4444',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 20,
    width: '100%',
  },
  errorMessage: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#0066cc',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
