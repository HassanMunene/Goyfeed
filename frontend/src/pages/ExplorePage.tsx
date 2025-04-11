import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus, Search, Heart } from "lucide-react";

import { useAuth } from "../context/AuthContext";

interface User {
	id: string;
	name: string;
	username: string;
}

interface Post {
	id: string;
	content: string;
	likes: { id: string }[];
	author: User;
	createdAt: string;
}

const ExplorePage = () => {
	const { user: loggedInUser } = useAuth();
	const [searchInput, setSearchInput] = useState("");
	const [users, setUsers] = useState<User[]>([]);
	const [popularPosts, setPopularPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState({
		users: true,
		posts: true
	});

	const graphqlEndpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT || "http://localhost:4000/graphql";

	const fetchUsers = async () => {
		try {
			const res = await fetch(graphqlEndpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					query: `query {
						getAllUsers {
                			id
                			name
                			username
              			}
            		}`
				})
			});
			const json = await res.json();
			setUsers(json.data.getAllUsers);
		} catch (err) {
			console.error("Error fetching users:", err);
		} finally {
			setLoading(prev => ({ ...prev, users: false }));
		}
	};

	const fetchPopularPosts = async () => {
		try {
			const res = await fetch(graphqlEndpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					query: `query {
						getPopularPosts {
                			id
                			content
                			likes {
                  				id
                			}
                			author {
                  				id
                  				name
                  				username
                			}
                			createdAt
              			}}`
				})
			});
			const json = await res.json();
			setPopularPosts(json.data.getPopularPosts);
		} catch (err) {
			console.error("Error fetching popular posts:", err);
		} finally {
			setLoading(prev => ({ ...prev, posts: false }));
		}
	};

	useEffect(() => {
		fetchUsers();
		fetchPopularPosts();
	}, []);

	// Exclude the logged-in user from the list of suggested users
	const filteredUsers = users
		.filter(user => user.id !== loggedInUser?.id)
		.filter(user =>
			user.name.toLowerCase().includes(searchInput.toLowerCase()) ||
			user.username.toLowerCase().includes(searchInput.toLowerCase())
		);

	return (
		<div className="p-4 space-y-6">
			{/* Search Bar */}
			<div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-2 -mx-4">
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
			</div>

			{/* Most Liked Posts Section - Responsive Design */}
			<section className="bg-gray-50 rounded-xl p-4">
				<h2 className="text-lg font-semibold mb-3">Most Liked Posts</h2>
				{loading.posts ? (
					<p>Loading popular posts...</p>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{popularPosts.map((post) => (
							<div key={post.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
								<div className="p-4">
									<div className="flex items-center mb-2">
										<Link to={`/profile/${post.author.username}`} className="mr-2">
											<div className="w-8 h-8 bg-gradient-to-br from-[#4f46e5] to-[#e946b8] rounded-full flex items-center justify-center text-white font-bold text-sm">
												{post.author?.name?.charAt(0).toUpperCase() || "U"}
											</div>
										</Link>
										<div>
											<Link to={`/profile/${post.author.username}`} className="font-medium text-sm hover:underline">
												{post.author.name}
											</Link>
											<p className="text-xs text-gray-500">@{post.author.username}</p>
										</div>
									</div>
									<p className="text-sm mb-3 line-clamp-3">{post.content}</p>
									<div className="flex items-center text-xs text-gray-500">
										<Heart className="w-4 h-4 mr-1 fill-red-500 text-red-500" />
										<span>{post.likes.length} likes</span>
										<span className="mx-2">•</span>
										<span>
											{new Date(post.createdAt).toLocaleDateString('en-US', {
												month: 'short',
												day: 'numeric'
											})}
										</span>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</section>

			{/* Suggested Users */}
			<div className="bg-gray-50 rounded-xl p-4">
				<h2 className="flex items-center text-lg font-semibold mb-3">
					<UserPlus className="mr-2 h-5 w-5" />
					Who to Follow
				</h2>
				{loading.users ? (
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
								<button className="text-sm bg-black text-white px-3 py-1 rounded-full hover:opacity-90">
									Follow
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
					</div>
				)}
			</div>
		</div>
	);
};

export default ExplorePage;