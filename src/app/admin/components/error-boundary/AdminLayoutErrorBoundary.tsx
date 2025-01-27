'use client';

import { Component, ReactNode } from 'react';

/**
 * Props interface defining the expected children prop.
 */
interface Props {
  children: ReactNode;
}

/**
 * State interface to manage the error state.
 */
interface State {
  hasError: boolean;
}

/**
 * AdminLayoutErrorBoundary is a React Error Boundary component.
 * It catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 */
export class AdminLayoutErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    // Initialize state to track if an error has occurred.
    this.state = { hasError: false };
  }

  /**
   * Updates the state when an error is thrown in a child component.
   * This lifecycle method is invoked after an error has been thrown by a descendant component.
   * @param error - The error that was thrown.
   * @returns An object to update state.
   */
  static getDerivedStateFromError(_: Error): State {
    // Update state to indicate that an error has been encountered.
    return { hasError: true };
  }

  /**
   * Logs error information when an error is caught.
   * This lifecycle method is invoked after an error has been thrown by a descendant component.
   * @param error - The error that was thrown.
   * @param errorInfo - An object with additional information about the error.
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error and error information to the console for debugging purposes.
    console.error('AdminLayout Error:', error, errorInfo);
  }

  /**
   * Renders the component.
   * If an error has been caught, it displays a fallback UI.
   * Otherwise, it renders the child components normally.
   * @returns JSX Element to render.
   */
  render() {
    if (this.state.hasError) {
      // Fallback UI displayed when an error is caught.
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            {/* Error message */}
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            {/* Button to retry rendering the child components */}
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => this.setState({ hasError: false })} // Resets the error state to attempt re-rendering.
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    // If no error, render the child components normally.
    return this.props.children;
  }
}
