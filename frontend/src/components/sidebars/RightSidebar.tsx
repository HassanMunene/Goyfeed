import { useEffect, useState } from "react";
import { Search, UserPlus, Check } from "lucide-react";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

interface User {
	id: string;
	name: string;
	username: string;
	isFollowed?: boolean;
}

const RightSidebar = () => {
	const { user: loggeInUser } = useAuth();
	const [searchInput, setSearchInput] = useState("");
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [isFollowing, setIsFollowing] = useState(false);

	const graphqlEndpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT || "http://localhost:4000/graphql";

	const fetchUsers = async () => {
		try {
			const res = await fetch(graphqlEndpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`
				},
				body: JSON.stringify({
					query: `query GetSuggestedUsers {
						getSuggestedUsers {
                			id
                			name
                			username
                			isFollowed
              			}
            		}`
				})
			});

			const json = await res.json();
			setUsers(json.data.getSuggestedUsers);
		} catch (err) {
			console.error("Error fetching users:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleFollow = async (userId: string, isCurrentlyFollowed: boolean) => {
		try {
			setIsFollowing(true);
			const mutation = isCurrentlyFollowed ?
				`mutation { unfollowUser(userId: "${userId}") { success } }` :
				`mutation { followUser(userId: "${userId}") { success } }`;

			const res = await fetch(graphqlEndpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`
				},
				body: JSON.stringify({ query: mutation })
			});

			const json = await res.json();

			if (json.data?.followUser?.success || json.data?.unfollowUser?.success) {
				setUsers(prevUsers =>
					prevUsers.map(user =>
						user.id === userId
							? { ...user, isFollowed: !isCurrentlyFollowed }
							: user
					)
				);
			}
		} catch (err) {
			console.error("Error toggling follow:", err);
		} finally {
			setIsFollowing(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	// Exclude the logged-in user from the list of suggested users
	const filteredUsers = users
		.filter(user => user.id !== loggeInUser?.id)
		.filter(user =>
			user.name.toLowerCase().includes(searchInput.toLowerCase()) ||
			user.username.toLowerCase().includes(searchInput.toLowerCase())
		);


	return (
		<div className="w-[350px] p-4 space-y-6 sticky top-0 h-screen overflow-y-auto no-scrollbar">
			{/* Search Bar */}
			<div className="relative">
				<div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
					<Search className="h-4 w-4 text-gray-400" />
				</div>
				<input
					type="text"
					placeholder="Search people..."
					className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
					value={searchInput}
					onChange={(e) => setSearchInput(e.target.value)}
				/>
			</div>

			{/* Who to Follow */}
			<div className="bg-gray-50 rounded-xl p-4">
				<h2 className="flex items-center text-lg font-semibold mb-3">
					<UserPlus className="mr-2 h-5 w-5" />
					Who to Follow
				</h2>
				{loading ? (
					<p>Loading users...</p>
				) : filteredUsers.length > 0 ? (
					<div className="space-y-4">
						{filteredUsers.map((user) => (
							<div key={user.id} className="flex items-center justify-between">
								<div className="flex items-center">
									<Link to={`/profile/${user.username}`} className="mr-3">
										<div className="w-10 h-10 bg-gradient-to-br from-[#4f46e5] to-[#e946b8] rounded-full mr-3 flex items-center justify-center text-white font-bold">
											{user?.name?.charAt(0).toUpperCase() || "U"}
										</div>
									</Link>
									<div>
										<p className="font-medium">{user.name}</p>
										<p className="text-xs text-gray-500">@{user.username}</p>
									</div>
								</div>
								<button
									onClick={() => handleFollow(user.id, user.isFollowed || false)}
									disabled={isFollowing}
									className={`text-sm cursor-pointer px-3 py-1 rounded-full flex items-center gap-1 ${user.isFollowed
											? "bg-gray-200 text-gray-800 hover:bg-gray-300"
											: "bg-black text-white hover:opacity-90"
										}`}
								>
									{user.isFollowed ? (
										<>
											<Check className="w-4 h-4" />
											Following
										</>
									) : (
										"Follow"
									)}
								</button>
							</div>
						))}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center py-8 text-center">
						<div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center mb-4">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-12 w-12 text-gray-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.5}
									d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
								/>
							</svg>
						</div>
						<h3 className="text-lg font-medium text-gray-800 mb-1">
							No one left to follow
						</h3>
						<p className="text-gray-500 max-w-xs">
							Invite friends to join! or check back later.
						</p>
						<button
							onClick={() => fetchUsers()}
							className="cursor-pointer mt-4 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
						>
							Refresh Suggestions
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default RightSidebar;