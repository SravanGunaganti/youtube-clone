import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { use, useEffect } from "react";
import { handleAPIError, userAPI } from "../services/api";

const SignIn = () => {
  const { authUser, login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const onSubmit = async (data) => {
    try {
      const res = await userAPI.login({
        email: data.email,
        password: data.password,
      });

      if (res.success) {
        login(res);
        toast.success(res?.message || "Login successfully!");
        navigate(`/`);
      } else {
        toast.error(res?.data?.error?.message || "Login failed. Try again!");
      }
    } catch (e) {
      toast.error(handleAPIError(e)?.message || "Login failed Try again!");
    }
  };

  useEffect(() => {
    if (authUser) {
      navigate("/");
    }
  }, []);

  return (
    <div className="fixed inset-0  z-50 bg-gray-100 flex items-center justify-center ">
      <div className="bg-transparent w-full min-h-full max-h-full py-4 overflow-y-auto flex flex-col">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col bg-white p-8 rounded-lg shadow-xl h-full w-80 mx-auto my-auto">
          <div className="w-full flex flex-none justify-center items-center mb-4">
            <img
              src="https://www.gstatic.com/youtube/img/branding/youtubelogo/svg/youtubelogo.svg"
              alt="Logo"
              className={`h-[30px]`}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full bg-white border border-gray-300 rounded-lg p-2 outline-0"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-600 text-sm mb-4">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              minLength={6}
              placeholder="Enter password"
              autoComplete="on"
              className="w-full bg-white border border-gray-300 rounded-lg p-2 outline-0"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="text-red-600 text-sm mb-4">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            disabled={isSubmitting}
            className="w-full mt-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 shadow-lg">
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
          <p className="text-sm text-center mt-2">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
