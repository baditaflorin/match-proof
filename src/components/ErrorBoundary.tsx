import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  error?: Error
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {}

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (import.meta.env.DEV) {
      console.error(error, info)
    }
  }

  render() {
    if (this.state.error) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-stone-50 p-6 text-slate-950">
          <section className="max-w-md rounded-lg border border-red-200 bg-white p-5 shadow-sm">
            <h1 className="text-xl font-semibold">Match Proof stopped safely</h1>
            <p className="mt-2 text-slate-700">
              Refresh the page to reset the local UI. Your saved profile stays in this browser.
            </p>
          </section>
        </main>
      )
    }

    return this.props.children
  }
}
