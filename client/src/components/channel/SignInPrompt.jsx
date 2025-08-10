import { Link } from "react-router-dom";
// SignInPrompt component
const SignInPrompt = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">
          Sign in to view this channel
        </h2>
        <p className="text-gray-600 mb-6">
          You need to be signed in to view channel content.
        </p>
        <Link
          to="/signin"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default SignInPrompt;
