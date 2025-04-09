import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import LoginForm from "../components/auth/LoginForm";


const LoginPage = () => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = (values: { username: string; password: string }) => {
    // In a real app, this would make an API call to authenticate
    if (values.username && values.password) {
      // Simulate successful login and redirect to home
      setTimeout(() => {
        navigate("/");
      }, 500);
    } else {
      setLoginError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-md p-6">
        {loginError && (
          <div className="bg-red-50 border-red-200 text-red-600 p-3 rounded-md mb-4">
            {loginError}
          </div>
        )}
        <LoginForm onSubmit={handleLogin} />

        <div className="mt-8 text-center text-sm text-x-gray">
          <p>
            Don't want to register? Use any username and password for demo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;