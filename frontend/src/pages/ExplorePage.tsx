import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { Search } from "lucide-react";

const ExplorePage = () => {
	const [searchInput, setSearchInput] = useState("");
	const [users, setUsers] = useState<{ id: string; name: string; username: string }[]>([]);
	const [loading, setLoading] = useState(true);

	const graphqlEndpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT || "http://localhost:4000/graphql";
	const fetchUsers = async () => {
		try {
			const res = await fetch(graphqlEndpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					query: `
              query {
                getAllUsers {
                  id
                  name
                  username
                }
              }
            `
				})
			});

			const json = await res.json();
			setUsers(json.data.getAllUsers);
		} catch (err) {
			console.error("Error fetching users:", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const filteredUsers = users.filter((user) =>
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

			{/* Suggested Users */}
			<div className="bg-gray-50 rounded-xl p-4">
				<h2 className="flex items-center text-lg font-semibold mb-3">
					<UserPlus className="mr-2 h-5 w-5" />
					Who to Follow
				</h2>
				{loading ? (
					<p>Loading users...</p>
				) : (
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
				)}
			</div>

			{/* Trending Posts */}
			<section></section>
		</div>
	);
};

export default ExplorePage;