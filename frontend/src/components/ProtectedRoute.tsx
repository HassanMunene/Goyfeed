import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

// will be used to restrict access to certain parts of the Goy-Feed based on authentication status
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <><Loading /></>;
    }
    console.log("statetetetetet of isAuth", isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace />;
    }

    return <>{children}</>
}

export default ProtectedRoute;