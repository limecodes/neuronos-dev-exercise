import { ErrorBoundary } from 'react-error-boundary'

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div
      role="alert"
      className="p-4 bg-red-100 text-red-800 rounded"
      style={{ width: 800, height: 800 }}
    >
      <h2 className="font-bold text-lg">Something went wrong:</h2>
      <p>{error.message}</p>
    </div>
  )
}

export default function WithErrorBoundary({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        console.error('Error caught by ErrorBoundary', error, info)
      }}
    >
      {children}
    </ErrorBoundary>
  )
}
