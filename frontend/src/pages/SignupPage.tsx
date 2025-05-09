import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

import SignupForm from "../components/auth/SignupForm";

const SignupPage = () => {
	const navigate = useNavigate();
	const [signupError, setSignupError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const graphqlEndpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT || "http://localhost:4000/graphql";

	const { login } = useAuth();

	const handleSignup = async (values: {
		username: string;
		email: string;
		password: string;
		confirmPassword: string;
	}) => {
		setIsLoading(true);
		setSignupError(null);

		try {
			const response = await fetch(graphqlEndpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					query: `
						mutation Signup($username: String!, $email: String!, $password: String!, $name: String) {
							signup(username: $username, email: $email, password: $password, name: $name) {
								token
								user {
									id
									username
									email
									name
								}
							}
						}
					`,
					variables: {
						username: values.username,
						email: values.email,
						password: values.password,
						name: values.username || "",
					},
				}),
			});

			let json;
			try {
				json = await response.json();
			} catch (e) {
				console.error("Error parsing JSON:", e);
				setSignupError("Unexpected server response. Please try again.");
				return;
			}

			const { data, errors } = json;

			if (!response.ok || (errors && errors.length > 0)) {
				console.error("GraphQL/API error", errors || json);
				setSignupError(errors?.[0]?.message || "Signup failed. Please try again.");
				return;
			}

			const { token, user } = data.signup;
			login(token, user);

			setSuccessMessage("Signup successful! Redirecting...");
			await new Promise((resolve) => setTimeout(resolve, 1500));
			navigate("/");
		} catch (error) {
			console.error("Signup request failed:", error);
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
			</motion.div>
		</div>
	);
};

export default SignupPage;