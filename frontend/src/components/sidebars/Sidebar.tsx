import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, Search, Bell, Bookmark, User, MoreHorizontal, Feather, Power, Heart } from "lucide-react";

const Sidebar = () => {
	const popupRef = useRef<HTMLDivElement>(null);
	const [showLogoutPopup, setShowLogoutPopup] = useState(false);

	//close the logout popup when we click outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
				setShowLogoutPopup(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const handleLogoutClick = () => {
		console.log('Logging out...');
		setShowLogoutPopup(false);
	}

	return (
		<div className="flex flex-col sticky h-screen top-0 border-r border-[#f0f2f5] overflow-hidden">
			{/* Brand Logo */}
			<div className="p-5 mb-2">
				<h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#4f46e5] to-[#e946b8]">
					Goy-Feed
				</h1>
			</div>

			{/* Navigation */}
			<div className="flex-1 flex flex-col">
				<nav className="space-y-1 px-3 overflow-hidden">
					<NavItem to="/" icon={<Home size={22} />} text="Home" />
					<NavItem to="/explore" icon={<Search size={22} />} text="Explore" />
					<NavItem to="/notifications" icon={<Bell size={22} />} text="Notifications" />
					<NavItem to="/liked_posts" icon={<Heart size={22} />} text="Liked Posts" />
					<NavItem to="/profile" icon={<User size={22} />} text="Profile" />
				</nav>
				{/* Post Button */}
				<button className="mx-3 my-4 bg-gradient-to-r from-[#4f46e5] to-[#e946b8] hover:from-[#4338ca] hover:to-[#d433a6] text-white rounded-full py-3 px-6 font-bold flex items-center justify-center transition-all hover:shadow-lg active:scale-95">
					<Feather className="mr-2" size={18} />
					Post
				</button>
			</div>

			{/* Profile Section */}
			<div className="mt-auto p-4 border-t border-[#f0f2f5] relative">
				<button
					onClick={() => setShowLogoutPopup(!showLogoutPopup)}
					className="flex items-center justify-between w-full p-3 rounded-full hover:bg-[#f8f9fa] transition-colors group"
				>
					<div className="flex items-center">
						<div className="w-10 h-10 bg-gradient-to-br from-[#4f46e5] to-[#e946b8] rounded-full mr-3 flex items-center justify-center text-white font-bold">
							U
						</div>
						<div>
							<div className="font-semibold group-hover:text-[#4f46e5]">Username</div>
							<div className="text-[#65676b] text-sm">@username</div>
						</div>
					</div>
					<MoreHorizontal className="text-[#65676b] group-hover:text-[#4f46e5]" size={20} />
				</button>
			</div>
			{/* Logout Popup */}
			{showLogoutPopup && (
				<div ref={popupRef} className="absolute bottom-21 left-4 bg-white shadow-lg rounded-xl p-2 w-[calc(100%-32px)] border border-gray-100 z-50">
					<button onClick={handleLogoutClick} className="flex items-center w-full p-3 rounded-lg hover:bg-[#f0f7ff] text-red-500">
						<Power className="mr-3" size={18} />
						<span className="text-[#4b5563]">Log out</span>
					</button>
				</div>
			)}
		</div>
	);
};

// Navigation component to handle the active state and stlying.
const NavItem = ({ to, icon, text }: { to: string; icon: React.ReactNode; text: string }) => (
	<NavLink
		to={to}
		className={({ isActive }) =>
			`flex items-center p-3 rounded-xl transition-all ${isActive
				? "font-semibold text-[#4f46e5] bg-[#f0f7ff] shadow-[inset_3px_0_0_0_#4f46e5]"
				: "text-[#4b5563] hover:text-[#4f46e5] hover:bg-[#f8f9fa]"
			}`
		}
	>
		{({ isActive }) => (
			<>
				<span className={`mr-4 ${isActive ? "text-[#4f46e5]" : "text-[#6b7280]"}`}>
					{icon}
				</span>
				<span className="text-[15px]">{text}</span>
				{isActive && (
					<div className="ml-auto w-2 h-2 rounded-full bg-[#4f46e5] animate-pulse"></div>
				)}
			</>
		)}
	</NavLink>
);

export default Sidebar;