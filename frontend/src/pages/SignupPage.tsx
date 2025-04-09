import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import SignupForm from "../components/auth/SignupForm";

const SignupPage = () => {
  const navigate = useNavigate();
  const [signupError, setSignupError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSignup = async (values: { 
    username: string; 
    email: string;
    password: string; 
    confirmPassword: string;
  }) => {
    setIsLoading(true);
    setSignupError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (values.password !== values.confirmPassword) {
        setSignupError("Passwords don't match");
        return;
      }

      // Simulate successful signup
      setSuccessMessage("Account created successfully! Redirecting...");
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigate("/auth/login");
      
    } catch (error) {
      setSignupError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e5e7eb] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        {signupError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 shadow-sm flex items-start"
          >
            <div className="flex-1">
              <p className="font-medium">{signupError}</p>
            </div>
            <button 
              onClick={() => setSignupError(null)}
              className="text-red-400 hover:text-red-600 ml-2"
            >
              ✕
            </button>
          </motion.div>
        )}

        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 text-green-600 p-4 rounded-xl mb-6 shadow-sm flex items-start"
          >
            <div className="flex-1">
              <p className="font-medium">{successMessage}</p>
            </div>
          </motion.div>
        )}
        
        <SignupForm onSubmit={handleSignup} isLoading={isLoading} />

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Already have an account?
          </p>
          <div className="mt-2">
            <Link 
              to="/auth/login" 
              className="text-blue-500 hover:text-blue-600 font-medium inline-flex items-center"
            >
              Sign in now
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;