import { useState } from "react";
import { X as XIcon, Eye, EyeOff, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface SignupFormProps {
  onSubmit: (values: { 
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => void;
  onClose?: () => void;
  isLoading?: boolean;
}

const SignupForm = ({ onSubmit, onClose, isLoading = false }: SignupFormProps) => {
  const [formValues, setFormValues] = useState({ 
    username: "", 
    email: "",
    password: "", 
    confirmPassword: "" 
  });
  const [formErrors, setFormErrors] = useState<{ 
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [touched, setTouched] = useState({ 
    username: false,
    email: false,
    password: false,
    confirmPassword: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = () => {
    const errors: typeof formErrors = {};
    if (!formValues.username.trim()) errors.username = "Username is required";
    if (!formValues.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) errors.email = "Invalid email format";
    if (!formValues.password.trim()) errors.password = "Password is required";
    else if (formValues.password.length < 6) errors.password = "Password must be at least 6 characters";
    if (!formValues.confirmPassword.trim()) errors.confirmPassword = "Please confirm your password";
    else if (formValues.password !== formValues.confirmPassword) errors.confirmPassword = "Passwords don't match";
    return errors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
    if (touched[name as keyof typeof touched]) {
      const errors = validate();
      setFormErrors(prev => ({ ...prev, [name]: errors[name as keyof typeof errors] }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const errors = validate();
    setFormErrors(prev => ({ ...prev, [name]: errors[name as keyof typeof errors] }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);
    setTouched({
      username: true,
      email: true,
      password: true,
      confirmPassword: true
    });

    if (Object.keys(errors).length === 0) {
      onSubmit(formValues);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <div className="w-8" />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#4f46e5] to-[#e946b8] bg-clip-text text-transparent">
          Join us today
        </h1>
        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <XIcon size={20} className="text-gray-500" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            id="username"
            name="username"
            type="text"
            value={formValues.username}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-3 bg-gray-50 border-2 ${
              touched.username && formErrors.username
                ? "border-red-300 focus:border-red-300"
                : "border-gray-200 focus:border-[#4f46e5]"
            } rounded-xl focus:outline-none focus:ring-0 transition-all`}
            placeholder="Username"
            autoComplete="username"
          />
          {touched.username && formErrors.username && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-1 px-1"
            >
              {formErrors.username}
            </motion.div>
          )}
        </div>

        <div>
          <input
            id="email"
            name="email"
            type="email"
            value={formValues.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-3 bg-gray-50 border-2 ${
              touched.email && formErrors.email
                ? "border-red-300 focus:border-red-300"
                : "border-gray-200 focus:border-[#4f46e5]"
            } rounded-xl focus:outline-none focus:ring-0 transition-all`}
            placeholder="Email address"
            autoComplete="email"
          />
          {touched.email && formErrors.email && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-1 px-1"
            >
              {formErrors.email}
            </motion.div>
          )}
        </div>

        <div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formValues.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 bg-gray-50 border-2 ${
                touched.password && formErrors.password
                  ? "border-red-300 focus:border-red-300"
                  : "border-gray-200 focus:border-[#4f46e5]"
              } rounded-xl focus:outline-none focus:ring-0 transition-all pr-12`}
              placeholder="Password"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {touched.password && formErrors.password && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-1 px-1"
            >
              {formErrors.password}
            </motion.div>
          )}
        </div>

        <div>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formValues.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 bg-gray-50 border-2 ${
                touched.confirmPassword && formErrors.confirmPassword
                  ? "border-red-300 focus:border-red-300"
                  : "border-gray-200 focus:border-[#4f46e5]"
              } rounded-xl focus:outline-none focus:ring-0 transition-all pr-12`}
              placeholder="Confirm password"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {touched.confirmPassword && formErrors.confirmPassword && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-1 px-1"
            >
              {formErrors.confirmPassword}
            </motion.div>
          )}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-xl font-bold text-white transition-all ${
              isLoading
                ? "bg-[#c7d2fe] cursor-not-allowed"
                : "bg-gradient-to-r from-[#4f46e5] to-[#e946b8] hover:from-[#4338ca] hover:to-[#d433a6] hover:shadow-lg"
            } flex items-center justify-center`}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={18} />
                Creating account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-100 text-center text-gray-500 text-sm">
        By signing up, you agree to our{" "}
        <Link 
          to="/terms" 
          className="text-[#4f46e5] hover:text-[#4338ca] font-medium transition-colors"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link 
          to="/privacy" 
          className="text-[#4f46e5] hover:text-[#4338ca] font-medium transition-colors"
        >
          Privacy Policy
        </Link>
      </div>
    </div>
  );
};

export default SignupForm;