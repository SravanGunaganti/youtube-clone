import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { emailRegex, passwordRegex } from "../utils/validators";
import { toast } from "react-toastify";
import { userAPI } from "../services/api";
const SignUp = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const onSubmit = async (data) => {
    try {
      const res = await userAPI.register({
        username: data.username,
        email: data.email,
        password: data.password,
      });

      if (res.success) {
        toast.success(res.message || "Registered successfully!");
        navigate("/signin");
      } else {
        toast.error(res?.error?.message || "Registration failed.");
      }
    } catch (error) {
      const errMsg =
        error?.response?.data?.error?.message ||
        error?.message ||
        "Registration failed. Please try again.";
      toast.error(errMsg);
    }
  };
  return (
    <div className="fixed inset-0  z-100 bg-gray-100 flex items-center justify-center ">
      <div className="bg-transparent w-full min-h-full max-h-full py-4 overflow-y-auto flex flex-col">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col bg-white p-8 rounded-lg shadow-xl h-full w-80 mx-auto my-auto">
          <div className="order-1 w-full flex flex-none justify-center items-center mb-4">
            <img
              src="https://www.gstatic.com/youtube/img/branding/youtubelogo/svg/youtubelogo.svg"
              alt="Logo"
              className={`h-[30px]`}
            />
          </div>
          <div className="mb-4 order-3">
            <label className="block mb-1 font-medium" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter email"
              autocomplete="username"
              className="w-full bg-white border border-gray-300 rounded-lg p-2 outline-0"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: emailRegex,
                  message:
                    "Please enter a valid email address. Please ensure it follows the standard format like: example@domain.com",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-600 text-sm mb-4">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="mb-4 order-2">
            <label className="block mb-1 font-medium" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter Username"
              autoComplete="name"
              className="w-full bg-white border border-gray-300 rounded-lg p-2 outline-0"
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && (
              <p className="text-red-600 text-sm mb-4">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="mb-4 order-4">
            <label className="block mb-1 font-medium" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              autoComplete="off"
              minLength={6}
              placeholder="Enter password"
              className="w-full bg-white border border-gray-300 rounded-lg p-2 outline-0"
              {...register("password", {
                required: "Password is required",
                pattern: {
                  value: passwordRegex,
                  message:
                    "Password must start with uppercase and contain lowercase, digit, and special character",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-600 text-sm mb-4">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            disabled={isSubmitting}
            className="order-5 w-full mt-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 shadow-lg">
            {isSubmitting ? "Registering..." : "SignUp"}
          </button>
          <p className="order-6 text-sm text-center mt-2">
            Already Registered?{" "}
            <Link to="/signin" className="text-blue-500 hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
export default SignUp;
