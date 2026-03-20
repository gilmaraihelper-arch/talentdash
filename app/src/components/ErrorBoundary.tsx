import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="max-w-md w-full mx-auto p-8 bg-white rounded-2xl shadow-lg text-center">
            <div className="text-5xl mb-4">😕</div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Algo deu errado</h1>
            <p className="text-slate-500 mb-6">
              Ocorreu um erro inesperado. Por favor, recarregue a página para continuar.
            </p>
            {this.state.error && (
              <details className="text-left mb-6 bg-slate-100 rounded-lg p-4">
                <summary className="cursor-pointer text-sm font-medium text-slate-600">
                  Detalhes técnicos
                </summary>
                <pre className="mt-2 text-xs text-red-600 whitespace-pre-wrap break-words">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Recarregar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
