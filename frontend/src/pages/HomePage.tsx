import { useCallback, useState } from "react";
import Timeline from "../components/timeline/Timeline";
import { createPost } from "../components/lib/mockData";

const HomePage = () => {
	const [refreshKey, setRefreshKey] = useState(0);
	const graphqlEndpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT || "http://localhost:4000/graphql";

	const handleSubmitPost = useCallback(async (content: string, image?: File) => {
		try {
			let imageUrl;
			if (image) {
				imageUrl = URL.createObjectURL(image);
			}

			await createPost("1", content, imageUrl); // Replace with real mutation if available
			setRefreshKey(prev => prev + 1);
		} catch (error) {
			console.error("Failed to make a post:", error);
		}
	}, []);

	const fetchPosts = useCallback(async () => {
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

		console.log("yooooo", result);

		if (result.errors) {
			console.error("GraphQL errors:", result.errors);
			throw new Error(result.errors[0].message);
		}

		return result.data.getPosts;
	}, [refreshKey]);

	return (
		<div className="min-h-screen">
			<Timeline
				title="Home"
				fetchPosts={fetchPosts}
				emptyMessage="No posts to display. Follow some users to see their posts here!"
			/>
		</div>
	);
};

export default HomePage;