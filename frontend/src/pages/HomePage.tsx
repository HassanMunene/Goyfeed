import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Heart, MoreHorizontal } from "lucide-react";

import NewPostForm from "../components/posts/NewPostForm";
import Loading from "../components/Loading";

const HomePage = () => {
	const graphqlEndpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT || "http://localhost:4000/graphql";
	const currentUserId = localStorage.getItem("userId");

	interface User {
		id: string;
		name: string;
		username: string;
	}

	interface Like {
		id: string;
		user: User;
	}

	interface Post {
		id: string;
		content: string;
		image?: string;
		createdAt: string;
		likes: Like[];
		author: User;
	}

	const [posts, setPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [likeLoading, setLikeLoading] = useState<string | null>(null);

	// Fetch posts with Fetch API
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
              id
              user {
                id
                name
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

	// Toggle like with Fetch API
	const toggleLike = async (postId: string) => {
		setLikeLoading(postId);
		try {
			const mutation = `
        mutation ToggleLike($postId: ID!) {
          toggleLike(postId: $postId) {
            success
            message
            isLiked
            post {
              id
              likes {
                id
                user {
                  id
                  name
                }
              }
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
				body: JSON.stringify({
					query: mutation,
					variables: { postId },
				}),
			});

			const result = await res.json();

			if (result.errors) {
				throw new Error(result.errors[0].message);
			}

			if (result.data.toggleLike.success) {
				setPosts(prevPosts =>
					prevPosts.map(post =>
						post.id === postId
							? { ...post, likes: result.data.toggleLike.post.likes }
							: post
					)
				);
			}
		} catch (err) {
			console.error("Error toggling like:", err);
			setError("Failed to update like. Please try again.");
			setTimeout(() => setError(null), 3000);
		} finally {
			setLikeLoading(null);
		}
	};

	// Load posts on component mount
	useEffect(() => {
		const loadPosts = async () => {
			try {
				const postsData = await fetchPosts();
				setPosts(postsData);
			} catch (err) {
				setError(err instanceof Error ? err.message : "An unknown error occurred");
			} finally {
				setLoading(false);
			}
		};

		loadPosts();
	}, [fetchPosts]);

	if (loading) return <div className="min-h-screen flex items-center justify-center"><Loading /></div>;
	if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;
	if (posts.length === 0) return <div className="min-h-screen flex items-center justify-center">No posts to display</div>;

	return (
		<>
			{/* New Post Form - Made full width on mobile */}
			<div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm pb-2 px-4 md:-mx-4">
				<NewPostForm />
			</div>

			{/* Posts Timeline - Adjusted spacing for mobile */}
			<div className="space-y-3 md:space-y-4 min-h-screen px-2 md:px-0">
				{posts.map((post) => {
					const isLiked = post?.likes?.some(like => like?.user?.id === currentUserId);
					const isLikeLoading = likeLoading === post.id;

					return (
						<div
							key={post.id}
							className="relative p-4 md:p-6 transition-all duration-200 bg-gray-200 border border-gray-300 rounded-xl hover:shadow-sm mx-2 md:mx-0"
						>
							{/* Header - Stacked on mobile */}
							<div className="flex items-start gap-3">
								<Link
									to={`/profile/${post.author.username}`}
									className="flex-shrink-0"
								>
									<div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#4f46e5] to-[#e946b8] rounded-full flex items-center justify-center text-white font-bold text-md md:text-lg">
										{post.author?.name?.charAt(0).toUpperCase() || "U"}
									</div>
								</Link>

								<div className="flex-1 min-w-0">
									<div className="flex flex-col md:flex-row md:items-center justify-between gap-1 md:gap-0">
										<div className="flex flex-wrap items-center gap-1">
											<Link
												to={`/profile/${post.author.username}`}
												className="font-semibold hover:underline text-sm md:text-base"
											>
												{post.author.name}
											</Link>
											<span className="text-gray-500 text-xs md:text-sm">
												@{post.author.username}
											</span>
											<span className="text-gray-400 hidden md:block">·</span>
											<span className="text-xs md:text-sm text-gray-500">
												{new Date(Number(post.createdAt)).toLocaleDateString('en-US', {
													month: 'short',
													day: 'numeric'
												})}
											</span>
										</div>

										<button className="p-1 text-gray-400 rounded-full hover:bg-gray-100 self-end md:self-auto">
											<MoreHorizontal className="w-4 h-4 md:w-5 md:h-5" />
										</button>
									</div>

									{/* Content - Adjusted text size for mobile */}
									<div className="mt-2">
										<p className="text-gray-800 whitespace-pre-line text-sm md:text-base">
											{post.content}
										</p>
									</div>

									{/* Image - Full width on mobile */}
									{post.image && (
										<div className="mt-3 overflow-hidden border rounded-xl border-gray-100">
											<img
												src={post.image}
												alt="Post content"
												className="object-cover w-full h-auto max-h-64 md:max-h-96"
												loading="lazy"
											/>
										</div>
									)}

									{/* Like Button - Adjusted size for mobile */}
									<div className="flex justify-end mt-3 md:mt-4">
										<button
											onClick={() => !isLikeLoading && toggleLike(post.id)}
											disabled={isLikeLoading}
											className={`flex items-center gap-1 p-1 md:p-2 rounded-full transition-all duration-200 ${isLiked
													? "text-rose-500 fill-rose-500 hover:text-rose-600"
													: "text-gray-400 hover:text-rose-400"
												} ${isLikeLoading ? "opacity-50 cursor-not-allowed" : ""}`}
											aria-label={isLiked ? "Unlike post" : "Like post"}
										>
											<div className="relative">
												<Heart
													className={`w-4 h-4 md:w-5 md:h-5 transition-all duration-200 ${isLiked
															? "fill-rose-500 scale-110"
															: "fill-transparent"
														}`}
												/>
												{isLiked && (
													<div className="absolute inset-0 bg-rose-500 rounded-full opacity-10 scale-150" />
												)}
											</div>
											{post.likes.length > 0 && (
												<span className="text-xs md:text-sm min-w-[1rem] text-center">
													{post.likes.length}
												</span>
											)}
										</button>
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</>
	);
};

export default HomePage;