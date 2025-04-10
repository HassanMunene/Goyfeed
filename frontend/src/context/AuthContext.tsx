import { createContext, useContext, useEffect, useState } from "react";

type User = {
    id: string;
    username: string;
    email: string;
    name: string;
};

// define the shape of the object ensure it has the required properties and that
// their types are correct represent the structure of AuthContext
type AuthContextType = {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    login: (token: string, user: User) => void
    logout: () => void
}

// here we are creating a new context named AuthContext createContext takes an initial value
// of undefined.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (token && userData) {
            setIsAuthenticated(true);
            setUser(JSON.parse(userData));
        }

        setLoading(false);
    }, []);

    const login = (token: string, user: User) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setIsAuthenticated(true);
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

// lets define our own custom hook
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}