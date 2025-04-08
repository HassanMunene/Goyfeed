import { NavLink } from "react-router-dom";
import { Home, Search, Bell, Bookmark, User, MoreHorizontal, Feather } from "lucide-react";

const Sidebar = () => {
	return (
		<div className="flex flex-col sticky h-screen top-0 overflow-y-auto">
			<div className="flex flex-col h-full p-4">
				<nav className="space-y-2 flex-1">
					<NavItem to="/" icon={<Home size={22} />} text="Home" />
					<NavItem to="/explore" icon={<Search size={22} />} text="Explore" />
					<NavItem to="/notifications" icon={<Bell size={22} />} text="Notifications" />
					<NavItem to="/bookmarks" icon={<Bookmark size={22} />} text="Bookmarks" />
					<NavItem to="/profile" icon={<User size={22} />} text="Profile" />
				</nav>

				{/* Post Button */}
				<button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full py-3 px-4 font-bold flex items-center justify-center mt-4 transition-colors">
					<Feather className="mr-2" size={18} />
					Post
				</button>

				{/* Profile Section */}
				<div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
						<div className="flex items-center">
							<div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mr-3"></div>
							<div>
								<div className="font-bold">Username</div>
								<div className="text-gray-500 text-sm">@username</div>
							</div>
						</div>
						<MoreHorizontal className="text-gray-500" size={20} />
					</div>
				</div>
			</div>
		</div>
	);
};

// Reusable NavItem component
const NavItem = ({ to, icon, text }: { to: string; icon: React.ReactNode; text: string }) => (
	<NavLink
		to={to}
		className={({ isActive }) =>
			`flex items-center p-3 rounded-full transition-colors ${isActive
				? "font-bold bg-blue-50 text-blue-500 dark:bg-gray-800 dark:text-blue-400"
				: "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
			}`
		}
	>
		<span className="mr-4">{icon}</span>
		<span className="text-lg">{text}</span>
	</NavLink>
);

export default Sidebar;