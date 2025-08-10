import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";

function RootErrorBoundary() {
  const error = useRouteError();

  // Handle different types of errors
  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      // Handlling specific status codes
      case 404:
        return <PageNotFound />;
      case 401:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
            <div className="text-center max-w-2xl mx-auto">
              <h1 className="text-4xl font-bold mb-4">Unauthorized</h1>
              <p className="text-lg text-gray-600 mb-6">
                Please sign in to access this page
              </p>
              <Link
                to="/signin"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors duration-200 text-center">
                SignIn
              </Link>
            </div>
          </div>
        );
      // Default case
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
            <div className="text-center max-w-2xl mx-auto">
              <h1 className="text-4xl font-bold  mb-4">{error.status} Error</h1>
              <p className="text-lg text-gray-600 mb-6">
                {error.data?.message ||
                  "An unexpected error occurred. Please try again."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors duration-200 text-center">
                  Go to Home g
                </Link>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300  font-medium rounded-full transition-colors duration-200">
                  Try Again
                </button>
              </div>
            </div>
          </div>
        );
    }
  }

  // Handle non-Response errors
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Unexpected Error</h1>
        <p className="text-lg text-gray-600 mb-6">
          {error.message || "Something went wrong. Please try again later"}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors duration-200 text-center">
            Go to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300  font-medium rounded-full transition-colors duration-200">
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default RootErrorBoundary;