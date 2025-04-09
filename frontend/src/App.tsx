import { lazy, Suspense } from 'react';

import { BrowserRouter, Route, Routes } from 'react-router-dom'

import MainLayout from './components/Layout/MainLayout';
import './App.css';

// We will lazy load the pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const ExplorePage = lazy(() => import('./pages/ExplorePage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const LikedPostsPage = lazy(() => import('./pages/LikedPosts'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));

// we will implement a simple loading logic

const Loading = () => {
	return (
		<div className="text-center p-8">Loading...</div>
	)
}

function App() {
	return (
		<BrowserRouter>
			{/* show a our loading component while pages load */}
			<Suspense fallback={<Loading />}>
				<Routes>
					{/* our public login route */}
					<Route path="/auth/login" element={<LoginPage />} />
					<Route path="/auth/signup" element={<SignupPage />} />

					{/* our protected routes wrapped within a layout */}
					<Route path="/" element={<MainLayout />}>
						<Route index element={<HomePage />} />
						<Route path="/explore" element={<ExplorePage />} />
						<Route path="/notifications" element={<NotificationsPage />} />
						<Route path="liked_posts" element={<LikedPostsPage />} />
						<Route path="/profile" element={<ProfilePage />} />
					</Route>
				</Routes>
			</Suspense>
		</BrowserRouter >
	)
}

export default App
