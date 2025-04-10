import { useState } from "react";
import { X as XIcon, Eye, EyeOff, Loader2, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// we define the shape of the props the component will accept
interface SignupFormProps {
	onSubmit: (values: {
		username: string;
		email: string;
		password: string;
		confirmPassword: string;
	}) => void;
	isLoading?: boolean;
}

const SignupForm = ({ onSubmit, isLoading = false }: SignupFormProps) => {
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

	// track which fields have been interacted with for validation timing
	const [touched, setTouched] = useState({
		username: false,
		email: false,
		password: false,
		confirmPassword: false
	});

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	//check all form fields against these validation rules
	const validate = () => {
		const errors: typeof formErrors = {};
		if (!formValues.username.trim()) errors.username = "Username is required";
		else if (formValues.username.length < 3) errors.username = "Username must be at least 3 characters";

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

	// Password strength indicator
	const getPasswordStrength = () => {
		if (!formValues.password) return 0;
		let strength = 0;
		if (formValues.password.length >= 6) strength += 1;
		if (/[A-Z]/.test(formValues.password)) strength += 1;
		if (/[0-9]/.test(formValues.password)) strength += 1;
		if (/[^A-Za-z0-9]/.test(formValues.password)) strength += 1;
		return strength;
	};

	const passwordStrength = getPasswordStrength();

	return (
		<div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 w-full max-w-md">
			{/* Header Section */}
			<div className="flex items-center mb-8">
				<div className="text-center w-full">
					<motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-gray-900 mb-2">
						Join <span className="bg-gradient-to-r from-[#4f46e5] to-[#e946b8] bg-clip-text text-transparent">GoyFeed</span>
					</motion.h1>
					<motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-gray-500">
						Create your account to get started
					</motion.p>
				</div>
			</div>

			{/* Form Section starts here */}
			<form onSubmit={handleSubmit} className="space-y-4">
				{/* Username Field */}
				<div>
					<input
						id="username"
						name="username"
						type="text"
						value={formValues.username}
						onChange={handleChange}
						onBlur={handleBlur}
						className={`w-full px-4 py-3 bg-gray-50 border-2 ${touched.username && formErrors.username
							? "border-red-300 focus:border-red-300"
							: "border-gray-200 focus:border-[#4f46e5]"
							} rounded-xl focus:outline-none focus:ring-0 transition-all`}
						placeholder="Username"
						autoComplete="username"
					/>
					{touched.username && formErrors.username && (
						<motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-sm mt-1 px-1 flex items-center">
							<svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
							</svg>
							{formErrors.username}
						</motion.div>
					)}
				</div>

				{/* Email Field */}
				<div>
					<input
						id="email"
						name="email"
						type="email"
						value={formValues.email}
						onChange={handleChange}
						onBlur={handleBlur}
						className={`w-full px-4 py-3 bg-gray-50 border-2 ${touched.email && formErrors.email
							? "border-red-300 focus:border-red-300"
							: "border-gray-200 focus:border-[#4f46e5]"
							} rounded-xl focus:outline-none focus:ring-0 transition-all`}
						placeholder="Email address"
						autoComplete="email"
					/>
					{touched.email && formErrors.email && (
						<motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-sm mt-1 px-1 flex items-center">
							<svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
							</svg>
							{formErrors.email}
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
							className={`w-full px-4 py-3 bg-gray-50 border-2 ${touched.password && formErrors.password
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

					{/* Password Strength Meter */}
					{formValues.password && (
						<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2">
							<div className="flex gap-1 mb-1">
								{[1, 2, 3, 4].map((i) => (
									<div key={i} className={`h-1 flex-1 rounded-full ${passwordStrength >= i ? i <= 2 ? 'bg-red-400' : i === 3 ? 'bg-yellow-400' : 'bg-green-500' : 'bg-gray-200'}`} />
								))}
							</div>
							<div className="text-xs text-gray-500">
								{passwordStrength === 0 && "Very weak"}
								{passwordStrength === 1 && "Weak"}
								{passwordStrength === 2 && "Moderate"}
								{passwordStrength === 3 && "Strong"}
								{passwordStrength === 4 && "Very strong"}
							</div>
						</motion.div>
					)}

					{touched.password && formErrors.password && (
						<motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-sm mt-1 px-1 flex items-center">
							<svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
							</svg>
							{formErrors.password}
						</motion.div>
					)}
				</div>

				{/* Confirm Password Field */}
				<div>
					<div className="relative">
						<input
							id="confirmPassword"
							name="confirmPassword"
							type={showConfirmPassword ? "text" : "password"}
							value={formValues.confirmPassword}
							onChange={handleChange}
							onBlur={handleBlur}
							className={`w-full px-4 py-3 bg-gray-50 border-2 ${touched.confirmPassword && formErrors.confirmPassword
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
						<motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-sm mt-1 px-1 flex items-center">
							<svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
							</svg>
							{formErrors.confirmPassword}
						</motion.div>
					)}
				</div>

				{/* Terms and services Checkbox */}
				<div className="flex items-start pt-2">
					<div className="flex items-center h-5">
						<input id="terms" name="terms" type="checkbox" defaultChecked={true} required className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" />
					</div>
					<label htmlFor="terms" className="ml-2 text-sm text-gray-500">
						I agree to the <span className="text-[#4f46e5] hover:underline">Terms of Service</span> and <span className="text-[#4f46e5] hover:underline">Privacy Policy</span>
					</label>
				</div>

				{/* Submit Button */}
				<div className="pt-2">
					<button type="submit" disabled={isLoading} className={`w-full py-3 px-4 rounded-xl font-bold text-white transition-all ${isLoading ? "bg-[#c7d2fe] cursor-not-allowed" : "bg-gradient-to-r from-[#4f46e5] to-[#e946b8] hover:from-[#4338ca] hover:to-[#d433a6] hover:shadow-lg"} flex items-center justify-center`}>
						{isLoading ? (
							<>
								<Loader2 className="animate-spin mr-2" size={18} />
								Creating account...
							</>
						) : (
							<motion.span
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								Sign Up
							</motion.span>
						)}
					</button>
				</div>
			</form>

			{/* Login Footer */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.3 }}
				className="mt-4 pt-4 border-t border-gray-200 text-center"
			>
				<p className="text-gray-500 text-sm">
					Already have an account?{" "}
					<Link
						to="/auth/login"
						className="text-[#4f46e5] hover:text-[#4338ca] font-medium transition-colors"
					>
						Log in
					</Link>
				</p>
			</motion.div>
		</div>
	);
};

export default SignupForm;