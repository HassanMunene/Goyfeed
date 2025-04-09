import { useState } from "react";
import { X as XIcon, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

interface LoginFormProps {
  onSubmit: (values: { username: string; password: string }) => void;
  onClose?: () => void;
}

const LoginForm = ({ onSubmit, onClose }: LoginFormProps) => {
  const [formValues, setFormValues] = useState({ username: "", password: "" });
  const [formErrors, setFormErrors] = useState<{ username?: string; password?: string }>({});
  const [touched, setTouched] = useState<{ username: boolean; password: boolean }>({
    username: false,
    password: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errors: { username?: string; password?: string } = {};
    if (!formValues.username.trim()) errors.username = "Required";
    if (!formValues.password.trim()) errors.password = "Required";
    return errors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);
    setTouched({ username: true, password: true });

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      try {
        await onSubmit(formValues);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-2xl w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="w-8" />
        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center"
            aria-label="Close"
          >
            <XIcon size={18} />
          </button>
        )}
      </div>

      <h1 className="text-3xl font-bold mb-6">Sign in to Goy-Feed</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="relative">
            <input
              id="username"
              name="username"
              type="text"
              value={formValues.username}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 bg-transparent border ${
                touched.username && formErrors.username
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-1 focus:ring-x-blue`}
              placeholder="Phone, email, or username"
            />
          </div>
          {touched.username && formErrors.username && (
            <div className="text-red-500 text-sm mt-1">{formErrors.username}</div>
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
              className={`w-full px-4 py-3 bg-transparent border ${
                touched.password && formErrors.password
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-1 focus:ring-x-blue pr-10`}
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {touched.password && formErrors.password && (
            <div className="text-red-500 text-sm mt-1">{formErrors.password}</div>
          )}
        </div>

        <button type="submit" className="mt-4" disabled={isSubmitting}>
          Sign In
        </button>
      </form>

      <div className="mt-4">
        <button>
          Forgot password?
        </button>
      </div>

      <div className="mt-8 text-center text-gray-600">
        Don't have an account?{" "}
        <Link to="/auth/signup" className="text-x-blue hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;