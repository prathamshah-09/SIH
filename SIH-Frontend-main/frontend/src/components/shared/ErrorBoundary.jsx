import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // You can log error to an external service here
    console.error('ErrorBoundary caught an error:', error, info);
    this.setState({ info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-sm text-gray-600 mb-4">An error occurred while rendering this section. You can try reloading the page.</p>
          <details className="whitespace-pre-wrap bg-gray-50 p-3 rounded border text-xs text-red-700">
            {this.state.error && this.state.error.toString()}
            {this.state.info && this.state.info.componentStack}
          </details>
          <div className="mt-4">
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded">Reload</button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
