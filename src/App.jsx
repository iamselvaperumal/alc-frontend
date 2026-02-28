import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";
import Departments from "./pages/public/Departments";
import Home from "./pages/public/Home";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";

// Dashboards
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import ClientDashboard from "./pages/dashboard/ClientDashboard";
import EmployeeDashboard from "./pages/dashboard/EmployeeDashboard";

// Protected Route Component
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/departments" element={<Departments />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />

              {/* Protected Routes */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute role="Admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employee/*"
                element={
                  <ProtectedRoute role="Employee">
                    <EmployeeDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/client/*"
                element={
                  <ProtectedRoute role="Client">
                    <ClientDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
