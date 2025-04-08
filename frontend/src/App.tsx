import { lazy, Suspense } from 'react';

import { BrowserRouter, Route, Routes } from 'react-router-dom'

import MainLayout from './components/Layout/MainLayout';
import Topbar from './components/topbar/Topbar';
import './App.css';

// We will lazy load the pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));

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
				<Topbar />
				<Routes>
					{/* our public login route */}
					<Route path="/login" element={<LoginPage />} />

					{/* our protected routes wrapped within a layout */}
					<Route path="/" element={<MainLayout />}>
						<Route index element={<HomePage />} />
						<Route path="/profile/:username" element={<ProfilePage />} />
					</Route>
				</Routes>
			</Suspense>
		</BrowserRouter >
	)
}

export default App
