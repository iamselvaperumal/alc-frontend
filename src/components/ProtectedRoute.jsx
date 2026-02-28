import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="p-4 text-center">Loading...</div>; 
    }

    if (!user) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (role && user.role.toLowerCase() !== role.toLowerCase()) {
        // Role based authorization
        return <div className="p-4 text-center text-red-600">Unauthorized Access</div>;
    }

    return children;
};

export default ProtectedRoute;
