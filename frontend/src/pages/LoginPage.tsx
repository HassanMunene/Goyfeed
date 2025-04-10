import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { useAuth } from "../context/AuthContext";
import LoginForm from "../components/auth/LoginForm";

const LoginPage = () => {
	const navigate = useNavigate();
	const { login } = useAuth();
	const [loginError, setLoginError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const graphqlEndpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT || "http://localhost:4000/graphql";


	const handleLogin = async (values: { username: string; password: string }) => {
		setIsLoading(true);
		setLoginError(null);

		try {
			const response = await fetch(graphqlEndpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					query: `mutation Login($email: String!, $password: String!) {
						login(email: $email, password: $password) {
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
						email: values.username,
						password: values.password,
					},
				}),
			});
			const { data, errors } = await response.json();
			if (errors || !data?.login) {
				console.log("error logging in", errors);
				setLoginError("Invalid username or password.");
				return;
			}

			const { token, user } = data.login;

			login(token, user);
			setSuccessMessage("Login successful! Redirecting...");
			await new Promise((resolve) => setTimeout(resolve, 1500));
			navigate("/");
		} catch (error) {
			console.log("Error in the Login logic", error);
			setLoginError("Connection error. Please try again.");
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
				{loginError && (
					<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 shadow-sm flex items-start">
						<div className="flex-1">
							<p className="font-medium">{loginError}</p>
						</div>
						<button onClick={() => setLoginError(null)} className="text-red-400 hover:text-red-600 ml-2">
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
				<LoginForm onSubmit={handleLogin} isLoading={isLoading} />
			</motion.div>
		</div>
	);
};

export default LoginPage;