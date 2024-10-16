export default function EmptyMessages() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h2 className="text-xl font-semibold text-gray-700 mb-2">No Messages</h2>
      <p className="text-gray-500">
        It looks like there are no messages at the moment.
      </p>
      <div className="mt-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 8l7.89 5.26a4 4 0 004.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>
    </div>
  )
}
