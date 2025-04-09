import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

// will be used to restrict access to certain parts of the Goy-Feed based on authentication status
const ProtectedRoute = ({ children}: { children: React.ReactNode}) => {
    const { isAuthenticated } = useAuth();

    if(!isAuthenticated) {
        return <Navigate to="/auth/login" replace />;
    }

    return <>{children}</>
}

export default ProtectedRoute;