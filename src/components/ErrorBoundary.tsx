// src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import Button from './Button';
import Card from './Card';
import Container from './Container';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree and displays a fallback UI
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('Error caught by boundary:', error, errorInfo);
    }
    
    // In production, you would send this to an error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <Container>
          <Card>
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem'
            }}>
              <div style={{ fontSize: '4rem' }}>⚠️</div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626' }}>
                Oops! Something went wrong
              </h1>
              <p style={{ color: '#6b7280', maxWidth: '500px' }}>
                We're sorry for the inconvenience. Please try refreshing the page or contact support if the problem persists.
              </p>
              {import.meta.env.DEV && this.state.error && (
                <details style={{ 
                  marginTop: '1rem', 
                  textAlign: 'left', 
                  padding: '1rem',
                  background: '#f3f4f6',
                  borderRadius: '0.5rem',
                  maxWidth: '600px',
                  width: '100%'
                }}>
                  <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Error Details (Development Only)
                  </summary>
                  <pre style={{ 
                    fontSize: '0.875rem', 
                    overflow: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}>
                    {this.state.error.message}
                    {'\n\n'}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Button variant="primary" size="md" onClick={this.handleReset}>
                  Try Again
                </Button>
                <Button variant="secondary" size="md" onClick={() => window.location.href = '/'}>
                  Go Home
                </Button>
              </div>
            </div>
          </Card>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
