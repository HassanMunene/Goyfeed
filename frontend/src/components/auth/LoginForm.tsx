import { useState } from "react";
import { X as XIcon, Eye, EyeOff, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface LoginFormProps {
	onSubmit: (values: { username: string; password: string }) => void;
	isLoading?: boolean;
}

const LoginForm = ({ onSubmit, isLoading = false }: LoginFormProps) => {
	const [formValues, setFormValues] = useState({ username: "", password: "" });

	const [formErrors, setFormErrors] = useState<{ username?: string; password?: string}>({});

	const [touched, setTouched] = useState({ username: false, password: false});

	const [showPassword, setShowPassword] = useState(false);

	const validate = () => {
		const errors: { username?: string; password?: string } = {};
		if (!formValues.username.trim()) errors.username = "Username is required";
		if (!formValues.password.trim()) errors.password = "Password is required";
		return errors;
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormValues(prev => ({ ...prev, [name]: value }));
		if (touched[name as keyof typeof touched]) {
			setFormErrors(prev => ({
				...prev,
				[name]: value.trim() ? undefined : `${name} is required`
			}));
		}
	};

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		const { name } = e.target;
		setTouched(prev => ({ ...prev, [name]: true }));
		validate();
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const errors = validate();
		setFormErrors(errors);
		setTouched({ username: true, password: true });

		if (Object.keys(errors).length === 0) {
			onSubmit(formValues);
		}
	};

	return (
		<div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 w-full max-w-md">
			{/* Header Section */}
			<div className="flex items-center mb-8">
				<div className="text-center w-full">
					<motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-gray-900">
						Welcome back to <span className="bg-gradient-to-r from-[#4f46e5] to-[#e946b8] bg-clip-text text-transparent">GoyFeed</span>
					</motion.h1>
					<motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-gray-500">
						We are happy to have you back!
					</motion.p>
				</div>
			</div>

			{/* Form Section */}
			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Username Field */}
				<div>
					<div className="relative">
						<input
							id="username"
							name="username"
							type="text"
							value={formValues.username}
							onChange={handleChange}
							onBlur={handleBlur}
							className={`w-full px-4 py-3 bg-gray-50 border-2 ${touched.username && formErrors.username ? "border-red-300 focus:border-red-300" : "border-gray-300 focus:border-[#4f46e5]"} rounded-xl focus:outline-none focus:ring-0 transition-all`}
							placeholder="Email"
							autoComplete="username"
						/>
					</div>
					{touched.username && formErrors.username && (
						<motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-sm mt-1 px-1 flex items-center">
							<svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
							</svg>
							{formErrors.username}
						</motion.div>
					)}
				</div>

				{/* Password Field */}
				<div>
					<div className="relative">
						<input
							id="password"
							name="password"
							type={showPassword ? "text" : "password"}
							value={formValues.password}
							onChange={handleChange}
							onBlur={handleBlur}
							className={`w-full px-4 py-3 bg-gray-50 border-2 ${touched.password && formErrors.password ? "border-red-300 focus:border-red-300" : "border-gray-300 focus:border-[#4f46e5]"} rounded-xl focus:outline-none focus:ring-0 transition-all pr-12`}
							placeholder="Password"
							autoComplete="current-password"
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
						<motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-sm mt-1 px-1 flex items-center">
							<svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
							</svg>
							{formErrors.password}
						</motion.div>
					)}
				</div>

				{/* Submit Button */}
				<div className="pt-2">
					<button
						type="submit"
						disabled={isLoading}
						className={`w-full py-3 px-4 rounded-xl font-bold text-white transition-all ${isLoading
								? "bg-[#c7d2fe] cursor-not-allowed"
								: "bg-gradient-to-r from-[#4f46e5] to-[#e946b8] hover:from-[#4338ca] hover:to-[#d433a6] hover:shadow-lg"
							} flex items-center justify-center`}
					>
						{isLoading ? (
							<>
								<Loader2 className="animate-spin mr-2" size={18} />
								Signing in...
							</>
						) : (
							<motion.span
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								Sign In
							</motion.span>
						)}
					</button>
				</div>

				{/* Forgot Password Link */}
				<div className="text-center">
					<Link
						to="/auth/forgot-password"
						className="text-sm text-gray-500 hover:text-[#4f46e5] transition-colors"
					>
						Forgot password?
					</Link>
				</div>
			</form>

			{/* Sign Up Footer */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.3 }}
				className="mt-6 pt-6 border-t border-gray-100 text-center"
			>
				<p className="text-gray-500 text-sm">
					New to GoyFeed?{" "}
					<Link
						to="/auth/signup"
						className="text-[#4f46e5] hover:text-[#4338ca] font-medium transition-colors"
					>
						Create account
					</Link>
				</p>
			</motion.div>
		</div>
	);
};

export default LoginForm;