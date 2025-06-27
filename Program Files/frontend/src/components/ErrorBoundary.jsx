import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("Caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const { error, errorInfo } = this.state;
      return (
        <div style={{ padding: '2rem' }}>
          <h2>Something went wrong.</h2>
          <pre style={{ color: 'red' }}>{error?.message}</pre>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>
            {errorInfo?.componentStack || 'No stack trace available'}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
