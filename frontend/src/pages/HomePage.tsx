import { useCallback, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, MoreHorizontal } from "lucide-react";

import NewPostForm from "../components/posts/NewPostForm";
import Loading from "../components/Loading";

const HomePage = () => {
	const graphqlEndpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT || "http://localhost:4000/graphql";

	interface Post {
		id: string;
		content: string;
		image?: string;
		createdAt: string;
		likes: { user: { id: string } }[];
		author: {
			id: string;
			name: string;
			username: string;
		};
	}

	const [posts, setPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchPosts = useCallback(async () => {
		try {
			const query = `
        query GetPosts {
          getPosts {
            id
            content
            image
            createdAt
            likes {
              user {
                id
              }
            }
            author {
              id
              name
              username
            }
          }
        }
      `;

			const res = await fetch(graphqlEndpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
				body: JSON.stringify({ query }),
			});

			const result = await res.json();

			if (result.errors) {
				throw new Error(result.errors[0].message);
			}

			return result.data.getPosts;
		} catch (err) {
			console.error("Error fetching posts:", err);
			throw err;
		}
	}, [graphqlEndpoint]);

	useEffect(() => {
		const loadPosts = async () => {
			try {
				const postsData = await fetchPosts();
				console.log("yiiiiiiiiiiiii", postsData)
				setPosts(postsData);
			} catch (err) {
				setError(err instanceof Error ? err.message : "An unknown error occurred");
			} finally {
				setLoading(false);
			}
		};

		loadPosts();
	}, [fetchPosts]);

	// Handle manual refresh
	if (loading) return <div className="min-h-screen flex items-center justify-center"><Loading /></div>;
	if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;
	if (posts.length === 0) return <div className="min-h-screen flex items-center justify-center">No posts to display</div>;

	return (
		<>
			{/* New Post Form */}
			<NewPostForm />

			{/* Posts Timeline */}
			<div className="space-y-4 min-h-screen">
				{posts.map((post) => (
					<div
						key={post.id}
						className="relative p-6 transition-all duration-200 bg-gray-200 border border-gray-300 rounded-xl hover:shadow-sm "
					>
						{/* Header */}
						<div className="flex items-start gap-3">
							<Link
								to={`/profile/${post.author.username}`}
								className="flex-shrink-0"
							>
								<div className="w-12 h-12 bg-gradient-to-br from-[#4f46e5] to-[#e946b8] rounded-full flex items-center justify-center text-white font-bold text-lg">
									{post.author?.name?.charAt(0).toUpperCase() || "U"}
								</div>
							</Link>

							<div className="flex-1 min-w-0">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-1">
										<Link
											to={`/profile/${post.author.username}`}
											className="font-semibold hover:underline"
										>
											{post.author.name}
										</Link>
										<span className="text-gray-500">
											@{post.author.username}
										</span>
										<span className="text-gray-400">·</span>
										<span className="text-sm text-gray-500">
											{new Date(Number(post.createdAt)).toLocaleDateString('en-US', {
												month: 'short',
												day: 'numeric'
											})}
										</span>
									</div>

									<button className="p-1 text-gray-400 rounded-full hover:bg-gray-100">
										<MoreHorizontal className="w-5 h-5" />
									</button>
								</div>

								{/* Content */}
								<div className="mt-2">
									<p className="text-gray-800 whitespace-pre-line">
										{post.content}
									</p>
								</div>

								{/* Image */}
								{post.image && (
									<div className="mt-3 overflow-hidden border rounded-xl border-gray-100">
										<img
											src={post.image}
											alt="Post content"
											className="object-cover w-full h-auto max-h-96"
											loading="lazy"
										/>
									</div>
								)}

								{/* Like Button */}
								<div className="flex justify-end mt-4">
									<button
										className={`flex items-center gap-1 p-2 rounded-full transition-colors text-gray-400 hover:text-rose-400'}`}
										aria-label="Like"
									>
										<Heart className="w-5 h-5 'fill-current" />
									</button>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</>
	);
};

export default HomePage;