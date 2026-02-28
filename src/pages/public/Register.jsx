import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Client"); // Default role
  const [submitError, setSubmitError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register, user, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (user) {
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
      if (!username || !email || !password) {
        setSubmitError("Please fill in all fields");
        setIsLoading(false);
        return;
      }

      if (password.length < 6) {
        setSubmitError("Password must be at least 6 characters");
        setIsLoading(false);
        return;
      }

      await register(username, email, password, role);
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (_error) {
      const errorMsg =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      setSubmitError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-red-50 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition hover:shadow-3xl">
          {/* Header with gradient */}
          <div className="bg-linear-to-r from-purple-600 via-pink-600 to-red-600 px-8 py-12">
            <h1 className="text-4xl font-bold text-white text-center mb-2">
              Create Account
            </h1>
            <p className="text-purple-100 text-center text-lg">
              Join our community
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

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Username Field */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-base font-semibold text-gray-800 mb-3"
                >
                  Full Name
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="John Doe"
                  className="block w-full px-4 py-3 text-base rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition placeholder:text-gray-400"
                />
              </div>

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
                  className="block w-full px-4 py-3 text-base rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition placeholder:text-gray-400"
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
                  className="block w-full px-4 py-3 text-base rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition placeholder:text-gray-400"
                />
                <p className="text-sm text-gray-600 mt-2">
                  At least 6 characters
                </p>
              </div>

              {/* Role Selection */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-base font-semibold text-gray-800 mb-3"
                >
                  Account Type
                </label>
                <select
                  id="role"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="block w-full px-4 py-3 text-base rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition"
                >
                  <option value="Client">Client</option>
                  <option value="Employee">Employee</option>
                </select>
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold text-lg py-3 px-4 rounded-lg transition transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-600 font-medium">
                  Already have an account?
                </span>
              </div>
            </div>

            {/* Sign In Link */}
            <Link
              to="/login"
              className="block w-full text-center bg-linear-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold text-lg py-3 px-4 rounded-lg transition transform hover:scale-105"
            >
              Sign In Instead
            </Link>
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center mt-8">
          <Link
            to="/"
            className="text-purple-600 hover:text-purple-800 font-semibold text-lg transition"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
