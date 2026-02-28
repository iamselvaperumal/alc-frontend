import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, user, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (user) {
      // Redirect based on role if generic home
      if (from === "/") {
        if (user.role === "Admin") navigate("/admin");
        else if (user.role === "Employee") navigate("/employee");
        else if (user.role === "Client") navigate("/client");
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setIsLoading(true);

    try {
      if (!email || !password) {
        setSubmitError("Please enter both email and password");
        setIsLoading(false);
        return;
      }

      await login(email, password);
      setEmail("");
      setPassword("");
    } catch (_error) {
      // Use the error message set by AuthContext.login(), or fall back to a safe extraction
      const errorMsg =
        _error?.response?.data?.message ||
        (_error?.request && !_error?.response
          ? "Cannot reach server. Make sure the backend is running."
          : "Login failed. Please check your credentials.");
      setSubmitError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition hover:shadow-3xl">
          {/* Header with gradient */}
          <div className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-12">
            <h1 className="text-4xl font-bold text-white text-center mb-2">
              Welcome Back
            </h1>
            <p className="text-blue-100 text-center text-lg">
              Sign in to your account
            </p>
          </div>

          {/* Form Container */}
          <div className="px-8 py-10">
            {/* Error Messages */}
            {(submitError || error) && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded animate-fade-in">
                <p className="text-red-700 font-medium text-lg">
                  {submitError || error}
                </p>
              </div>
            )}

            {/* Demo Credentials Info */}
            <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <p className="text-sm font-semibold text-blue-900 mb-2">
                Demo Credentials:
              </p>
              <p className="text-sm text-blue-800">
                <strong>Admin:</strong> admin@alc.com / password123
              </p>
              <p className="text-sm text-blue-800">
                <strong>Employee:</strong> john@alc.com / password123
              </p>
              <p className="text-sm text-blue-800">
                <strong>Client:</strong> client1@globaltex.com / password123
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-base font-semibold text-gray-800 mb-3"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="block w-full px-4 py-3 text-base rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition placeholder:text-gray-400"
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-base font-semibold text-gray-800 mb-3"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full px-4 py-3 text-base rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition placeholder:text-gray-400"
                />
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold text-lg py-3 px-4 rounded-lg transition transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-600 font-medium">
                  Don't have an account?
                </span>
              </div>
            </div>

            {/* Sign Up Link */}
            <a
              href="/register"
              className="block w-full text-center bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-lg py-3 px-4 rounded-lg transition transform hover:scale-105"
            >
              Create Account
            </a>
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="text-indigo-600 hover:text-indigo-800 font-semibold text-lg transition"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
