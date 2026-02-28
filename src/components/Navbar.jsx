import { LogOut, Menu, X } from "lucide-react"; // Example icons
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar bg-white shadow-2xl sticky top-0 z-0">
      <div className="max-w-9xl mx-auto px-1 sm:px-1 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="shrink-0 flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="ALC Logo"
                className="h-20 w-20 object-contain transform group-hover:"
              />
              <span className="hidden sm:inline text-4xl font-bold text-blue-700 tracking-tight group-hover:text-blue-800 transition">
                ALC TEX
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:ml-10 md:flex md:space-x-2">
              <Link
                to="/"
                className="text-black text-lg font-semibold px-4 py-2 rounded-lg hover:bg-green-200 hover:shadow-lg transition duration-300 transform hover:scale-105"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-black text-lg font-semibold px-4 py-2 rounded-lg hover:bg-green-200 transition duration-300 transform hover:scale-105"
              >
                About
              </Link>
              <Link
                to="/departments"
                className="text-black text-lg font-semibold px-4 py-2 rounded-lg hover:bg-green-200 transition duration-300 transform hover:scale-105"
              >
                Departments
              </Link>
              <Link
                to="/contact"
                className="text-black text-lg font-semibold px-4 py-2 rounded-lg hover:bg-green-200 transition duration-300 transform hover:scale-105"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Desktop Auth Area */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-white text-lg font-bold">
                    Hello, {user.username}
                  </p>
                  <p className="text-blue-100 text-sm font-semibold border-t border-blue-300 pt-1">
                    {user.role}
                  </p>
                </div>
                <Link
                  to={`/${user.role.toLowerCase()}`}
                  className="text-lg font-bold text-white bg-white/20 hover:bg-white/30 px-5 py-2 rounded-lg transition duration-300 transform hover:scale-110 shadow-lg"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-red-200 bg-red-500/30 hover:bg-red-500/50 p-2 rounded-lg transition duration-300 transform hover:scale-110 shadow-lg"
                  title="Logout"
                >
                  <LogOut className="h-6 w-6" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-lg font-bold hover:text-blue-600 hover:bg-white bg-blue-500 text-white px-6 py-2 rounded-lg transition duration-300 transform hover:scale-110 shadow-lg"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-lg font-bold text-white bg-linear-to-r bg-blue-500 hover:bg-white
                  hover:text-blue-500 px-6 py-2 rounded-lg transition duration-300 transform hover:scale-110 shadow-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-white/20 inline-flex items-center justify-center p-2 rounded-lg text-white hover:bg-white/30 transition duration-300"
            >
              {isOpen ? (
                <X className="h-7 w-7" />
              ) : (
                <Menu className="h-7 w-7" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-linear-to-b from-blue-600 to-indigo-700 animate-slide-in-left">
          <div className="pt-4 pb-4 space-y-2 px-4">
            <Link
              to="/"
              className="block px-4 py-3 rounded-lg text-white text-lg font-bold hover:bg-white/20 transition duration-300"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block px-4 py-3 rounded-lg text-blue-100 text-lg font-bold hover:bg-white/20 hover:text-white transition duration-300"
            >
              About
            </Link>
            <Link
              to="/departments"
              className="block px-4 py-3 rounded-lg text-blue-100 text-lg font-bold hover:bg-white/20 hover:text-white transition duration-300"
            >
              Departments
            </Link>
            <Link
              to="/contact"
              className="block px-4 py-3 rounded-lg text-blue-100 text-lg font-bold hover:bg-white/20 hover:text-white transition duration-300"
            >
              Contact
            </Link>

            <hr className="my-3 border-blue-400" />

            {user ? (
              <>
                <p className="px-4 py-2 text-white font-bold text-lg">
                  {user.username} ({user.role})
                </p>
                <Link
                  to={`/${user.role.toLowerCase()}`}
                  className="block px-4 py-3 rounded-lg text-white font-bold bg-white/20 hover:bg-white/30 transition duration-300 text-lg"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-lg text-white font-bold bg-red-500/30 hover:bg-red-500/50 transition duration-300 flex items-center gap-2 text-lg"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-3 rounded-lg text-blue-600 font-bold bg-white hover:bg-blue-50 transition duration-300 text-center text-lg"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-3 rounded-lg text-white font-bold bg-linear-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 transition duration-300 text-center text-lg"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
