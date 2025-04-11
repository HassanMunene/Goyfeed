import { Bell, Construction, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

const NotificationsPage = () => {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
			{/* Card container - responsive width */}
			<div className="max-w-md w-full mx-4 bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">

				{/* Header - responsive padding */}
				<div className="p-4 sm:p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
					<div className="flex items-center justify-center mb-3 sm:mb-4">
						<Construction className="h-10 w-10 sm:h-12 sm:w-12" />
						<Bell className="h-10 w-10 sm:h-12 sm:w-12 ml-3 sm:ml-4" />
					</div>
					<h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">
						Notifications Coming Soon!
					</h1>
				</div>

				{/* Content - responsive spacing */}
				<div className="p-5 sm:p-8 text-center">
					<div className="relative mb-6 sm:mb-8">
						<Rocket className="h-24 w-24 sm:h-32 sm:w-32 mx-auto text-purple-500 animate-bounce" />
					</div>

					<h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
						Stay Tuned
					</h2>
					<p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
						We're building an amazing notifications experience!
					</p>

					{/* Buttons - responsive sizing */}
					<div className="space-y-3 sm:space-y-4">
						<Link
							to="/"
							className="block px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity text-sm sm:text-base"
						>
							Return Home
						</Link>
					</div>
				</div>

				{/* Footer - responsive text */}
				<div className="p-3 sm:p-4 text-center text-xs sm:text-sm text-gray-500">
					<p>Expected release: Coming Soon</p>
				</div>
			</div>
		</div>
	);
};

export default NotificationsPage;