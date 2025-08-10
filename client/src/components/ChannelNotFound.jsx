import { isRouteErrorResponse, Link, useParams, useRouteError } from 'react-router-dom';
import { FaUserSlash } from 'react-icons/fa';

// ChannelNotFound component 
const ChannelNotFound = () => {
  // channelId from the URL
  const {channelId} = useParams();
  // error from the route
  const error = useRouteError();
  let title = "Unexpected Error";
  let errorMessage = "Something went wrong. Please try again later";
  if (isRouteErrorResponse(error) && (error.status === 400 || error.status === 404)) {
    title = "Channel Not Found";
    errorMessage = `The Channel you're looking for (ID: ${channelId}) doesn't exist or has been removed.`;
  }

    if(isRouteErrorResponse(error) && error.status === 500) {
      title = "Internal Server Error";
      errorMessage = "Something went wrong. Please try again later";
    }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
      <div className="text-center max-w-2xl mx-auto">
        <div className="flex justify-center mb-6">
          <FaUserSlash className="text-red-500 text-6xl" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
        <p className="text-lg text-gray-600 mb-8">
          {errorMessage}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors duration-200 text-center"
          >
            Go to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300  font-medium rounded-full transition-colors duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChannelNotFound;
