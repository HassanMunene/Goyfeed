import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Home, Search, Bell, User, MoreHorizontal, Feather, Power, Heart } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import PostModal from "../posts/PostModal";

const Sidebar = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	// State to manage the post modal visibility
	const [isPostModalOpen, setIsPostModalOpen] = useState(false);

	const handlePostClick = () => {
		setIsPostModalOpen(true);
	};

	const handleClosePostModal = () => {
		setIsPostModalOpen(false);
	};

	const handleLogoutClick = async () => {
		const result = await Swal.fire({
			title: "Are you sure?",
			text: "You will be logged out of your account.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Yes, log out",
			cancelButtonText: "Cancel",
		});

		if (result.isConfirmed) {
			logout();
			navigate("/auth/login");
			Swal.fire("Logged out!", "You have been successfully logged out.", "success");
		}
	};

	return (
		<div className="flex flex-col sticky h-screen top-0 border-r border-[#f0f2f5] overflow-hidden">
			{/* Brand Logo */}
			<div className="p-5 mb-2">
				<h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#4f46e5] to-[#e946b8]">
					GoyFeed
				</h1>
			</div>

			{/* Navigation */}
			<div className="flex-1 flex flex-col">
				<nav className="space-y-1 px-3 overflow-hidden">
					<NavItem to="/" icon={<Home size={22} />} text="Home" />
					<NavItem to="/explore" icon={<Search size={22} />} text="Explore" />
					<NavItem to="/notifications" icon={<Bell size={22} />} text="Notifications" />
					<NavItem to="/liked_posts" icon={<Heart size={22} />} text="Liked Posts" />
					<NavItem to={`/profile/${user?.username}`} icon={<User size={22} />} text="Profile" />
				</nav>
				{/* Post Button */}
				<button onClick={handlePostClick} className="mx-3 my-4 bg-gradient-to-r from-[#4f46e5] to-[#e946b8] hover:from-[#4338ca] hover:to-[#d433a6] text-white rounded-full py-3 px-6 font-bold flex items-center justify-center transition-all hover:shadow-lg active:scale-95">
					<Feather className="mr-2" size={18} />
					Post
				</button>
			</div>

			{/* Profile Section */}
			<div className="mt-auto p-4 border-t border-[#f0f2f5] relative">
				<button
					onClick={() => console.log("clicked")}
					className="flex items-center justify-between w-full p-3 rounded-full hover:bg-[#f8f9fa] transition-colors group"
				>
					<div className="flex items-center">
						<div className="w-10 h-10 bg-gradient-to-br from-[#4f46e5] to-[#e946b8] rounded-full mr-3 flex items-center justify-center text-white font-bold">
							{user?.name?.charAt(0).toUpperCase() || "U"}
						</div>
						<div>
							<div className="font-semibold group-hover:text-[#4f46e5]">{user?.name || "username"}</div>
							<div className="text-[#65676b] text-sm">@{user?.username || "@username"}</div>
						</div>
					</div>
					<MoreHorizontal className="text-[#65676b] group-hover:text-[#4f46e5]" size={20} />
				</button>

				{/* Logout button section */}
				<button
					onClick={handleLogoutClick}
					className="mx-3 mt-3 bg-red-50 mb-4 flex items-center p-3 rounded-xl text-red-600 hover:text-red-700bg-red-50 hover:bg-red-100 border border-red-100 hover:border-red-200 transition-all duration-200 ease-in-out group shadow-sm hover:shadow-red-100"
				>
					<Power
						size={20}
						className="mr-3 text-red-500 group-hover:text-red-600 transition-transform group-hover:scale-105"
					/>
					<span className="text-[15px] font-semibold">Log out</span>
				</button>

				{/* Post Modal */}
				<PostModal isOpen={isPostModalOpen} onRequestClose={handleClosePostModal} />
			</div>
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